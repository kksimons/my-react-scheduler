import React from 'react';
import Box from '@mui/material/Box';
import ManagerSignInForm from './ManagerSignInForm';
import Content from '../ManagerSignUp/Content';
import ForgotPassword from '../ForgotPassword';

const ManagerSignInPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      {/* Sign-In Form and Forgot Password Section */}
      <Box sx={{ mb: 4 }}>
        <ManagerSignInForm />
        <ForgotPassword />
      </Box>
      
      {/* Content Section */}
      <Content />
    </Box>
  );
}

export default ManagerSignInPage;
