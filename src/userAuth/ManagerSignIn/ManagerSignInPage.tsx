// src/userAuth/ManagerSignIn/ManagerSignInPage.tsx

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ManagerSignInForm from './ManagerSignInForm';
import Content from '../ManagerSignUp/Content';
import ForgotPassword from '../ForgotPassword';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const ManagerSignInPage: React.FC = () => {
  return (
    <PageContainer>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Sign-In Form */}
        <Grid item xs={12} md={6}>
          <ManagerSignInForm />
          <ForgotPassword /> {/* Integrate Forgot Password */}
        </Grid>
        
        {/* Content Section */}
        <Grid item xs={12} md={6}>
          <Content />
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default ManagerSignInPage;
