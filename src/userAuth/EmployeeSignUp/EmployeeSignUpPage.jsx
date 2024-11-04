// src/userAuth/EmployeeSignUp/EmployeeSignUpPage.tsx

import React from 'react';
import EmployeeSignUpForm from './EmployeeSignUpForm';
import { Box, Typography } from '@mui/material';

const EmployeeSignUpPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Employee Registration
      </Typography>
      <EmployeeSignUpForm />
    </Box>
  );
};

export default EmployeeSignUpPage;
