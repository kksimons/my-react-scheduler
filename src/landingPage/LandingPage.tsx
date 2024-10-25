import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'; 
import { styled } from '@mui/system';
import { useUserStore } from "../stores/useUserStore";

// Define theme colors as a constant
const themeColors = {
  primary: '#8a2be2',     // Purple color for buttons and accents
  secondary: '#9b30ff',   // Lighter purple for hover effects
  tertiary: '#ffffff',    // White for text and highlights
};

const ContentText = styled(Typography)({
  color: themeColors.tertiary,
  fontWeight: 400,
  fontSize: '23px',
  marginBottom: '3rem',
  backgroundColor: 'rgba(85, 66, 253, 0.5)',
  borderRadius: '1rem',
  padding: '3rem 2rem',
  boxSizing: 'border-box',
});

const LandingPage: React.FC = () => {
  const { setCurrentTab } = useUserStore();

  const handleStartNowClick = () => {
    setCurrentTab(1); // Link to the SignUp page
  };

  return (
      <Box
        sx={{
          background: 'linear-gradient(97deg, rgba(233,104,255,1) 0%, rgba(69,91,235,1) 37%, rgba(34,24,167,1) 79%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: "100vh",
        }}
      >
        {/* Landing Page Content */}
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            maxWidth: '1200px',
            width: '100%',
            padding: '2rem',
          }}
        >
          {/* Left Container */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '2rem',
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: '60px',
                  color: themeColors.tertiary,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                }}
              >
                PowerShift
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: '22px',
                  fontStyle: 'italic',
                  color: themeColors.tertiary,
                  marginTop: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                Empower your shifts, streamline your work.
              </Typography>
              <Button
                onClick={handleStartNowClick}
                sx={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.tertiary,
                  fontWeight: 600,
                  fontSize: '20px',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  padding: '1rem 3rem',
                  '&:hover': {
                    backgroundColor: themeColors.secondary,
                  },
                  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
                }}
              >
                Start Now
              </Button>
            </Stack>
          </Box>

          {/* Right Container with ContentText Styled Component */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: '1rem',

            }}
          >
            <ContentText>Manage your team shifts effortlessly and efficiently.</ContentText>
            <ContentText>Real-time updates to keep everyone informed.</ContentText>
            <ContentText>Maximize productivity while minimizing stress.</ContentText>
            <ContentText>Join us now and empower your business.</ContentText>
          </Box>
        </Box>
      </Box>
  );
};

export default LandingPage;
