
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import logo1 from '../assets/ac-logo.jpg';
import logo2 from '../assets/abstract-logo.jpg';
import logo3 from '../assets/education-logo.jpg';
import logo4 from '../assets/cloudhome-logo.jpg';
import logo5 from '../assets/gg-logo.jpg';
import logo6 from '../assets/mc-logo.jpg';
import logo7 from '../assets/cloudhome-logo.jpg';
import logo8 from '../assets/education-logo.jpg';

//this will be the component for the Trusted by brands only 
const TrustedBy = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 2000,
  };

  const brands = [
    { name: 'Brand 1', logo: logo1 },
    { name: 'Brand 2', logo: logo2 },
    { name: 'Brand 3', logo: logo3 },
    { name: 'Brand 4', logo: logo4 },
    { name: 'Brand 5', logo: logo5 },
    { name: 'Brand 6', logo: logo6 },
    { name: 'Brand 7', logo: logo7 },
    { name: 'Brand 8', logo: logo8 },
  ];

  return (
    <div className="trusted-by-section">
      <h2 className='trustedby-heading'>Our Smart Solution Are Trusted By</h2>
      <Slider {...settings}>
        {brands.map((brand, index) => (
          <div className='trusted-logo-container' key={index}>
            <img src={brand.logo} alt={brand.name} style={{ width: '70%', margin: '0 auto' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrustedBy;
