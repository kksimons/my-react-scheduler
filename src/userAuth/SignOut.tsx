
import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const SignOut: React.FC = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
  
};

export default SignOut;
