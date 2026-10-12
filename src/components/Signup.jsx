
import { useState } from "react";
import { supabase } from "./supabaseClient";

function Signup({ onLogin }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const username = formData.get("username").trim();
        const email = formData.get("email").trim();
        const password = formData.get("password");

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) {
                throw error;
            }

            if (data.session?.access_token) {
                localStorage.setItem(
                    "mindoff_token",
                    data.session.access_token
                );

                setSuccess(
                    "Account created successfully! You can now log in."
                );
            } else {
                setSuccess(
                    "Account created! Please check your email to confirm your account before logging in."
                );
            }
        } catch (err) {
            setError(
                err.message || "Unable to create your account."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-poster">
                <div className="poster-content">
                    <div className="poster-logo">
                        MIND OFF <span>RUN CLUB</span>
                    </div>

                    <div className="poster-message">
                        <p className="poster-eyebrow">
                            YOUR RUNNING COMMUNITY
                        </p>

                        <h1>
                            FIND YOUR PACE.
                            <br />
                            <span>CLEAR YOUR MIND.</span>
                        </h1>

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
                    <h2>Join the club.</h2>

                    <p className="login-description">
                        Create an account and find your running crew.
                    </p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            autoComplete="username"
                            required
                        />

                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />

                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />

                        {error && (
                            <p className="login-error" role="alert">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p role="status">
                                {success}
                            </p>
                        )}

                        <button
                            className="login-button"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <div className="login-signup">
                        <p>Already a member?</p>
                        <button
                            className="signup-link"
                            type="button"
                            onClick={onLogin}
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Signup;