
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Login from "../components/Login";

describe("Login component", () => {
    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
        localStorage.clear();
    });

    it("displays the login form", () => {
        render(<Login loginUrl="/api/login" />);

        expect(
            screen.getByRole("heading", { name: "Welcome back." })
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Log In" })
        ).toBeInTheDocument();
    });

    it("saves the token and calls onLoginSuccess after successful login", async () => {
        const onLoginSuccess = vi.fn();

        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ access_token: "test-token" }),
            })
        );

        render(
            <Login
                loginUrl="/api/login"
                onLoginSuccess={onLoginSuccess}
            />
        );

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

        expect(fetch).toHaveBeenCalledWith(
            "/api/login",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    email: "runner@example.com",
                    password: "password123",
                }),
            })
        );
    });

    it("shows an error when login fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: "Invalid email or password" }),
            })
        );

        render(<Login loginUrl="/api/login" />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "wrong-password" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Log In" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Invalid email or password"
        );
    });

    it("shows an error when the server does not return an access token", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({}),
            })
        );

        render(<Login loginUrl="/api/login" />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "runner@example.com" },
        });

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Log In" }));

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Login succeeded, but no access token was returned."
        );
    });
});