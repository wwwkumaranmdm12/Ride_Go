import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-content">

        <h1>Ride Smarter, Travel Faster 🚖</h1>

        <p>
          India's Most Trusted Cab Booking Platform.
          Safe, Affordable and Comfortable rides anytime.
        </p>

        <div className="hero-buttons">

          <button
            className="book-btn"
            onClick={() => navigate("/booking")}
          >
            Book Now
          </button>

          <button
            className="explore-btn"
            onClick={() => navigate("/about")}
          >
            Explore More
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;