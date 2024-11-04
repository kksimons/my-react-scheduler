import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { SignInManager } from '../services/SignInManager'; 
import Card from '@mui/material/Card';
import { Link as RouterLink, useNavigate } from 'react-router-dom';




export default function SignInCard() {

  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  // const [open, setOpen] = React.useState(false); //forgot pass tab 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  //Those 2 lines initially were for the OPEN FORGOT PASSWORD TAB, but there was an error and idk how to fix so 
  //i just remove the features (will do later)
  // const handleClickOpen = () => { setOpen(true); };
  // const handleClose = () => { setOpen(false); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      await SignInManager(email, password);
      console.log("Manager sign in successfully.");
      navigate('/ManagerDashBoard');
    } catch (error) {
      console.log('Invalid credentials. Please try again.');
    }
  };


  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >

        {/* Password input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="email">Email</FormLabel>
          </Box>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={emailError ? 'error' : 'primary'}
            sx={{ ariaLabel: 'email' }}
          />
        </FormControl>

        {/* Password input */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="enter your password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>


        {/* Box for Remember Me and Forgot Password Link on the same row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          {/* I commented out the forgot pass button */}
          {/* <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: 'baseline' }}
          >
            Forgot your password?
          </Link> */}
        </Box>

        {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
        <Button 
         type="submit" 
         fullWidth variant="contained"
         sx={{ backgroundColor: '#5201C3', '&:hover': { backgroundColor: '#6200ea' } }}
         >
          Sign in
        </Button>
          {/* Link to Sign-In Page */}

        <RouterLink 
          to="/ManagerSignUpPage" 
          style={{ alignSelf: 'center', fontSize: '18px', textDecoration: 'none', color: '#5201C3' }}
        >
          Sign Up
        </RouterLink>


      </Box>
    </Card>
  );
}
