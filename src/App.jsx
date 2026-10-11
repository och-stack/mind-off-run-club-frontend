import { useState } from "react";
import "./App.css";

import { testingPosts } from "./data/testingPosts";
import { testingFriends } from "./data/testingFriends";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import AddFriends from "./components/AddFriends";
import Profile from "./components/Profile";

function App() {
  const [currentPage, setCurrentPage] = useState("feed");
  const [posts, setPosts] = useState(testingPosts);
  const [friends] = useState(testingFriends);

  function handleCreatePost(newPost) {
    setPosts((currentPosts) => [newPost, ...currentPosts]);
  }

  if (currentPage === "login") {
    return (
      <Login
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
            onClick={() => setCurrentPage("login")}
          >
            Log Out
          </button>
        </div>
      </header>

      {currentPage === "profile" ? (
        <Profile />
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
