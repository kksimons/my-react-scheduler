
import React, { useState } from 'react'; 
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  ThemeProvider,
  Divider, 
  Link,
} from '@mui/material';
import theme from '@theme/theme'; // Ensure the correct path

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { useAuthState } from 'react-firebase-hooks/auth';
import zxcvbn from 'zxcvbn';

import Logo from '../../assets/logo-transparent.png'; 
import GoogleIcon from '@mui/icons-material/Google';

const SignUp = () => {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Password strength state
  const [passwordScore, setPasswordScore] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Access location to read state

  // Authentication state
  const [user, loadingAuthState] = useAuthState(auth);

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle password input change with real-time validation and strength scoring
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const score = zxcvbn(pwd).score;
    setPasswordScore(score); //i want to get rid if the password strength showing on the page omg 
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate inputs before attempting to sign up
    if (!email) {
      toast.error('Please enter your email.');
      return;
    } else if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address (e.g., user@example.com).');
      return;
    }

    if (!password) {
      toast.error('Please enter your password.');
      return;
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true); // Show loading spinner while creating user

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Navigate to role selection, passing user ID and email
      navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
    } catch (error) {
      console.error("Error signing up:", error); // Log error to console

      // Handle Firebase Auth errors with toast notifications
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('This email is already in use. Please use a different email.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address. Please enter a valid email (e.g., user@example.com).');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Please choose a stronger password.');
          break;
        default:
          toast.error('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Toast Container for notifications */}
      {/* <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
        p={2}
      >
        <Box
          component="form"
          onSubmit={handleSignUp}
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="background.third"
          sx={{
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            p: 6,
            borderRadius: 5,
            boxShadow: 5,
          }}
        >
          <img src={Logo} alt="" width={170} />
          <Typography variant="h4" component="h1" align="center" sx={{fontWeight:"bold"}} gutterBottom>
            Sign Up
          </Typography>

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="user@example.com"
            required
            fullWidth
          />

          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
          />

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

          <Divider>or</Divider>
          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleSignIn}
            variant="contained"
            color="secondary"
            disabled={isLoading}
            startIcon={<GoogleIcon />}
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
          
          {/* Already have an account ? sign in */}
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                onClick={() => navigate('/SignIn')}
                sx={{ alignSelf: 'center', cursor: 'pointer', color: 'primary.main' }}
              >
                Sign in
              </Link>
          </Typography>
        </Box>
        <Button 
          variant="outlined"
          color="primary"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => {
              console.log("Back button clicked");
              
              navigate(-1); // Pass state
          }}
          sx={{
              boxShadow: 3,
              '&:hover': {
                  boxShadow: 6,
              },
          }}
      > 
          Back
      </Button>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;
