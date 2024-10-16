// import React, { useState, useEffect } from "react";
// import { Box, Paper, Typography, Button } from "@mui/material";

// import SignUp from "../userAuth/SignUp";
// import SignOut from "../userAuth/SignOut";
// import { useUserStore } from "../stores/useUserStore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../userAuth/firebase";

// import SignInSide from "../userAuth/ManagerSignIn/ManagerSignInPage"; 
// import SignUpSide from "../userAuth/ManagerSignUp/ManagerSignUpPage";

// const HomePage: React.FC = () => {
//   const { isLoggedIn, setIsLoggedIn, setRole } = useUserStore();
//   const [isNewUser, setIsNewUser] = useState(true);
  

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user: any) => {
//       if (user) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [setIsLoggedIn]);

//   return (
//     <Box>
//       {isLoggedIn ? (
//         <Paper>
//           <Typography variant="h6">You are logged in.</Typography>
//         </Paper>
//       ) : (
//         <Paper>
//           <Box sx={{ 
//             display: 'flex',
//             flexDirection: 'row',
//             gap: 1,
//             alignItems: 'center', 
//             width: "50%", 
//           }}>
//             <Button variant={isNewUser ? "contained" : "outlined"} onClick={() => setIsNewUser(true)} fullWidth>
//               New here? Sign up
//             </Button>
//             <Button variant={!isNewUser ? "contained" : "outlined"} onClick={() => setIsNewUser(false)} fullWidth>
//               Already a user? Log In
//             </Button>
//           </Box>
//           {isNewUser ? <SignUpSide /> : <SignInSide />} 
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default HomePage;