import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function SignIn ()  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/SelectRole'); // Redirect to role selection on successful login
    } catch (error) {
      console.error("Error logging in, please try again:", error);
    }
  };

  //handle google sign in 
  const handleGoogleSignIn = async () => {
    const result = await signInWithGooglePopup();
    if (result.user) {
      // Successful sign-in
      console.log("User signed in:", result.user);
    } else {
      // Error occurred during sign-in
      console.error("Sign-In Error:", result.errorMessage);
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        {/* Box for input: email and password */}
        <Box sx={{ mb: 2, width: '100%' }}>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
          Sign In
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleGoogleSignIn}>
          Sign In with Google
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
