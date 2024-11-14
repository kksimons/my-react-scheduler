import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import Navbar from './Navbar';
import BannerImage from '../assets/banner-red.png';
import TrustedBy from './TrustedBy';
import About from './About';

//This component folder src/components will be the component for everything on the landing page 

// Landing page starts here 
const Header = () => {
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
    <div className='home-container'>
      
      <Navbar />
      <div className='home-banner-container'>
        <div className='home-text-section'>
          <h1 className='primary-heading'>PowerShift</h1>
          <p className='primary-text'>Automated scheduling tailored to employee availability, with self-managed profiles and real-time working hours tracking</p>
          <button className='secondary-button' onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className='home-image-container'>
            <img src={BannerImage} alt="" />
        </div>
      </div>

      {/* container for trusted by ... */}
      <div>
        <TrustedBy />
      </div>

    </div>

    // <Container>

    //     {/* Sign up button */}
    //   <Button
    //     variant="contained"
    //     color="primary"
        
    //     // onClick={() => navigate('/SignUp')}>
    //     onClick={handleGetStarted} 
    //     >
    //     Get Started 
    //   </Button>

    //   <Typography>
    //     Our Solution Makes Your Life Easier
    //   </Typography>


    // </Container>
  );
};

export default Header;
