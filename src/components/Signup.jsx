
function Signup({ onBackToFeed, onLogin }) {
    function handleSubmit(event) {
        event.preventDefault();

        // Connect account creation to the backend later.
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

                        <button className="login-button" type="submit">
                            Create Account
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