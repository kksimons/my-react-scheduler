import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      // Simulating sign-out process for now (adjust this with your actual sign-out logic)
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    navigate('/SignUp');
  };

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 4,
        backgroundColor: '#f5f5f5', // light background color
      }}
    >
      {/* Heading Typography with fancy "P" */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          color: '#333', // Dark text color
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: '5rem', color: '#1976d2', fontWeight: 'bold' }}>
          P
        </span>
        ower
        <span style={{ fontSize: '5rem', color: '#1976d2', fontWeight: 'bold' }}>
        S
        </span>
        hift
      </Typography>

      {/* Description text */}
      <Typography
        variant="body1"
        sx={{
          color: '#666',
          marginBottom: 4,
          maxWidth: 600,
          lineHeight: 1.6,
        }}
      >
        Our Solution Makes Your Life Easier
      </Typography>

      {/* Sign up button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          padding: '12px 24px',
          fontSize: '1.2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#1976d2', // Darker blue on hover
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleGetStarted}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;
