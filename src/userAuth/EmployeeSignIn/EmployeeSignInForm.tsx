// src/userAuth/EmployeeSignIn/EmployeeSignInCard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInEmployee } from '../services/SignInEmployee';
import { TextField, Button, Typography, Box } from '@mui/material';

const EmployeeSignInForm: React.FC = () => {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInEmployee(employeeEmail, employeePassword);
      navigate('/EmployeeDashBoard'); // Redirect after successful sign-in
    } catch (error: any) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Error during employee sign-in:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      
      <Typography variant="h4">Employee Sign In</Typography>

      {error && <Typography color="error">{error}</Typography>}
      <TextField label="Email" variant="outlined" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} required />

      <TextField label="Password" variant="outlined" type="password" value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} required />
      <Button type="submit" variant="contained" sx={{ backgroundColor: '#6200ea', '&:hover': { backgroundColor: '#4b00c7' } }}>
        Sign In
      </Button>
    </Box>
  );
};

export default EmployeeSignInForm;