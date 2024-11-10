import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; //log out icon from MUI


//Log Out Start Here 
const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
     //check if current user is auth (login)
      const currentUser = auth.currentUser;

      if (currentUser) {
        // it will Log the user out from Firebase Auth
        await signOut(auth);
        // After the user is logged out, they will be redirected to the landing page (LandingPage.tsx) 
        navigate('/SignIn');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <Button 
      onClick={handleSignOut} 
      variant="contained"
      startIcon={<LogoutIcon />} //Import the LogoutIcon from mui above 
      sx={{ backgroundColor: '#6200ea', '&:hover': { backgroundColor: '#4b00c7' } }}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
