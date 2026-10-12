import { useEffect, useState } from "react";

function Profile({ profileUrl, token }) {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            if (!token) {
                setError("Please log in to view your profile.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(profileUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load profile.");
                }

                const profile = data.profile || data.user || data;

                setUser(profile);
                setUsername(profile.username || "");
                setBio(profile.bio || "");
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, [profileUrl, token]);

    function handleEdit() {
        setUsername(user.username || "");
        setBio(user.bio || "");
        setError("");
        setMessage("");
        setIsEditing(true);
    }

    function handleCancel() {
        setUsername(user.username || "");
        setBio(user.bio || "");
        setError("");
        setIsEditing(false);
    }

    async function handleSave(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(profileUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: username.trim(),
                    bio: bio.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile.");
            }

            const updatedProfile = data.profile || data.user || data;

            setUser((currentUser) => ({
                ...currentUser,
                ...updatedProfile,
                username: updatedProfile.username || username.trim(),
                bio: updatedProfile.bio ?? bio.trim(),
            }));

            setIsEditing(false);
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <main className="profile-page">
                <div className="profile-content">
                    <p>Loading profile...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="profile-page">
                <div className="profile-content">
                    <p role="alert">
                        {error || "Unable to load your profile."}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-content">
                <div className="profile-avatar">
                    {(user.username || "?").charAt(0).toUpperCase()}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave}>
                        <input
                            className="profile-username-input"
                            type="text"
                            aria-label="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />

                        <p className="profile-email">{user.email}</p>

                        <textarea
                            className="profile-bio-input"
                            aria-label="Bio"
                            placeholder="Write a short bio..."
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            rows={3}
                        />

                        {error && <p role="alert">{error}</p>}

                        <button
                            type="submit"
                            className="post-button"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            className="post-button"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <>
                        <h1>{user.username}</h1>

                        <p className="profile-email">{user.email}</p>

                        <p className="profile-bio">
                            {user.bio || "No bio yet."}
                        </p>

                        {message && <p role="status">{message}</p>}
                        {error && <p role="alert">{error}</p>}

                        <button
                            type="button"
                            className="post-button"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </main>
    );

}

export default Profile;
