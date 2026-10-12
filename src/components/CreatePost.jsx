import { useState } from "react";

function CreatePost({ onCreatePost, isSubmitting = false }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [visibility, setVisibility] = useState("public");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        // Keep the form reference before waiting for the API.
        const form = event.currentTarget;

        setError("");

        if (!title.trim() || !description.trim()) {
            setError("Please enter a title and description.");
            return;
        }

        if (image && image.size > 5 * 1024 * 1024) {
            setError("Image must be 5 MB or smaller.");
            return;
        }

        try {
            // Send the post to the backend.
            await onCreatePost({
                title: title.trim(),
                content: description.trim(),
                image,
                visibility,
            });

            // Clear the form only after successful creation.
            setTitle("");
            setDescription("");
            setImage(null);
            setVisibility("public");
            form.reset();
        } catch (error) {
            setError(error.message || "Failed to create post.");
        }
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
                type="file"
                name="image"
                accept="image/*"
                aria-label="Upload image"
                onChange={(event) => {
                    setImage(event.target.files?.[0] || null);
                }}
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
                        onChange={(event) =>
                            setVisibility(event.target.value)
                        }
                    />
                    <span>Public</span>
                </label>

                <label className="visibility-option">
                    <input
                        type="radio"
                        name="visibility"
                        value="friends"
                        checked={visibility === "friends"}
                        onChange={(event) =>
                            setVisibility(event.target.value)
                        }
                    />
                    <span>Friends-only</span>
                </label>
            </div>

            {error && <p role="alert">{error}</p>}

            <button
                className="post-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Posting..." : "Post"}
            </button>
        </form>
    );
}

export default CreatePost;
