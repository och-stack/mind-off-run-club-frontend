import { useState } from "react";
import { testingUsers } from "../data/testingUsers";

function AddFriends() {
    const [friendStatuses, setFriendStatuses] = useState({});

    function handleFriendClick(userId) {
        setFriendStatuses((currentStatuses) => {
            const currentStatus = currentStatuses[userId] || "Add Friend";

            if (currentStatus === "Add Friend") {
                return {
                    ...currentStatuses,
                    [userId]: "Pending",
                };
            }

            if (currentStatus === "Pending") {
                return {
                    ...currentStatuses,
                    [userId]: "Added",
                };
            }

            return currentStatuses;
        });
    }

    return (
        <main className="add-friends-page">
            <div className="add-friends-page-header">
                <h1>Find Your Running Crew</h1>
                <p>Connect with people who keep you moving.</p>
            </div>

            <section className="add-friends-list">
                {testingUsers.map((user) => {
                    const status = friendStatuses[user.id] || "Add Friend";

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
                                onClick={() => handleFriendClick(user.id)}
                                disabled={status === "Added"}
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
