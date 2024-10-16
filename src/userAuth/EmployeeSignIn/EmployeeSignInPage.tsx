// src/userAuth/EmployeeSignIn/EmployeeSignInPage.tsx

import React from 'react';
import EmployeeSignInCard from './EmployeeSignInPage';
import ForgotPassword from '../ForgotPassword';
import { Box, Typography } from '@mui/material';

const EmployeeSignInPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Employee Sign In
      </Typography>
      <EmployeeSignInCard />
      <ForgotPassword />
    </Box>
  );
};

export default EmployeeSignInPage;
