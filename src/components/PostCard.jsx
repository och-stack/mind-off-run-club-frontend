
function getRelativeTime(dateString) {
    const postTime = new Date(dateString).getTime();

    if (Number.isNaN(postTime)) {
        return "";
    }

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - postTime) / 1000)
    );

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

    return `${Math.floor(seconds / 86400)}d ago`;
}

function PostCard({ post }) {
    return (
        <article className="post-card">
            <div className="post-author">
                <div className="profile-avatar">
                    {post.avatar_url ? (
                        <img
                            src={post.avatar_url}
                            alt={`${post.username}'s profile`}
                        />
                    ) : (
                        post.username.charAt(0).toUpperCase()
                    )}
                </div>

                <span>{post.username}</span>
            </div>

            <h2 className="post-title">{post.title}</h2>

            <p className="post-description">{post.content}</p>

            {post.image_url && (
                <img
                    className="post-image"
                    src={post.image_url}
                    alt={post.title}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />
            )}

            <div className="post-meta">
                <p className="post-date">
                    {getRelativeTime(post.created_at)}
                </p>

                <span className="post-visibility">
                    {post.visibility === "friends" ? "Friends-only" : "Public"}
                </span>
            </div>
        </article>
    );
}

export default PostCard;