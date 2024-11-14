

import AboutBackgroundImage from "../assets/auto-generate-background.png";
const About = () => {
    return (
      <div className="about-section-container">
        {/* <div className="about-background-image-container">
          <img src={AboutBackground} alt="" />
        </div> */}
        <div className="about-section-text-container">
          <p className="primary-subheading">About</p>
          <h2>
            Food Is An Important Part Of A Balanced Diet
          </h2>
          <p className="primary-text">
            Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
            elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
          </p>
          <p className="primary-text">
            Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
            facilisis at fringilla quam.
          </p>
          <div className="about-buttons-container">
            <button className="secondary-button">Learn More</button>
          </div>
        </div>
        <div className="about-section-image-container">
          <img src={AboutBackgroundImage} alt="" />
        </div>
      </div>
    );
  };
  
  export default About;