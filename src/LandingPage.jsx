import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

// Landing page starts here 
const LandingPage = () => {
  const navigate = useNavigate();
  //const { role } = useAuth(); // Get the role from the AuthContext

  const handleGetStarted = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    navigate('/SignUp');
  };


  return (
    <Container>
        {/* Sign up button */}

        <Navigation />
      <Button
        variant="contained"
        color="primary"
        
        // onClick={() => navigate('/SignUp')}>
        onClick={handleGetStarted} 
        >
        Get Started 
      </Button>

      <Typography>
        Our Solution Makes Your Life Easier
      </Typography>


    </Container>
  );
};

export default LandingPage;
