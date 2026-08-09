import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <Link to="/" className="nav-logo">
        🚖 Ride<span>Go</span>
      </Link>

      {/* Nav Links */}
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
          About
        </Link>
        <Link to="/booking" className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}>
          Book Ride
        </Link>
        <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
          My Bookings
        </Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="nav-auth">
        <Link to="/login" className="btn-login">
          Login
        </Link>
        <Link to="/register" className="btn-signup">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;