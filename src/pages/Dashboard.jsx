import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // LocalStorage-la irundhu user object get panrom
  const user = JSON.parse(localStorage.getItem('user'));

  // Strictly user name (e.g. "Kumaran" or "Arumugam")
  const displayName = user?.name || "Rider";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Banner Section */}
        <div className="welcome-banner">
          <div>
            <h1 className="welcome-title">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="welcome-subtitle">
              Have a safe and comfortable journey with RideGo.
            </p>
          </div>
          
          <button 
            className="btn-book-ride" 
            onClick={() => navigate('/booking')}
          >
            🚖 Book New Ride
          </button>
        </div>

        {/* Analytics Cards Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🚕</span>
            <h3 className="stat-value">25</h3>
            <p className="stat-label">Total Rides</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💳</span>
            <h3 className="stat-value">₹12,500</h3>
            <p className="stat-label">Total Spent</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <h3 className="stat-value">4.9</h3>
            <p className="stat-label">Your Rating</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">👑</span>
            <h3 className="stat-value gold">Gold</h3>
            <p className="stat-label">Membership</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;