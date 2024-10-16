// src/userAuth/EmployeeSignIn/EmployeeLogOut.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const EmployeeLogOut: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Remove the employee's info from Firestore
        await deleteDoc(doc(db, 'employee-info', currentUser.uid));

        // Log out the employee from Firebase Auth
        await signOut(auth);

        // Redirect to the landing page after logout
        navigate('/');
      }
    } catch (error) {
      console.error('Fail to log out, please try again:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="contained"
      startIcon={<LogoutIcon />}
      sx={{ backgroundColor: '#6200ea', '&:hover': { backgroundColor: '#4b00c7' } }}
    >
      Log Out
    </Button>
  );
};

export default EmployeeLogOut;
