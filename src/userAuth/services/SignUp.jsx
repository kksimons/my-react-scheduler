
import React, { useState, useEffect } from 'react'; 
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  FormHelperText, 
  ThemeProvider 
} from '@mui/material';
import theme from '@theme/theme';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength

const SignUp = () => {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Password strength state
  const [passwordScore, setPasswordScore] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Access location to read state

  // Authentication state
  const [user, loadingAuthState] = useAuthState(auth);

  // // Effect to redirect authenticated users unless coming from SelectRole
  // useEffect(() => {
  //   if (user && !loadingAuthState) {
  //     // Check if navigation state indicates to stay on SignUp
  //     //if (!(location.state && location.state.fromSelectRole)) {
  //       navigate('/SelectRole'); // Redirect to SelectRole if already authenticated and not navigating back
  //     //}
  //   }
  // }, [user, loadingAuthState, navigate]);

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailRegex.test(e.target.value)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com).');
    } else {
      setEmailError('');
    }
  };

  // Handle password input change with real-time validation and strength scoring
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
    const score = zxcvbn(pwd).score;
    setPasswordScore(score);
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Reset error messages each time the user attempts to sign up
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let isValid = true; // Assume the form is valid

    // Email validation
    if (!email) {
      setEmailError('Please enter your email.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com).');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (!isValid) return; // Exit the function if the form is invalid

    setIsLoading(true); // Show loading spinner while creating user

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Navigate to role selection, passing user ID and email
      navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
    } catch (error) {
      console.error("Error signing up:", error); // Log error to console

      // Handle Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setEmailError('This email is already in use. Please use a different email.');
          break;
        case 'auth/invalid-email':
          setEmailError('Invalid email address. Please enter a valid email (e.g., user@example.com).');
          break;
        case 'auth/weak-password':
          setPasswordError('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setGeneralError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setGeneralError('');
    setEmailError('');
    setPasswordError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setGeneralError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Toast Container for notifications */}
      <ToastContainer />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center" // Center the form horizontally
        minHeight="100vh"
        bgcolor="background.default"
        p={2}
      >
        <Box
          component="form"
          onSubmit={handleSignUp}
          display="flex"
          flexDirection="column"
          gap={2} // Use number for spacing instead of string
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
          <Typography variant="h5" component="h1" gutterBottom>
            Sign Up
          </Typography>

          {/* Display General Errors */}
          {generalError && (
            <Typography color="error" variant="body2">
              {generalError}
            </Typography>
          )}

          {/* Email Field */}
          <FormControl error={Boolean(emailError)} fullWidth>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="user@example.com"
              required
              helperText={emailError}
            />
          </FormControl>

          {/* Password Field */}
          <FormControl error={Boolean(passwordError)} fullWidth>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              helperText={passwordError}
            />
          </FormControl>

          {/* Display Password Strength */}
          <Typography variant="body2">
            Password Strength: {['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
          </Typography>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Typography align="center">Already have an account?</Typography>

          {/* Sign In Button */}
          <Button
            onClick={() => navigate('/SignIn')}
            variant="outlined"
            color="primary"
            sx={{
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign In
          </Button>

          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleSignIn}
            variant="contained"
            color="secondary"
            disabled={isLoading}
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In with Google'}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp; 
