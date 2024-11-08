import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';

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

  //handle google sign in 
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/SelectRole'); // Redirect to role selection on successful login
    }
    catch (error) {
      console.error("Error logging in with Google:", error);
    }
    if (result.user) {
      // Successful sign-in
      console.log("User signed in:", result.user);
    } else {
      // Error occurred during sign-in
      console.error("Sign-In Error:", result.errorMessage);
    }
  };




  return (
    <Box 
      component="form"
      onSubmit={handleSignUp}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <TextField
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        variant="outlined"
        required
        fullWidth
        margin="normal"
      />
      <TextField
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        variant="outlined"
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </Button>
      <Button
        onClick={handleGoogleSignIn}
        variant="contained"
        color="secondary"
        fullWidth
      >
        Sign Up with Google
      </Button>
    </Box>
  );
};

export default SignUp;
