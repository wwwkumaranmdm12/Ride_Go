import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import CabSection from "../components/CabSection/CabSection";
import BookingForm from "../components/BookingForm/BookingForm";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
    
      <Hero />
      <Features />
      <CabSection />
      <BookingForm />
   
    </>
  );
}

export default Home;