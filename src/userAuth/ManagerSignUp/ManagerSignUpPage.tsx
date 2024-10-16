// src/userAuth/pages/ManagerSignUpPage.tsx

//MUI IMPORT HERE---------------
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
//-----------------------------------------

import ManagerSignUpForm from '../../userAuth/ManagerSignUp/ManagerSignUpForm';
import Content from '../../userAuth/ManagerSignUp/Content';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

//Manager Sign Up Page Starts Here 
const ManagerSignUpPage: React.FC = () => {
  return (
    <PageContainer>
      <Grid container spacing={4} justifyContent="center" alignItems="center">

        {/* Import Sign-Up Form Component Here  */}
        <Grid item xs={12} md={6}>
          <ManagerSignUpForm /> 
        </Grid>
        
        {/* Import Content Section Here */}
        <Grid item xs={12} md={6}>
          <Content />
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default ManagerSignUpPage;
