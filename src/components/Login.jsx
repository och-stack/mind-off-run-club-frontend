import { useState } from "react";

function Login({
    loginUrl,
    onBackToFeed,
    onSignUp,
    onLoginSuccess,
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        const form = event.currentTarget;
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;

        try {
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed.");
            }

            if (!data.access_token) {
                throw new Error("Login succeeded, but no access token was returned.");
            }

            localStorage.setItem("mindoff_token", data.access_token);

            onLoginSuccess();
        } catch (error) {
            setError(
                error.message === "Failed to fetch"
                    ? "Unable to connect to the server. Please check the API URL and try again."
                    : error.message
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-poster">
                <div className="poster-content">
                    <button
                        className="poster-logo"
                        type="button"
                        onClick={onBackToFeed}
                    >
                        MIND OFF <span>RUN CLUB</span>
                    </button>

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
                    <button
                        className="back-to-feed"
                        type="button"
                        onClick={onBackToFeed}
                    >
                        ← Back to Feed
                    </button>

                    <h2>Welcome back.</h2>
                    <p className="login-description">
                        Ready to run together?
                    </p>

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
                            disabled={isLoading}
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
