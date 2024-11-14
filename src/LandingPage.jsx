import About from "./components/About";
import './App.css';
import Header from "./components/Header";
import Testimonial from "./components/Testimonial";


//Todo: 
// Fix margin for about and testimonial 
//Fix flex testimonial 

const LandingPage = () =>  { 
    return (
      <div className="App">
          <Header />
          <About />
          <Testimonial />
      </div>
    );
}
export default LandingPage;