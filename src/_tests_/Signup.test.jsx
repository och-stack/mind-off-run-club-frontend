
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../components/Signup";

vi.mock("../App", () => ({
    ENDPOINTS: {
        signup: "/api/signup",
    },
}));

describe("Signup component", () => {
    it("displays the signup form", () => {
        render(<Signup />);

        expect(
            screen.getByRole("heading", { name: "Join the club." })
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Create Account" })
        ).toBeInTheDocument();
    });

    it("shows a success message when signup succeeds", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ message: "Signup successful" }),
            })
        );

        render(<Signup />);

        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "runner123" },
        });

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        await waitFor(() => {
            expect(screen.getByRole("status")).toHaveTextContent(
                "Account created successfully!"
            );
        });

        expect(fetch).toHaveBeenCalledWith(
            "/api/signup",
            expect.objectContaining({
                method: "POST",
            })
        );

        vi.unstubAllGlobals();
    });

    it("shows an error message when signup fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: "Email already exists" }),
            })
        );

        render(<Signup />);

        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "runner123" },
        });

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "Email already exists"
            );
        });

        vi.unstubAllGlobals();
    });
});