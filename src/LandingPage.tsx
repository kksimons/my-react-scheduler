// src/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

// Style button 
const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(1, 3),
}));

// Landing page starts here 
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Handle select role, navigate based on the role selected
  const handleRoleSelection = (role: string) => {
    if (role === 'Manager') {
      navigate('/ManagerSignUpPage'); // Navigate to manager sign-up page
    } else {
      navigate('/EmployeeSignUpPage'); // Navigate to employee sign-up page 
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '50px 0' }}>

      {/* Welcome Line */}
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to PowerShift
      </Typography>

      {/* Ask user to pick a role */}
      <Typography variant="h6" gutterBottom>
        Select your role:
      </Typography>

      <Box>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => handleRoleSelection('Manager')}
        >
          Manager
        </StyledButton>
        <StyledButton
          variant="outlined"
          color="secondary"
          onClick={() => handleRoleSelection('Employee')}
        >
          Employee
        </StyledButton>
      </Box>
    </Container>
  );
};

export default LandingPage;
