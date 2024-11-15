import About from "./components/About";
import './App.css';
import Header from "./components/Header";
import Testimonial from "./components/Testimonial";
import TrustedBy from "./components/TrustedBy";
import ExtraSpace from "./components/ExtraSpace";
import AutoGenerateFeature from "./components/AutoGenerateFeature";
import FooterPage from "./components/FooterPage";
//Todo: 
// Fix margin for about and testimonial 
//Fix flex testimonial 

const LandingPage = () =>  { 
    return (
      <div className="App">
          <Header />
          <TrustedBy />
          {/* <ExtraSpace /> */}
          <About />
          <AutoGenerateFeature />
          {/* <Testimonial /> */}
          <FooterPage />
      </div>
    );
}
export default LandingPage;