// src/userAuth/EmployeeSignIn/EmployeeSignInPage.tsx

import React from 'react';
import EmployeeSignInForm from './EmployeeSignInForm';
import ForgotPassword from '../ForgotPassword';
import { Box, Typography } from '@mui/material';

const EmployeeSignInPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Employee Sign In
      </Typography>
      <EmployeeSignInForm />
      <ForgotPassword />
    </Box>
  );
};

export default EmployeeSignInPage;
