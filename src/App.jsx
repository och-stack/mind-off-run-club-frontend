/* eslint react-refresh/only-export-components: off */
import { useState } from "react";
import "./App.css";

import { testingPosts } from "./data/testingPosts";
import { testingFriends } from "./data/testingFriends";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import AddFriends from "./components/AddFriends";
import Profile from "./components/Profile";

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

function App() {
  const [currentPage, setCurrentPage] = useState("feed");
  const [posts, setPosts] = useState(testingPosts);
  const [friends] = useState(testingFriends);

  function handleCreatePost(newPost) {
    setPosts((currentPosts) => [newPost, ...currentPosts]);
  }

  function handleLoginSuccess() {
    setCurrentPage("feed");
  }

  function handleLogout() {
    localStorage.removeItem("mindoff_token");
    setCurrentPage("login");
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

  return (<div className="app"> <header className="navbar">
    <button
      className="logo"
      type="button"
      onClick={() => setCurrentPage("feed")}
    >
      MIND OFF <span>RUN CLUB</span> </button>

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
      <AddFriends />
    ) : (
      <Feed
        posts={posts}
        friends={friends}
        onCreatePost={handleCreatePost}
      />
    )}
  </div>

  );
}

export default App;
