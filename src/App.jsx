
/* eslint react-refresh/only-export-components: off */
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import AddFriends from "./components/AddFriends";
import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";

export const ENDPOINTS = {
  signup: "https://mind-off-run-club-api-production.up.railway.app/signup",
  login: "https://mind-off-run-club-api-production.up.railway.app/login",
  posts: "https://mind-off-run-club-api-production.up.railway.app/posts",
  createPost: "https://mind-off-run-club-api-production.up.railway.app/posts",
  users: "https://mind-off-run-club-api-production.up.railway.app/users",
  friends: "https://mind-off-run-club-api-production.up.railway.app/friends",
  acceptFriend: "https://mind-off-run-club-api-production.up.railway.app/friends",
  profile: "https://mind-off-run-club-api-production.up.railway.app/profile",
};

function AppContent() {
  const { user, loading: isAuthLoading, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [friends] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [feedError, setFeedError] = useState("");

  // Show the login page when there is no authenticated user.
  useEffect(() => {
    if (isAuthLoading) return;

    if (user) {
      setCurrentPage((page) =>
        page === "login" || page === "signup" ? "feed" : page
      );
    } else {
      setPosts([]);
      setCurrentPage("login");
    }
  }, [user, isAuthLoading]);

  // Load posts when the user opens the feed.
  useEffect(() => {
    if (isAuthLoading || !user || currentPage !== "feed") {
      return;
    }

    const token = localStorage.getItem("mindoff_token");

    if (!token) return;

    async function loadPosts() {
      setIsLoadingPosts(true);
      setFeedError("");

      try {
        const response = await fetch(ENDPOINTS.posts, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load posts.");
        }

        setPosts(data);
      } catch (error) {
        setFeedError(error.message || "Failed to load posts.");
      } finally {
        setIsLoadingPosts(false);
      }
    }

    loadPosts();
  }, [currentPage, user, isAuthLoading]);

  // Create a post and refresh the feed.
  async function handleCreatePost(newPost) {
    const token = localStorage.getItem("mindoff_token");

    if (!token) {
      throw new Error("Please log in to create a post.");
    }

    const formData = new FormData();

    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    formData.append("visibility", newPost.visibility);

    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    setIsSubmittingPost(true);
    setFeedError("");

    try {
      const response = await fetch(ENDPOINTS.createPost, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post.");
      }

      const postsResponse = await fetch(ENDPOINTS.posts, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPosts = await postsResponse.json();

      if (!postsResponse.ok) {
        throw new Error(
          updatedPosts.error ||
          "Your post was created, but the feed could not be refreshed."
        );
      }

      setPosts(updatedPosts);
    } catch (error) {
      setFeedError(error.message || "Failed to create post.");
      throw error;
    } finally {
      setIsSubmittingPost(false);
    }
  }

  function handleLoginSuccess() {
    setCurrentPage("feed");
  }

  async function handleLogout() {
    await logout();
    setPosts([]);
    setFeedError("");
    setCurrentPage("login");
  }

  // Wait until Supabase has checked the saved session.
  if (isAuthLoading) {
    return <p role="status">Checking login...</p>;
  }

  if (currentPage === "login") {
    return (
      <Login
        loginUrl={ENDPOINTS.login}
        onLoginSuccess={handleLoginSuccess}
        onBackToFeed={() => setCurrentPage("feed")}
        onSignUp={() => setCurrentPage("signup")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <Signup
        onBackToFeed={() => setCurrentPage("feed")}
        onLogin={() => setCurrentPage("login")}
      />
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <button
          className="logo"
          type="button"
          onClick={() => setCurrentPage("feed")}
        >
          MIND OFF <span>RUN CLUB</span>
        </button>

        <div className="nav-actions">
          <button
            className="add-friends-button"
            type="button"
            onClick={() => setCurrentPage("feed")}
          >
            Feed
          </button>

          <button
            className="add-friends-button"
            type="button"
            onClick={() => setCurrentPage("addFriends")}
          >
            Add Friends
          </button>

          <button
            className="add-friends-button"
            type="button"
            onClick={() => setCurrentPage("profile")}
          >
            Profile
          </button>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </header>

      {currentPage === "profile" ? (
        <Profile
          profileUrl={ENDPOINTS.profile}
          token={localStorage.getItem("mindoff_token")}
        />
      ) : currentPage === "addFriends" ? (
        <AddFriends
          usersUrl={ENDPOINTS.users}
          friendsUrl={ENDPOINTS.friends}
        />
      ) : (
        <>
          {isLoadingPosts && <p role="status">Loading posts...</p>}
          {feedError && <p role="alert">{feedError}</p>}

          <Feed
            posts={posts}
            friends={friends}
            onCreatePost={handleCreatePost}
            isSubmittingPost={isSubmittingPost}
          />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;