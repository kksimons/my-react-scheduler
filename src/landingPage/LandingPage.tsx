import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import './landingpage-bg.jpg';
import { useUserStore } from "../stores/useUserStore";

// Define theme colors as a constant
const themeColors = {
  primary: '#8a2be2',     // Purple color for buttons and accents
  secondary: '#9b30ff',   // Lighter purple for hover effects
  tertiary: '#ffffff',    // White for text and highlights
};

// Custom styles using styled API from MUI
const LandingPageContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  backgroundImage: `url(${require('./landingpage-bg.jpg')})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '2rem',
});

const LeftContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const RightContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '2rem',
});

const LogoText = styled(Typography)({
  fontWeight: 800,
  fontSize: '4rem',
  color: themeColors.tertiary,
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
  marginBottom: '1rem',
});

const SloganText = styled(Typography)({
  fontWeight: 500,
  fontSize: '1.5rem',
  color: themeColors.tertiary,
  marginBottom: '2rem',
});

const StartButton = styled(Button)({
  backgroundColor: themeColors.primary,
  color: themeColors.tertiary,
  fontWeight: 600,
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
  padding: '0.8rem 2rem',
  '&:hover': {
    backgroundColor: themeColors.secondary,
  },
  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
});

const ContentText = styled(Typography)({
  color: themeColors.tertiary,
  fontWeight: 400,
  fontSize: '1.25rem',
  marginBottom: '1.5rem',
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
});

const LandingPage: React.FC = () => {
    const { setCurrentTab } = useUserStore();


    const handleStartNowClick = () => {
    setCurrentTab(1); // Link to the SignUp page
  };

  return (
    <LandingPageContainer>
      {/* Left Container: Logo and Slogan */}
      <LeftContainer>
        <LogoText variant="h1">PowerShift</LogoText>
        <SloganText variant="h4">Empower your shifts, streamline your work.</SloganText>
        <StartButton onClick={handleStartNowClick}>
          Start Now
        </StartButton>
      </LeftContainer>

      {/* Right Container: Content Text */}
      <RightContainer>
        <ContentText>Manage your team shifts effortlessly and efficiently.</ContentText>
        <ContentText>Real-time updates to keep everyone informed.</ContentText>
        <ContentText>Maximize productivity while minimizing stress.</ContentText>
        <ContentText>Join us now and empower your business.</ContentText>
      </RightContainer>
    </LandingPageContainer>
  );
};

export default LandingPage;
