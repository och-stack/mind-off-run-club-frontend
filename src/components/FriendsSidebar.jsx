
function FriendsSidebar({ friends }) {
    return (
        <aside className="friends-section">
            <h2>Your Crew</h2>

            {friends.map((friend) => (
                <div className="friend-item" key={friend.id}>
                    <div className="friend-avatar">
                        {friend.avatar_url ? (
                            <img
                                src={friend.avatar_url}
                                alt={`${friend.username}'s profile`}
                            />
                        ) : (
                            friend.username.charAt(0).toUpperCase()
                        )}
                    </div>

                    <span className="friend-name">{friend.username}</span>
                </div>
            ))}
        </aside>
    );
}

export default FriendsSidebar;