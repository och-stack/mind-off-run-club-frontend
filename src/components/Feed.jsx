
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import FriendsSidebar from "./FriendsSidebar";

function Feed({ posts, friends, onCreatePost, isSubmittingPost }) {
    return (
        <main className="dashboard">
            <section className="feed-section">
                <div className="section-heading">
                    <h1>Community Feed</h1>
                    <p>Move your body. Clear your mind.</p>
                </div>

                <CreatePost
                    onCreatePost={onCreatePost}
                    isSubmitting={isSubmittingPost}
                />

                <div className="posts-list">
                    {posts.map((post) => (
                        <PostCard post={post} key={post.id} />
                    ))}

                    {posts.length === 0 && (
                        <p className="empty-posts">
                            No posts yet. Be the first to share your run!
                        </p>
                    )}
                </div>
            </section>

            <FriendsSidebar friends={friends} />
        </main>
    );
}

export default Feed;