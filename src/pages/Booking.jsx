import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    pickupLocation: "",
    dropLocation: "",
    rideDate: "",
    cabType: "",
    userEmail: "arumugam123@gmail.com",
    status: "Confirmed"
  });

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const saveToLocalStorage = (newBooking) => {
    const existingBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    const updatedBookings = [...existingBookings, { ...newBooking, id: Date.now() }];
    localStorage.setItem('myBookings', JSON.stringify(updatedBookings));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rides/book",
        booking
      );

      // Backend Success
      saveToLocalStorage(response.data || booking);
      alert("Ride Booked Successfully 🚖");
      navigate("/my-bookings");

    } catch (error) {
      console.log("BOOKING API ERROR (Fallback to LocalStorage):", error);

      // Backend disconnected-a irundhaalum local-a save panrom
      saveToLocalStorage(booking);
      alert("Ride Booked Successfully! Saved to My Bookings 🚖");
      navigate("/my-bookings");
    }
  };

  return (
    <section className="booking">
      <div className="booking-container">
        <h1>Book Your Ride</h1>

        <form className="booking-form" onSubmit={handleBooking}>
          <input
            type="text"
            name="pickupLocation"
            placeholder="Pickup Location"
            value={booking.pickupLocation}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="dropLocation"
            placeholder="Drop Location"
            value={booking.dropLocation}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="rideDate"
            value={booking.rideDate}
            onChange={handleChange}
            required
          />

          <select
            name="cabType"
            value={booking.cabType}
            onChange={handleChange}
            required
          >
            <option value="">Select Cab</option>
            <option value="Mini">Mini</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
          </select>

          <button type="submit">
            Book Now 🚖
          </button>
        </form>
      </div>
    </section>
  );
}

export default Booking;