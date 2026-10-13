
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Mock Supabase Auth so tests do not need real credentials.
vi.mock("../components/supabaseClient", () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signInWithPassword: vi.fn(),
            signInWithOAuth: vi.fn(),
        },
    },
}));

import { supabase } from "../components/supabaseClient";
import Login from "../components/Login";

describe("Login component", () => {
    const onLoginSuccess = vi.fn();

    beforeEach(() => {
        // Pretend the user has no existing session.
        supabase.auth.getSession.mockResolvedValue({
            data: { session: null },
            error: null,
        });
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("displays the login form", () => {
        render(<Login onLoginSuccess={onLoginSuccess} />);

        expect(
            screen.getByRole("heading", { name: "Welcome back." })
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Log In" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Continue with Google" })
        ).toBeInTheDocument();
    });

    it("logs in successfully and saves the access token", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                session: { access_token: "test-token" },
            },
            error: null,
        });

        render(<Login onLoginSuccess={onLoginSuccess} />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Log In" }));

        await waitFor(() => {
            expect(onLoginSuccess).toHaveBeenCalledTimes(1);
        });

        expect(localStorage.getItem("mindoff_token")).toBe("test-token");

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "runner@example.com",
            password: "password123",
        });
    });

    it("shows an error when Supabase login fails", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { session: null },
            error: { message: "Invalid login credentials" },
        });

        render(<Login onLoginSuccess={onLoginSuccess} />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "wrong-password" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Log In" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Invalid login credentials"
        );
    });

    it("shows an error when Supabase returns no access token", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { session: null },
            error: null,
        });

        render(<Login onLoginSuccess={onLoginSuccess} />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Log In" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "No access token was returned."
        );
    });
});