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
import { db } from '../firebase';  // Import the Firestore database


export function SignIn ()  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({}); //to handle exception when user enter wrong format 
  const navigate = useNavigate();


    //Validate form with exception message 
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        errors.email = "Please enter correct email format: user@example.com ";
    }

    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        errors.password = "Password must be at least 6 characters long, contain both numbers and letters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors found
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Correct usage: create DocumentReferences
      const employeeDocRef = doc(db, "employees", user.uid);
      const employerDocRef = doc(db, "employers", user.uid);
  
      // Fetch DocumentSnapshots
      const [employeeDocSnap, employerDocSnap] = await Promise.all([
        getDoc(employeeDocRef),
        getDoc(employerDocRef),
      ]);
  
      // Check if documents exist
      if (employeeDocSnap.exists()) {
        navigate("/EmployeeDashboard");
      } else if (employerDocSnap.exists()) {
        navigate("/EmployerDashboard");
      } else {
        console.error("User role document not found in employees or employers collections");
        setFormErrors({ general: "User profile not found. Please contact support." });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setFormErrors({ general: "Invalid email or password" });
    }
  };
  



  //handle google sign in 
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); 

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; 

      // Create DocumentReferences check if user's doc exist for both emp and employer 
      const employeeDocRef = doc(db, "employees", user.uid);
      const employerDocRef = doc(db, "employers", user.uid);

      //fetch DocumentSnapshots, use Promise.all to fetch both employee and employer docs 
      const [employeeDocSnap, employerDocSnap] = await Promise.all([
        getDoc(employeeDocRef),
        getDoc(employerDocRef),
      ]);

      // Check if doc exist 
      if (employeeDocSnap.exists()) {
        navigate("/EmployeeDashBoard");
      } else if (employerDocSnap.exists()) {
        navigate("/EmployerDashBoard");
      } else {
        // console.error("User role document not found in employees or employers collections");
        // setFormErrors({ general: "User profile not found. Please contact support." });
        // User does not have a role yet, navigate to role selection
        navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
      } 
    } catch (error) {
      console.error("Error logging in with Google, please try again:", error);
    }
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
              placeholder="user@example.com"
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

          {/* //sign in button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // onClick={handleSignIn}
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

          {/* //Google sign in button */}
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

          {/* //create new account button  */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/SignUp')} 
            sx={{
              mt: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Create new account
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;




































































































































































