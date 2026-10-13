
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Mock Supabase Auth so tests do not need real credentials.
vi.mock("../components/supabaseClient", () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

import { supabase } from "../components/supabaseClient";
import Signup from "../components/Signup";

describe("Signup component", () => {
    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
    });

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

    it("creates an account and saves the token when a session is returned", async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: {
                session: { access_token: "signup-test-token" },
            },
            error: null,
        });

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

        expect(await screen.findByRole("status")).toHaveTextContent(
            "Account created successfully! You can now log in."
        );

        expect(localStorage.getItem("mindoff_token")).toBe(
            "signup-test-token"
        );

        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: "runner@example.com",
            password: "password123",
            options: {
                data: {
                    username: "runner123",
                },
            },
        });
    });

    it("asks the user to confirm their email when no session is returned", async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { session: null },
            error: null,
        });

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

        expect(await screen.findByRole("status")).toHaveTextContent(
            "Please check your email to confirm your account before logging in."
        );

        expect(localStorage.getItem("mindoff_token")).toBeNull();
    });

    it("shows an error when Supabase signup fails", async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { session: null },
            error: { message: "User already registered" },
        });

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

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "User already registered"
        );
    });
});