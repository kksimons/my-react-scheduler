import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import  Box  from '@mui/material/Box';
import  TextField from '@mui/material/TextField';
import  Button  from '@mui/material/Button';
import  Typography  from '@mui/material/Typography';
import FormControl  from '@mui/material/FormControl';
import FormLabel  from '@mui/material/FormLabel';
import { ThemeProvider } from '@mui/system';
import theme from '@theme/theme';

// const SignUp = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       navigate('/SignIn'); // Direct to login after successful sign-up
//     } catch (error) {
//       console.error("Error signing up:", error);
//     }
//   };

//   //handle google sign in 
//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//       navigate('/SelectRole'); // Redirect to role selection on successful login
//     }
//     catch (error) {
//       console.error("Error logging in with Google:", error);
//     }
//     if (result.user) {
//       // Successful sign-in
//       console.log("User signed in:", result.user);
//     } else {
//       // Error occurred during sign-in
//       console.error("Sign-In Error:", result.errorMessage);
//     }
//   };




//   return (
//     <Box 
//       component="form"
//       onSubmit={handleSignUp}
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         mt: 8,
//       }}
//     >
//       <TextField
//         type="email"
//         onChange={(e) => setEmail(e.target.value)}
//         label="Email"
//         variant="outlined"
//         required
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//         label="Password"
//         variant="outlined"
//         required
//         fullWidth
//         margin="normal"
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         Sign Up
//       </Button>

//       {/* Sign up with google button */}
//       <Button
//         onClick={handleGoogleSignIn}
//         variant="contained"
//         color="secondary"
//         fullWidth
//       >
//         Sign Up with Google
//       </Button>
      
//       {/* Already has an account ? */}
//       <Typography>Already has an account ?</Typography> 

//       <Button
//         onClick={() => navigate('/SignIn')}
//         variant="contained"
//         color="primary"
//         fullWidth
//       >
//         Sign In 
//       </Button>

//     </Box>
//   );
// };

// export default SignUp;

// import { ThemeProvider } from "@mui/system";
// import theme from "@theme/theme";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/SignIn'); // Direct to login after successful sign-up
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/SelectRole'); // Redirect to role selection on successful login
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
        p="auto"
      >
        <Box
          component="form"
          onSubmit={handleSignUp}
          display="flex"
          flexDirection="column"
          gap="8px"
          backgroundColor="background.third"
          sx={{
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            p: 6,
            borderRadius: 5,
            boxShadow: 5,
          }}
        >
          <Typography variant="h5" component="h6" gutterBottom>
            Sign Up
          </Typography>
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <TextField
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password:</FormLabel>
            <TextField
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            onClick={handleGoogleSignIn}
            variant="contained"
            color="secondary"
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign Up with Google
          </Button>
          <Typography>Already have an account?</Typography>
          <Button
            onClick={() => navigate('/SignIn')}
            variant="outlined"
            color="primary"
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;