import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">

          <h2>🚖 RideGo</h2>

          <p>
            RideGo is a modern cab booking platform that provides
            safe, reliable and affordable rides across the city.
            Travel smarter with RideGo.
          </p>

        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
         
            <li><a href="/contact">Contact</a></li>
          </ul>

        </div>

        <div className="footer-services">

          <h3>Services</h3>

          <ul>
            <li>Mini Cab</li>
            <li>Sedan</li>
            <li>SUV</li>
            <li>Luxury Ride</li>
          </ul>

        </div>

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>📍 Madurai, Tamil Nadu</p>
          <p>📞 +91 98765 43210</p>
          <p>✉ support@ridego.com</p>

        </div>

      </div>

      <hr />

      <div className="footer-bottom">

        <p>
          © 2026 RideGo. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;