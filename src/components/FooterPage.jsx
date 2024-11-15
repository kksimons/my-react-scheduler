// FooterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from './ContactForm';
import FooterLogo from '@assets/logo-transparent.png'; // Assuming you have a logo image

const FooterPage = () => {

  //using the scrollIntoView method to scroll to the feature section when the button is clicked, smooth roll 
  const scrollToFeature = () => {
    document.getElementById('auto-generate-feature').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
        <div className="footer-logo">
          <img src={FooterLogo} alt="PowerShift Logo"  />
        </div>
      <div className="footer-content-container">
        {/* Logo */}

        {/* Navigation Links */}
        <nav className="footer-nav">
          <Link to="/#">About</Link>
          <Link to="/#">Our Customer</Link>
          <Link to="/#">Contact</Link>
          <Link to ="/#">Pricing</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PowerShift. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterPage;
