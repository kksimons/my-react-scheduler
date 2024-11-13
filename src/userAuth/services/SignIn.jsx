import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FormControl, FormLabel, TextField } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import theme from '@theme/theme';
import { ThemeProvider } from '@mui/material';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Import the Firestore database

// Import toast notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Validate form with exception message 
  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Email
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email format: user@example.com");
      isValid = false;
    }

    // Validate Password
    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error("Password must be at least 6 characters long and contain both numbers and letters");
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create DocumentReferences
      const employeeDocRef = doc(db, "employees", user.uid);
      const employerDocRef = doc(db, "employers", user.uid);

      // Fetch DocumentSnapshots
      const [employeeDocSnap, employerDocSnap] = await Promise.all([
        getDoc(employeeDocRef),
        getDoc(employerDocRef),
      ]);

      // Check if documents exist and navigate accordingly
      if (employeeDocSnap.exists()) {
        navigate("/EmployeeDashboard");
      } else if (employerDocSnap.exists()) {
        navigate("/EmployerDashboard");
      } else {
        console.error("User role document not found in employees or employers collections");
        toast.error("User profile not found. Please contact support.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid email or password");
    }
  };

  // Handle Google Sign-In 
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); 

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; 

      // Create DocumentReferences
      const employeeDocRef = doc(db, "employees", user.uid);
      const employerDocRef = doc(db, "employers", user.uid);

      // Fetch DocumentSnapshots
      const [employeeDocSnap, employerDocSnap] = await Promise.all([
        getDoc(employeeDocRef),
        getDoc(employerDocRef),
      ]);

      // Check if documents exist and navigate accordingly
      if (employeeDocSnap.exists()) {
        navigate("/EmployeeDashboard");
      } else if (employerDocSnap.exists()) {
        navigate("/EmployerDashboard");
      } else {
        // User does not have a role yet, navigate to role selection
        navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
      } 
    } catch (error) {
      console.error("Error logging in with Google, please try again:", error);
      toast.error("Error logging in with Google. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* ToastContainer to display toast notifications */}
      {/* <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}

      {/* Main container for sign-in form */}
      <Box 
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
        p={2}
      >
        {/* Form container */}
        <Box
          component="form"
          onSubmit={handleSignIn}
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="background.paper"
          sx={{
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            p: 6,
            borderRadius: 5,
            boxShadow: 5,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Sign In
          </Typography>

          {/* Email Field */}
          <FormControl fullWidth>
            <FormLabel>Email:</FormLabel>
            <TextField
              name="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>

          {/* Password Field */}
          <FormControl fullWidth>
            <FormLabel>Password:</FormLabel>
            <TextField
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
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

          {/* Google Sign-In Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoogleSignIn}
            fullWidth
            sx={{
              mt: 1,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Sign In with Google
          </Button>

          {/* Create New Account Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/SignUp')} 
            fullWidth
            sx={{
              mt: 1,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Create New Account
          </Button>

          {/* Forgot Password Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/ForgotPassword')} 
            fullWidth
            sx={{
              mt: 1,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SignIn;
