import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login'; 
import Register from './pages/Register';

// Import Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import BookingForm from './components/BookingForm/BookingForm'; // Fixed import path

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;