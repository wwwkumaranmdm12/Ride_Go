import "./BookingForm.css";

function BookingForm() {
  return (
    <section className="booking-section" id="booking">

      <div className="booking-container">

        <div className="booking-title">
          <h2>Book Your Ride</h2>
          <p>
            Fill in your trip details and book your cab instantly.
          </p>
        </div>

        <form className="booking-form">

          <div className="input-group">
            <label>Pickup Location</label>
            <input
              type="text"
              placeholder="Enter Pickup Location"
            />
          </div>

          <div className="input-group">
            <label>Drop Location</label>
            <input
              type="text"
              placeholder="Enter Destination"
            />
          </div>

          <div className="input-group">
            <label>Journey Date</label>
            <input type="date" />
          </div>

          <div className="input-group">
            <label>Pickup Time</label>
            <input type="time" />
          </div>

          <div className="input-group">
            <label>Passengers</label>

            <select>
              <option>1 Passenger</option>
              <option>2 Passengers</option>
              <option>3 Passengers</option>
              <option>4 Passengers</option>
              <option>5+ Passengers</option>
            </select>
          </div>

          <div className="input-group">
            <label>Cab Type</label>

            <select>
              <option>Mini</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Luxury</option>
            </select>
          </div>

          <div className="fare-box">
            <h3>Estimated Fare</h3>
            <h1>₹499</h1>
            <span>*Approximate Fare</span>
          </div>

          <button className="booking-btn">
            Book Ride
          </button>

        </form>

      </div>

    </section>
  );
}

export default BookingForm;