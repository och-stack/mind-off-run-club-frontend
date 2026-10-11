
function Login({ onBackToFeed, onSignUp }) {
    function handleSubmit(event) {
        event.preventDefault();

        // Connect login authentication to the backend later.
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
                        <p className="poster-eyebrow">YOUR RUNNING COMMUNITY</p>

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
                    <p className="login-description">Ready to run together?</p>

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

                        <button className="login-button" type="submit">
                            Log In
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