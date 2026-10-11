function Profile() {
    const user = {
        username: "Runner123",
        email: "runner@example.com",
        bio: "Running to clear my mind.",
    };

    return (
        <main className="profile-page">
            <div className="profile-content">
                <div className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <h1>{user.username}</h1>

                <p className="profile-email">{user.email}</p>

                <p className="profile-bio">{user.bio}</p>

                <button type="button" className="post-button">
                    Edit Profile
                </button>
            </div>
        </main>
    );
}

export default Profile;
