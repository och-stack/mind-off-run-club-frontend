import { useEffect, useState } from "react";

function AddFriends({ usersUrl, friendsUrl }) {
    const [users, setUsers] = useState([]);
    const [friendStatuses, setFriendStatuses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Load users and their saved friendship statuses.
    useEffect(() => {
        async function loadFriendsPage() {
            const token = localStorage.getItem("mindoff_token");

            if (!token) {
                setError("Please log in to find running friends.");
                setIsLoading(false);
                return;
            }

            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [usersResponse, friendsResponse] =
                    await Promise.all([
                        fetch(usersUrl, { headers }),
                        fetch(friendsUrl, { headers }),
                    ]);

                const usersData = await usersResponse.json();
                const friendsData = await friendsResponse.json();

                if (!usersResponse.ok) {
                    throw new Error(
                        usersData.error || "Failed to load users."
                    );
                }

                if (!friendsResponse.ok) {
                    throw new Error(
                        friendsData.error || "Failed to load friendships."
                    );
                }

                const usersList = Array.isArray(usersData)
                    ? usersData
                    : usersData.users || [];

                setUsers(usersList);

                // Restore statuses using the saved friendship data.
                const statuses = {};

                usersList.forEach((user) => {
                    if (user.friendship_status === "pending") {
                        statuses[user.id] =
                            user.friendship_direction === "incoming"
                                ? "Accept Request"
                                : "Pending";
                    } else if (user.friendship_status === "accepted") {
                        statuses[user.id] = "Added";
                    }
                });

                // Use GET /friends as a fallback for saved requests.
                if (Array.isArray(friendsData)) {
                    friendsData.forEach((friendship) => {
                        const otherUserId =
                            friendship.friendship_direction === "incoming"
                                ? friendship.requester_id
                                : friendship.receiver_id;

                        if (friendship.status === "pending") {
                            statuses[otherUserId] =
                                friendship.friendship_direction === "incoming"
                                    ? "Accept Request"
                                    : "Pending";
                        } else if (friendship.status === "accepted") {
                            statuses[otherUserId] = "Added";
                        }
                    });
                }

                setFriendStatuses(statuses);
            } catch (error) {
                setError(error.message || "Failed to load friends.");
            } finally {
                setIsLoading(false);
            }
        }

        loadFriendsPage();
    }, [usersUrl, friendsUrl]);

    // Send a friend request to the selected user.
    async function handleFriendClick(userId) {
        const token = localStorage.getItem("mindoff_token");

        if (!token) {
            setError("Please log in to add friends.");
            return;
        }

        setError("");

        try {
            const response = await fetch(friendsUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ friend_id: userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to send friend request."
                );
            }

            setFriendStatuses((currentStatuses) => ({
                ...currentStatuses,
                [userId]: "Pending",
            }));
        } catch (error) {
            setError(error.message || "Failed to send friend request.");
        }
    }

    // Accept an incoming friend request.
    async function handleAcceptRequest(userId) {
        const token = localStorage.getItem("mindoff_token");

        if (!token) {
            setError("Please log in to accept friend requests.");
            return;
        }

        setError("");

        try {
            const response = await fetch(friendsUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const friendships = await response.json();

            if (!response.ok) {
                throw new Error(
                    friendships.error || "Failed to load friend requests."
                );
            }

            const request = friendships.find(
                (friendship) =>
                    friendship.requester_id === userId &&
                    friendship.friendship_direction === "incoming" &&
                    friendship.status === "pending"
            );

            if (!request) {
                throw new Error("Pending friend request not found.");
            }

            const acceptResponse = await fetch(
                `${friendsUrl}/${request.friendship_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const acceptData = await acceptResponse.json();

            if (!acceptResponse.ok) {
                throw new Error(
                    acceptData.error || "Failed to accept friend request."
                );
            }

            setFriendStatuses((currentStatuses) => ({
                ...currentStatuses,
                [userId]: "Added",
            }));
        } catch (error) {
            setError(error.message || "Failed to accept friend request.");
        }
    }

    return (
        <main className="add-friends-page">
            <div className="add-friends-page-header">
                <h1>Find Your Running Crew</h1>
                <p>Connect with people who keep you moving.</p>
            </div>

            {isLoading && <p role="status">Loading users...</p>}
            {error && <p role="alert">{error}</p>}

            <section className="add-friends-list">
                {!isLoading && users.length === 0 && !error && (
                    <p>No users found.</p>
                )}

                {users.map((user) => {
                    const status =
                        friendStatuses[user.id] || "Add Friend";

                    return (
                        <div className="add-friend-item" key={user.id}>
                            <div className="add-friend-avatar">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={`${user.username}'s profile`}
                                    />
                                ) : (
                                    user.username.charAt(0).toUpperCase()
                                )}
                            </div>

                            <p className="add-friend-name">
                                {user.username}
                            </p>

                            <button
                                className={`friend-status-button ${status === "Pending"
                                        ? "pending"
                                        : status === "Added"
                                            ? "added"
                                            : ""
                                    }`}
                                type="button"
                                onClick={() => {
                                    if (status === "Accept Request") {
                                        handleAcceptRequest(user.id);
                                    } else if (status === "Add Friend") {
                                        handleFriendClick(user.id);
                                    }
                                }}
                                disabled={
                                    status === "Pending" ||
                                    status === "Added"
                                }
                            >
                                {status}
                            </button>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}

export default AddFriends;
