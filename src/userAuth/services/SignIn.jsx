import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme/theme';
import { ThemeProvider } from '@mui/material';


export function SignIn ()  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({}); //to handle exception when user enter wrong format 
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate form before submitting
    if (!validateForm()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/SelectRole'); // Redirect to role selection on successful login
    } catch (error) {
      console.error("Error logging in, please try again:", error);
      setFormErrors({ general: "Invalid email or password" }); // Set a general error message for invalid credentials
    }
  };

  //handle google sign in 
  const handleGoogleSignIn = async () => {
    const result = await signInWithGooglePopup();
    if (result.user) {
      // Successful sign-in
      console.log("User signed in:", result.user);
      navigate('/SelectRole'); // Redirect to role selection on successful login
    } else {
      // Error occurred during sign-in
      console.error("Sign-In Error:", result.errorMessage);
      setFormErrors({ general: "Google sign-in failed. Please try again." });
    }
  };

  //Validate form with exception message 
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter correct email format: user@example.com ";
    }

    if (formData.password.length < 6 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
        errors.password = "Password must be at least 6 characters long, contain both numbers and letters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors found
  };

  return (
    <ThemeProvider theme={theme}>
      {/* //Main container for sign in form */}
      <Box 
        display="flex"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
        p="auto"
      >
        {/* //Form container */}
        <Box
          component="form"
          onSubmit={handleSignIn}
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
          <Typography variant="h1" align="center">Sign In</Typography>

          <FormControl>
            <FormLabel>Email:</FormLabel>
            <TextField
              name="email"
              type="email"
              placeholder="ex. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
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
              error={!!formErrors.password}
              helperText={formErrors.password}
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
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoogleSignIn}
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign In with Google
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            // onClick={navigate('/SignIn')}
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

export default SignIn;




































































































































































