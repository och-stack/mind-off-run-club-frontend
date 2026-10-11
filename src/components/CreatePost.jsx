
import { useState } from "react";

function CreatePost({ onCreatePost }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [visibility, setVisibility] = useState("public");

    function handleSubmit(event) {
        event.preventDefault();

        if (!title.trim() || !description.trim()) {
            return;
        }

        const newPost = {
            id: Date.now(),
            user_id: null,
            username: "You",
            avatar_url: "",
            title: title.trim(),
            content: description.trim(),
            image_url: imageUrl.trim(),
            created_at: new Date().toISOString(),
            visibility,
        };

        onCreatePost(newPost);

        setTitle("");
        setDescription("");
        setImageUrl("");
        setVisibility("public");

        // Later: send the new post to the backend API.
    }

    return (
        <form className="create-post" onSubmit={handleSubmit}>
            <h2>Share your run</h2>

            <input
                type="text"
                name="title"
                placeholder="Give your post a title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="Post title"
                required
            />

            <textarea
                name="content"
                placeholder="What's on your mind?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-label="Post description"
                rows="4"
                required
            />

            <input
                type="url"
                name="image_url"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                aria-label="Image URL"
            />

            <div className="visibility-options">
                <span className="visibility-label">
                    Who can see your post?
                </span>

                <label className="visibility-option">
                    <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={visibility === "public"}
                        onChange={(event) => setVisibility(event.target.value)}
                    />
                    <span>Public</span>
                </label>

                <label className="visibility-option">
                    <input
                        type="radio"
                        name="visibility"
                        value="friends"
                        checked={visibility === "friends"}
                        onChange={(event) => setVisibility(event.target.value)}
                    />
                    <span>Friends-only</span>
                </label>
            </div>

            <button className="post-button" type="submit">
                Post
            </button>
        </form>
    );
}

export default CreatePost;