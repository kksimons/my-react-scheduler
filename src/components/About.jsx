

import AboutBackgroundImage from "@assets/about-image.png";
const About = () => {
    return (
      <div className="about-section-container">
        <div className="about-section-text-container">
          <h1 className="about-primary-heading">
            PowerShift Makes Scheduling so
          </h1>
          <h2 className="about-secondary-heading">
            EFFORTLESSSS
          </h2>
          <p className="about-primary-text">
            At PowerShift, we are committed to simplifying workforce management. Our platform leverages smart automation to auto-generate schedules, freeing up time for managers to focus on what matters most. By analyzing team needs and availability, we create schedules that work seamlessly for everyone.
          </p>
          <p className="about-primary-text">
            With PowerShift, employees have the freedom to create and manage their own accounts. Team members can set their availability, update personal details, and receive instant updates on scheduling changes, all within our platform. We keep everyone connected, informed, and empowered to manage their time effectively.
          </p>
          <div className="about-buttons-container">
            <button className="about-secondary-button">Learn More</button>
          </div>
        </div>
        <div className="about-section-image-container">
          <img src={AboutBackgroundImage} alt="" />
        </div>
      </div>
    );
  };
  
  export default About;