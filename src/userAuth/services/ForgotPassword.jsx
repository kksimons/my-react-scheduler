

//Logic: 
// User clicks on forgot password link on the sign in page, it will redirect to the forgot password page. 
//User will enter their email address and click on the submit button. The system will send an email to the user with a link to reset the password.
//User will click on the link and will be redirected to the reset password page where they can enter a new password. 
//After entering the new password, the user will click on the submit button and the password will be updated in the system. 
//The user can now sign in with the new password.
// -------------- THE END ^_^ --------------- 

// import { getAuth, updatePassword } from "firebase/auth";

// const auth = getAuth();

// const user = auth.currentUser;
// const newPassword = getASecureRandomPassword();

// updatePassword(user, newPassword).then(() => {
//   // Update successful.
// }).catch((error) => {
//   // An error ocurred
//   // ...
// });

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  SvgIcon,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blue, grey } from '@mui/material/colors';
import { auth } from '../firebase'; // Adjust the import path as needed
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate email
    if (!email) {
      setEmailError('Email is required.');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
      try {
        await sendPasswordResetEmail(auth, email);
        // Show success message or redirect
        alert('Password reset email sent.');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        setEmailError('Failed to send password reset email.');
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
            <Box component="form" onSubmit={handleSubmit}>
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
          target="_blank"
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
          {/* GitHub Icon */}
          <SvgIcon
            sx={{ width: 14, height: 14 }}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 
            2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 
            1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 
            0 0 .67-.21 2.2.82.64-.18 1.32-.27 
            2-.27.68 0 1.36.09 2 .27 1.53-1.04 
            2.2-.82 2.2-.82.44 1.1.16 1.92.08 
            2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 
            3.75-3.65 3.95.29.25.54.73.54 1.48 
            0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 
            8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </SvgIcon>
          View Github
        </Link>
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
