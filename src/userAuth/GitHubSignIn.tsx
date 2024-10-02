// src/userAuth/GitHubSignIn.tsx
import React from "react";
import { auth, githubProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

const GitHubSignIn: React.FC = () => {
  const handleSignInWithGitHub = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        // Signed in successfully
        console.log("GitHub user signed in:", result.user);
      })
      .catch((error) => {
        console.error("Error signing in with GitHub:", error.message);
      });
  };

  return <button onClick={handleSignInWithGitHub}>Sign in with GitHub</button>;
};

export default GitHubSignIn;
