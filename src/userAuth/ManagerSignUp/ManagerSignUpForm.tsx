// src/userAuth/components/ManagerSignUpForm.tsx 

// ------ALL MUI IMPORTS HERE -----
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
// --------------------------------------------------

import { SignUpManager } from '../services/SignUpManager'; // Correct import
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// Manager Sign Up Form Starts Here 
const ManagerSignUpForm: React.FC = () => {
  const navigate = useNavigate(); 
  
  // Form State, set everything to nothing there 
  const [managerFname, setManagerFname] = React.useState<string>('');
  const [managerLname, setManagerLname] = React.useState<string>('');
  const [managerPosition, setManagerPosition] = React.useState<string>('');
  const [managerEmail, setManagerEmail] = React.useState<string>('');
  const [managerPassword, setManagerPassword] = React.useState<string>('');
  
  // Error State----------------------------------------------------------------------
  const [firstNameError, setFirstNameError] = React.useState<boolean>(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState<string>('');
  
  const [lastNameError, setLastNameError] = React.useState<boolean>(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState<string>('');
  
  const [positionError, setPositionError] = React.useState<boolean>(false);
  const [positionErrorMessage, setPositionErrorMessage] = React.useState<string>('');
  
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState<string>('');
  
  const [passwordError, setPasswordError] = React.useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState<string>('');
  
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  //----------------------------------------------------------------------------------------'

  
  // Input Validation
  const validateInputs = () => {
    let isValid = true;
    
    // First Name Validation
    if (!managerFname.trim()) {
      setFirstNameError(true);
      setFirstNameErrorMessage('First name is required.');
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage('');
    }
    
    // Last Name Validation
    if (!managerLname.trim()) {
      setLastNameError(true);
      setLastNameErrorMessage('Last name is required.');
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }
    
    // Position Validation
    if (!managerPosition.trim()) {
      setPositionError(true);
      setPositionErrorMessage('Position is required.');
      isValid = false;
    } else {
      setPositionError(false);
      setPositionErrorMessage('');
    }
    
    // Email Validation
    if (!managerEmail.trim() || !/\S+@\S+\.\S+/.test(managerEmail)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    
    // Password Validation
    if (!managerPassword || managerPassword.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    
    return isValid;
  };
  
  // Handle Sign Up
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setSubmissionError(null);
    setSubmissionSuccess(null);
    
    // Validate inputs
    if (!validateInputs()) return;
    
    setLoading(true);
    
    try {
      // Pass the correct state variables to SignUpManager
      await SignUpManager(managerFname, managerLname, managerPosition, managerEmail, managerPassword);
      setSubmissionSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to Manager Dashboard after a short delay
      setTimeout(() => {
        navigate('/ManagerDashBoard'); // Ensure this route exists
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create account:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        setSubmissionError('This email is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setSubmissionError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setSubmissionError('Password is too weak.');
      } else {
        setSubmissionError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Create Account
      </Typography>
      
      {submissionError && (
        <Alert severity="error">{submissionError}</Alert>
      )}
      
      {submissionSuccess && (
        <Alert severity="success">{submissionSuccess}</Alert>
      )}
      
      <Box
        component="form"
        onSubmit={handleSignUp}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {/* First Name Input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="managerFname">First Name</FormLabel>
          </Box>
          <TextField
            error={firstNameError}
            helperText={firstNameErrorMessage}
            id="managerFname"
            type="text"
            name="managerFname"
            placeholder="John"
            autoComplete="given-name"
            required
            fullWidth
            variant="outlined"
            value={managerFname}
            onChange={(e) => setManagerFname(e.target.value)}
            color={firstNameError ? 'error' : 'primary'}
          />
        </FormControl>
        
        {/* Last Name Input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="managerLname">Last Name</FormLabel>
          </Box>
          <TextField
            error={lastNameError}
            helperText={lastNameErrorMessage}
            id="managerLname"
            type="text"
            name="managerLname"
            placeholder="Doe"
            autoComplete="family-name"
            required
            fullWidth
            variant="outlined"
            value={managerLname}
            onChange={(e) => setManagerLname(e.target.value)}
            color={lastNameError ? 'error' : 'primary'}
          />
        </FormControl>
        
        {/* Position Input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="managerPosition">Position</FormLabel>
          </Box>
          <TextField
            error={positionError}
            helperText={positionErrorMessage}
            id="managerPosition"
            type="text"
            name="managerPosition"
            placeholder="Manager"
            autoComplete="organization-title"
            required
            fullWidth
            variant="outlined"
            value={managerPosition}
            onChange={(e) => setManagerPosition(e.target.value)}
            color={positionError ? 'error' : 'primary'}
          />
        </FormControl>
        
        {/* Email Input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="managerEmail">Email</FormLabel>
          </Box>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="managerEmail"
            type="email"
            name="managerEmail"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            color={emailError ? 'error' : 'primary'}
          />
        </FormControl>
        
        {/* Password Input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="managerPassword">Password</FormLabel>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="managerPassword"
            placeholder="Enter your password"
            type="password"
            id="managerPassword"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            value={managerPassword}
            onChange={(e) => setManagerPassword(e.target.value)}
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>
        
        {/* Sign Up Button */}
        <Button 
          type="submit" 
          fullWidth 
          variant="contained"
          disabled={loading}
          sx={{ 
            backgroundColor: '#5201C3', 
            '&:hover': { backgroundColor: '#6200ea' },
            height: '50px',
            fontSize: '16px',
          }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        
        {/* Link to Sign-In Page */}
        <Typography sx={{ textAlign: 'center' }}>
          Already have an account? Click on the Log In Button Below{' '}
          <Link
            href="/ManagerSignInPage"
            variant="body2"
            sx={{ alignSelf: 'center', fontSize: '18px' }}
          >
            <Button>Log In</Button>
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}

export default ManagerSignUpForm; 
