// src/userAuth/EmployeeSignIn/EmployeeSignInPage.tsx

import React from 'react';
import EmployeeSignInCard from './EmployeeSignInPage';
import { Box, Typography } from '@mui/material';

const EmployeeSignInPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Employee Sign In
      </Typography>
      <EmployeeSignInCard />
    </Box>
  );
};

export default EmployeeSignInPage;
