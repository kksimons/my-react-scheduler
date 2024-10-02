import React, { useEffect, useState } from "react";
import { auth } from "./userAuth/firebase"; // Update path if necessary
import { onAuthStateChanged, User } from "firebase/auth";
import SignUp from "./userAuth/SignUp";
import SignIn from "./userAuth/SignIn";
import GitHubSignIn from "./userAuth/GitHubSignIn";
import SignOut from "./userAuth/SignOut";

import SchedulerView from "./SchedulerView";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User is signed in:", user);
      } else {
        setUser(null);
        console.log("User is signed out");
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Display loading indicator while checking authentication state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <div>Welcome, {user.email}!</div>
          <SignOut />
          <SchedulerView />
        </div>
      ) : (
        <div>
          {/* Show authentication components when user is not logged in */}
          <SignUp />
          <SignIn />
          <GitHubSignIn />
        </div>
      )}
    </div>
  );
};

export default Home;
