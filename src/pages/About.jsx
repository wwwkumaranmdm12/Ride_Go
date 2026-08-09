import React from "react";

const About = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", lineHeight: "1.6" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#333" }}>About RideGo</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
        Welcome to <strong>RideGo</strong>, your trusted partner for seamless, fast, and secure urban transportation. 
        Whether you are commuting to work, catching a flight, or exploring the city, RideGo ensures a smooth journey at the tap of a button.
      </p>
      
      <h2 style={{ marginTop: "30px", marginBottom: "10px", color: "#444" }}>Why Choose Us?</h2>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        <li style={{ marginBottom: "8px" }}><strong>Reliable Rides:</strong> Verified drivers and real-time tracking for your safety.</li>
        <li style={{ marginBottom: "8px" }}><strong>Transparent Pricing:</strong> No hidden costs, standard rates calculated up front.</li>
        <li style={{ marginBottom: "8px" }}><strong>24/7 Availability:</strong> Ready to take you wherever you need to go, anytime.</li>
      </ul>
    </div>
  );
};

export default About;