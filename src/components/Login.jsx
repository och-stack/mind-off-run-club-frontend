
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Login({ onSignUp, onLoginSuccess }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Restore the Supabase session after redirecting back
    useEffect(() => {
        async function checkSession() {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                setError(error.message);
                return;
            }

            if (data.session?.access_token) {
                localStorage.setItem(
                    "mindoff_token",
                    data.session.access_token
                );

                onLoginSuccess();
            }
        }

        checkSession();
    }, [onLoginSuccess]);

    // Sign in with Google
    async function handleGoogleLogin() {
        setError("");
        setIsGoogleLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            setError(error.message);
            setIsGoogleLoading(false);
        }
    }

    // Sign in with email and password
    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        const form = event.currentTarget;
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;

        try {
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (error) {
                throw error;
            }

            if (!data.session?.access_token) {
                throw new Error("No access token was returned.");
            }

            localStorage.setItem(
                "mindoff_token",
                data.session.access_token
            );

            onLoginSuccess();
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-poster">
                <div className="poster-content">
                    <div className="poster-logo">
                        <img src="/run.jpeg" alt="" className="logo-icon" />
                        MIND OFF <span>RUN CLUB</span>
                    </div>

                    <div className="poster-message">

                        <p className="poster-description">
                            Move your body. Clear your mind. Find your crew.
                        </p>
                    </div>

                    <p className="poster-footer">
                        Every step is a fresh start.
                    </p>
                </div>
            </section>

            <section className="login-form-section">
                <div className="login-card">
                    <h2>Welcome back.</h2>

                    <p className="login-description">
                        Ready to run together?
                    </p>

                    <button
                        className="google-login-button"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                    >
                        {isGoogleLoading
                            ? "Connecting to Google..."
                            : "Continue with Google"}
                    </button>

                    <div className="login-divider">
                        <span>or log in with email</span>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />

                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                        {error && (
                            <p className="login-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            className="login-button"
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="login-signup">
                        <p>New to the club?</p>
                        <button
                            className="signup-link"
                            type="button"
                            onClick={onSignUp}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;