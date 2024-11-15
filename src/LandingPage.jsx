import About from "./components/About";
import './App.css';
import Header from "./components/Header";
import Testimonial from "./components/Testimonial";
import TrustedBy from "./components/TrustedBy";


//Todo: 
// Fix margin for about and testimonial 
//Fix flex testimonial 

const LandingPage = () =>  { 
    return (
      <div className="App">
          <Header />
          <TrustedBy />
          <About />
          <Testimonial />
      </div>
    );
}
export default LandingPage;