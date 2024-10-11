// // src/App.js
// import React, { useEffect, useState } from "react";
// import { auth } from "./userAuth/firebase"; // Update this path
// import { onAuthStateChanged } from "firebase/auth";
// import SignUp from "./userAuth/SignUp"; // Update this path
// import SignIn from "./userAuth/SignIn"; // Update this path
// import GitHubSignIn from "./userAuth/GitHubSignIn"; // Import GitHubSignIn component
// import SignOut from "./userAuth/SignOut"; // Import SignOut component

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         console.log("User is signed in:", user);
//       } else {
//         setUser(null);
//         console.log("User is signed out");
//       }
//       setLoading(false);
//     });

//     // Cleanup subscription
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {user ? (
//         <div>
//           <div>Welcome, {user.email}!</div>
//           <SignOut />
//         </div>
//       ) : (
//         <div>
//           <SignUp />
//           <SignIn />
//           <GitHubSignIn />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
