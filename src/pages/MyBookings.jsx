import React, { useState, useEffect } from 'react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // LocalStorage-la irundhu bookings-a read panrom
    const savedBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    setBookings(savedBookings);
  }, []);

  const handleCancel = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this ride?");
    if (!isConfirmed) return;

    // Status-a 'Cancelled' nu change panrom
    const updated = bookings.map((item) => {
      if (item.id === id) {
        return { ...item, status: 'Cancelled' };
      }
      return item;
    });

    setBookings(updated);
    localStorage.setItem('myBookings', JSON.stringify(updated));
    alert("Ride Cancelled Successfully ❌");
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 'bold' }}>My Bookings</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e293b', color: '#fff' }}>
            <th style={{ padding: '12px', textAlign: 'center' }}>Pickup</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Drop</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Cab</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                <td style={{ padding: '12px' }}>{item.pickupLocation}</td>
                <td style={{ padding: '12px' }}>{item.dropLocation}</td>
                <td style={{ padding: '12px' }}>{item.cabType}</td>
                <td style={{ padding: '12px' }}>{item.rideDate}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: item.status === 'Cancelled' ? '#ef4444' : '#10b981' }}>
                  {item.status || 'Confirmed'}
                </td>
                <td style={{ padding: '12px' }}>
                  {item.status !== 'Cancelled' ? (
                    <button
                      onClick={() => handleCancel(item.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancel
                    </button>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>N/A</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                No bookings found. Book a ride to see it here!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;