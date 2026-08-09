import React, { useState } from 'react';
import apiClient from '../../api/axios'; // Relative path to src/api/axios.js

const BookingForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    cabType: 'Sedan'
  });
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.value ? e.target.name : e.target.name]: e.target.value
    });
  };

  // Dynamic Fare Calculation from Spring Boot API
  const handleCalculateFare = async () => {
    if (!formData.pickupLocation || !formData.dropoffLocation) return;
    try {
      const res = await apiClient.post('/fare/calculate', {
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation
      });
      setFare(res.data.fareAmount);
    } catch (err) {
      console.error('Error calculating fare:', err);
    }
  };

  // Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.post('/ride/book', {
        ...formData,
        fareAmount: fare
      });
      setMessage(`Ride booked successfully! Booking ID: ${response.data.rideId || 'SUCCESS'}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-wrapper" style={{ padding: '20px', maxWidth: '450px', margin: '0 auto' }}>
      <h3>Book Your Ride</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            onBlur={handleCalculateFare}
            placeholder="Enter pickup point"
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Dropoff Location</label>
          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            onBlur={handleCalculateFare}
            placeholder="Enter destination"
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Cab Type</label>
          <select 
            name="cabType" 
            value={formData.cabType} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="Mini">Mini</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
          </select>
        </div>

        {fare !== null && (
          <div style={{ margin: '12px 0', fontWeight: 'bold', color: '#28a745' }}>
            Estimated Fare: ₹{fare}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default BookingForm;