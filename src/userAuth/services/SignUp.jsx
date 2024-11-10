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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  //handle sign up 
  // Logic: 
    // First, create the user, then navigate to the SelectRole component.
    // Next Pass the uid and email to the SelectRole component.
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      //create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Navigate to role selection, passing user ID if needed for role selection
      navigate('/SelectRole', { state: { uid: user.uid , email: user.email} });
    } catch (error) {
      console.error("Error signing up:", error);
    }

    //   await createUserWithEmailAndPassword(auth, email, password);
    //   navigate('/SelectRole'); // Direct to login after successful sign-up
    // } catch (error) {
    //   console.error("Error signing up:", error);
    // }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/SelectRole', { state: { uid: user.uid, email: user.email } });
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

          {/* // Form for user to enter email and password */}
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <TextField
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='user@example.com'
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

          {/* // Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // onClick={}
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
            Sign Ip with Google
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;