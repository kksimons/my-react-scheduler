// src/userAuth/ManagerSignIn/ManagerLogOut.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; //log out icon from MUI


//Manager Log Out Start Here 
const ManagerLogOut: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
     //check if the mgr you want to delete exist 
      const currentUser = auth.currentUser;

     //if exist then deleteDoc
      if (currentUser) {
        // Remove the manager's info from Firestore "manager-info"
        await deleteDoc(doc(db, 'manager-info', currentUser.uid));

        // After the program check and knows that the manager exist in the database
        // it will Log the manager out from Firebase Auth
        await signOut(auth);

        // After the manage is logged out, they will be redirected to the landing page (LandingPage.tsx) 
        navigate('/');
      }
    } catch (error) {
      console.error('Error during manager log out:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="contained"
      startIcon={<LogoutIcon />} //Import the LogoutIcon from mui above 
      sx={{ backgroundColor: '#6200ea', '&:hover': { backgroundColor: '#4b00c7' } }}
    >
      Log Out
    </Button>
  );
};

export default ManagerLogOut;
