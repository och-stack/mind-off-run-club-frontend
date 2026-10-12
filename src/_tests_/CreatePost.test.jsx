import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreatePost from "../components/CreatePost";

describe("CreatePost", () => {
    it("displays the post creation form", () => {
        render(<CreatePost onCreatePost={vi.fn()} />);

        expect(
            screen.getByRole("heading", { name: "Share your run" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Post" })
        ).toBeInTheDocument();
    });

    it("creates a public post with the entered details and image", async () => {
        const user = userEvent.setup();
        const onCreatePost = vi.fn().mockResolvedValue(undefined);

        render(<CreatePost onCreatePost={onCreatePost} />);

        await user.type(screen.getByLabelText("Post title"), "Morning Run");
        await user.type(
            screen.getByLabelText("Post description"),
            "Ran 5 km today!"
        );

        const image = new File(["image content"], "run.png", {
            type: "image/png",
        });

        await user.upload(screen.getByLabelText("Upload image"), image);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(onCreatePost).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Morning Run",
                    content: "Ran 5 km today!",
                    image,
                    visibility: "public",
                })
            );
        });
    });

    it("creates a friends-only post when selected", async () => {
        const user = userEvent.setup();
        const onCreatePost = vi.fn().mockResolvedValue(undefined);

        render(<CreatePost onCreatePost={onCreatePost} />);

        await user.type(screen.getByLabelText("Post title"), "Evening Run");
        await user.type(
            screen.getByLabelText("Post description"),
            "A relaxing run after work."
        );

        await user.click(
            screen.getByRole("radio", { name: "Friends-only" })
        );
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(onCreatePost).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Evening Run",
                    content: "A relaxing run after work.",
                    visibility: "friends",
                })
            );
        });
    });

    it("does not submit when the title or content is empty", () => {
        const onCreatePost = vi.fn();

        render(<CreatePost onCreatePost={onCreatePost} />);

        fireEvent.click(screen.getByRole("button", { name: "Post" }));

        expect(onCreatePost).not.toHaveBeenCalled();
    });
});
