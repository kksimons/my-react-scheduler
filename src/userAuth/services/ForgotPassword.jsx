

//Logic: 
// User clicks on forgot password link on the sign in page, it will redirect to the forgot password page. 
//User will enter their email address and click on the submit button. The system will send an email to the user with a link to reset the password.
//User will click on the link and will be redirected to the reset password page where they can enter a new password. 
//After entering the new password, the user will click on the submit button and the password will be updated in the system. 
//The user can now sign in with the new password.
// -------------- THE END ^_^ --------------- 
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blue, grey } from '@mui/material/colors';
import { auth } from '../firebase'; // Adjust the import path as needed
import { sendPasswordResetEmail } from 'firebase/auth';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  // Handler for form submission
  const handlePasswordReset = async (event) => {
    event.preventDefault();

    // Validate email
    if (!email) {
      toast.error('Please enter your email.');
    } else if (!validateEmail(email)) {
      toast.error('Please enter a valid email address eg. user@example.com');
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        // alert  success message or redirect
        alert('Password reset email sent, please check your email.');
        // Redirect to login page after sending password reset email
        navigate('/SignIn');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        toast.error('Failed to send password reset email, please try again.');
      }
    }
  };

  // Simple email validation
  const validateEmail = (email) => {
    // Simple regex for email validation
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  return (
    <Box
    
      component="main"
      role="main"
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        p: 3,
      }}
    >
      <Box
        sx={{
          mt: 7,
          bgcolor: 'background.default',
          borderRadius: 2,
          boxShadow: 3,
          border: 2,
          borderColor: blue[300],
        }}
      >
        {/* <ToastContainer/> */}
        <Box sx={{ p: { xs: 4, sm: 7 } }}>
          <Box sx={{ textAlign: 'center' }}>

            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 'bold', color: grey[800] }}
            >
              Forgot password?
            </Typography>

            <Typography variant="body2" sx={{ mt: 2  }}>
              Remember your password?{' '}
              <Link
                // href="/SignIn"
                onClick={(e) => {
                  e.preventDefault();
                  // Navigate to login page
                  navigate('/SignIn');
                }}
                sx={{
                  color: blue[600],
                  textDecorationThickness: '2px',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                  fontWeight: 'medium',
                }}
              >
                Login here
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 5 }}>
            <Box component="form" onSubmit={handlePasswordReset}>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography
                    component="label"
                    htmlFor="email"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      ml: 1,
                      mb: 1,
                    }}
                  >
                    Email address
                  </Typography>
                  <TextField
                    type="email"
                    id="email"
                    name="email"
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    sx={{
                      '& .MuiInputBase-root': {
                        py: 1.5,
                        px: 2,
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        '& fieldset': {
                          borderWidth: '2px',
                          borderColor: grey[200],
                        },
                        '&:hover fieldset': {
                          borderColor: blue[500],
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: blue[500],
                        },
                      },
                      boxShadow: 1,
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    bgcolor: blue[500],
                    color: 'white',
                    '&:hover': {
                      bgcolor: blue[600],
                    },
                    textTransform: 'none',
                  }}
                >
                  Reset password
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 3, justifyContent: 'center', alignItems: 'center' }}
        divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: grey[300] }} />}
      >
        <Link
          href="#"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '0.875rem',
            color: grey[600],
            textDecorationThickness: '2px',
            '&:hover': {
              color: blue[600],
              textDecoration: 'underline',
            },
          }}
        >
          Contact us!
        </Link>
      </Stack>
    </Box>
    
  );
}

export default ForgotPassword;
