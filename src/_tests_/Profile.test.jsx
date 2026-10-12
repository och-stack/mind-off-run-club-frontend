
import { describe, it, expect, vi, afterEach } from "vitest";
import {
    render,
    screen,
    fireEvent,
    cleanup,
} from "@testing-library/react";
import Profile from "../components/Profile";

describe("Profile component", () => {
    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("displays the loaded profile information", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    profile: {
                        username: "runner123",
                        email: "runner@example.com",
                        bio: "Enjoying every run.",
                    },
                }),
            })
        );

        render(
            <Profile profileUrl="/api/profile" token="test-token" />
        );

        expect(await screen.findByRole("heading", {
            name: "runner123",
        })).toBeInTheDocument();

        expect(screen.getByText("runner@example.com")).toBeInTheDocument();
        expect(screen.getByText("Enjoying every run.")).toBeInTheDocument();
    });

    it("asks the user to log in when there is no token", async () => {
        render(<Profile profileUrl="/api/profile" token="" />);

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Please log in to view your profile."
        );
    });

    it("allows the user to edit and save their profile", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({
                        profile: {
                            username: "runner123",
                            email: "runner@example.com",
                            bio: "Old bio",
                        },
                    }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({
                        profile: {
                            username: "newrunner",
                            bio: "My new running journey.",
                        },
                    }),
                })
        );

        render(
            <Profile profileUrl="/api/profile" token="test-token" />
        );

        fireEvent.click(
            await screen.findByRole("button", { name: "Edit Profile" })
        );

        fireEvent.change(screen.getByRole("textbox", { name: "Username" }), {
            target: { value: "newrunner" },
        });

        fireEvent.change(screen.getByRole("textbox", { name: "Bio" }), {
            target: { value: "My new running journey." },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        expect(await screen.findByRole("status")).toHaveTextContent(
            "Profile updated successfully!"
        );

        expect(
            screen.getByRole("heading", { name: "newrunner" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("My new running journey.")
        ).toBeInTheDocument();

        expect(fetch).toHaveBeenCalledTimes(2);

        expect(fetch).toHaveBeenLastCalledWith(
            "/api/profile",
            expect.objectContaining({
                method: "PUT",
                headers: expect.objectContaining({
                    Authorization: "Bearer test-token",
                }),
                body: JSON.stringify({
                    username: "newrunner",
                    bio: "My new running journey.",
                }),
            })
        );
    });

    it("shows an error when the profile cannot be loaded", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: "Failed to load profile." }),
            })
        );

        render(
            <Profile profileUrl="/api/profile" token="test-token" />
        );

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Failed to load profile."
        );
    });
});
