import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import SelectRole from './SelectRole';

// Landing page starts here 
const LandingPage = () => {
  const navigate = useNavigate();
  //const { role } = useAuth(); // Get the role from the AuthContext

  return (
    <Container>
      {/* Welcome Line */}
      <Typography variant="h1">PowerShift</Typography>
      
        {/* Sign up button */}
      <Button
        variant="contained"
        color="primary"
        
        onClick={() => navigate('/SignUp')}>
        Get Started 
      </Button>

      <Typography>
        Our Solution Makes Your Life Easier
      </Typography>


    </Container>
  );
};

export default LandingPage;