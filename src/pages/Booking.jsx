import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Booking.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Moving Car Icon
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202003.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const CAB_TYPES = [
  {
    id: "Mini",
    name: "Mini",
    perKm: 12,
    capacity: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Sedan",
    name: "Sedan",
    perKm: 16,
    capacity: 4,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "SUV",
    name: "SUV",
    perKm: 22,
    capacity: 7,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "Luxury",
    name: "Luxury",
    perKm: 40,
    capacity: 4,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80",
  },
];

function MapPicker({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng);
    },
  });
  return null;
}

function Booking() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    pickupLocation: "",
    dropLocation: "",
    rideDate: "",
    cabType: "",
    userEmail: "arumugam123@gmail.com",
    status: "Confirmed",
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const [activeMapField, setActiveMapField] = useState(null);
  const [tempCoords, setTempCoords] = useState(null);

  // Initial distance set to 0 (Fixes initial fare glitch)
  const [distanceKm, setDistanceKm] = useState(0); 
  const [isBooked, setIsBooked] = useState(false);
  const [driverPos, setDriverPos] = useState(null);
  const [rideStatus, setRideStatus] = useState("Driver assigned and on the way!");

  const defaultCenter = [11.0168, 76.9558];

  // Debounce API calls to prevent site slowness/lag
  useEffect(() => {
    const timer = setTimeout(() => {
      if (booking.pickupLocation.trim().length >= 3 && !pickupCoords) {
        fetchSuggestions(booking.pickupLocation, "pickup");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [booking.pickupLocation, pickupCoords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (booking.dropLocation.trim().length >= 3 && !dropCoords) {
        fetchSuggestions(booking.dropLocation, "drop");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [booking.dropLocation, dropCoords]);

  const fetchSuggestions = async (query, type) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      if (type === "pickup") setPickupSuggestions(data);
      else setDropSuggestions(data);
    } catch (err) {
      console.error("Search API Error:", err);
    }
  };

  const selectSuggestion = (item, type) => {
    const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    if (type === "pickup") {
      setBooking((prev) => ({ ...prev, pickupLocation: item.display_name }));
      setPickupCoords(coords);
      setPickupSuggestions([]);
    } else {
      setBooking((prev) => ({ ...prev, dropLocation: item.display_name }));
      setDropCoords(coords);
      setDropSuggestions([]);
    }
  };

  // Accurate Distance Calculator
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist > 0 ? parseFloat(dist.toFixed(1)) : 0;
  };

  useEffect(() => {
    if (pickupCoords?.lat && dropCoords?.lat) {
      const dist = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropCoords.lat,
        dropCoords.lng
      );
      setDistanceKm(dist);
    } else {
      setDistanceKm(0);
    }
  }, [pickupCoords, dropCoords]);

  const confirmMapPicker = async () => {
    if (!tempCoords) return;
    const { lat, lng } = tempCoords;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const placeName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      if (activeMapField === "pickupLocation") {
        setBooking((prev) => ({ ...prev, pickupLocation: placeName }));
        setPickupCoords({ lat, lng });
      } else {
        setBooking((prev) => ({ ...prev, dropLocation: placeName }));
        setDropCoords({ lat, lng });
      }
    } catch {
      const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (activeMapField === "pickupLocation") {
        setBooking((prev) => ({ ...prev, pickupLocation: fallbackName }));
        setPickupCoords({ lat, lng });
      } else {
        setBooking((prev) => ({ ...prev, dropLocation: fallbackName }));
        setDropCoords({ lat, lng });
      }
    }
    setActiveMapField(null);
    setTempCoords(null);
  };

  const saveToLocalStorage = (newBooking) => {
    const existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
    const updatedBookings = [...existingBookings, { ...newBooking, id: Date.now() }];
    localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
  };

  const startLiveTrackingSimulation = () => {
    const startLat = pickupCoords ? pickupCoords.lat : 11.0168;
    const startLng = pickupCoords ? pickupCoords.lng : 76.9558;
    const endLat = dropCoords ? dropCoords.lat : 11.025;
    const endLng = dropCoords ? dropCoords.lng : 76.965;

    setDriverPos([startLat, startLng]);
    setIsBooked(true);

    let step = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        const currentLat = startLat + ((endLat - startLat) * step) / totalSteps;
        const currentLng = startLng + ((endLng - startLng) * step) / totalSteps;
        setDriverPos([currentLat, currentLng]);

        if (step === 30) setRideStatus("Cab arrived at pickup location");
        if (step === 40) setRideStatus("Trip Started - Heading to Destination");
        if (step === 90) setRideStatus("Reaching destination soon");
      } else {
        clearInterval(interval);
        setRideStatus("🎉 You have arrived at your destination!");
      }
    }, 1000);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    let finalData = { ...booking };
    try {
      const response = await axios.post("http://localhost:8080/api/rides/book", booking);
      finalData = response.data || booking;
    } catch (error) {
      console.log("BOOKING API ERROR (Fallback to LocalStorage):", error);
    }

    saveToLocalStorage(finalData);
    startLiveTrackingSimulation();
  };

  return (
    <section className="booking">
      <div className="booking-container">
        {!isBooked ? (
          <>
            <h1>Book Your Ride</h1>

            <form className="booking-form" onSubmit={handleBooking}>
              {/* Pickup Input */}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    name="pickupLocation"
                    placeholder="Pickup Location"
                    value={booking.pickupLocation}
                    onChange={(e) => {
                      setBooking({ ...booking, pickupLocation: e.target.value });
                      setPickupCoords(null);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setActiveMapField("pickupLocation")}
                    style={{ padding: "0 12px", cursor: "pointer", borderRadius: "6px" }}
                  >
                    🗺️ Map
                  </button>
                </div>
                {pickupSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {pickupSuggestions.map((item, idx) => (
                      <li key={idx} onClick={() => selectSuggestion(item, "pickup")}>
                        📍 {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Drop Input */}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    name="dropLocation"
                    placeholder="Drop Location"
                    value={booking.dropLocation}
                    onChange={(e) => {
                      setBooking({ ...booking, dropLocation: e.target.value });
                      setDropCoords(null);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setActiveMapField("dropLocation")}
                    style={{ padding: "0 12px", cursor: "pointer", borderRadius: "6px" }}
                  >
                    🗺️ Map
                  </button>
                </div>
                {dropSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {dropSuggestions.map((item, idx) => (
                      <li key={idx} onClick={() => selectSuggestion(item, "drop")}>
                        📍 {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Date Input */}
              <input
                type="date"
                name="rideDate"
                value={booking.rideDate}
                onChange={(e) => setBooking({ ...booking, rideDate: e.target.value })}
                required
              />

              {/* Display Cab Cards & Fare ONLY IF locations are selected */}
              {pickupCoords && dropCoords && (
                <div className="cab-selection-wrapper">
                  <h3>Select Cab Type</h3>
                  <p style={{ fontSize: "13px", color: "#64748b" }}>
                    Calculated Distance: ~{distanceKm} km
                  </p>
                  <div className="cab-cards-grid">
                    {CAB_TYPES.map((cab) => {
                      const estimatedFare = Math.round(distanceKm * cab.perKm);
                      const isSelected = booking.cabType === cab.name;

                      return (
                        <div
                          key={cab.id}
                          className={`cab-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setBooking({ ...booking, cabType: cab.name })}
                        >
                          <img src={cab.image} alt={cab.name} />
                          <div className="cab-card-info">
                            <h4>{cab.name}</h4>
                            <p>👥 {cab.capacity} | ⭐ {cab.rating}</p>
                            <p className="fare">Est: ₹{estimatedFare}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button type="submit" disabled={!booking.cabType || !pickupCoords || !dropCoords}>
                Book Now 🚖
              </button>
            </form>
          </>
        ) : (
          /* Live Tracking Map View */
          <div className="tracking-view">
            <h2>🚗 Live Uber Tracking</h2>
            <p className="status-badge">{rideStatus}</p>

            <div className="map-wrapper" style={{ height: "350px", margin: "15px 0" }}>
              <MapContainer
                center={
                  pickupCoords && dropCoords
                    ? [(pickupCoords.lat + dropCoords.lat) / 2, (pickupCoords.lng + dropCoords.lng) / 2]
                    : defaultCenter
                }
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "12px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {pickupCoords && <Marker position={[pickupCoords.lat, pickupCoords.lng]} />}
                {dropCoords && <Marker position={[dropCoords.lat, dropCoords.lng]} />}
                {driverPos && <Marker position={driverPos} icon={carIcon} />}
                {pickupCoords && dropCoords && (
                  <Polyline
                    positions={[
                      [pickupCoords.lat, pickupCoords.lng],
                      [dropCoords.lat, dropCoords.lng],
                    ]}
                    color="#2563eb"
                    weight={4}
                    dashArray="6, 6"
                  />
                )}
              </MapContainer>
            </div>

            <div className="trip-summary">
              <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
              <p><strong>Drop:</strong> {booking.dropLocation}</p>
              <p><strong>Vehicle:</strong> {booking.cabType}</p>
              <button
                onClick={() => navigate("/my-bookings")}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        )}

        {/* Map Location Selector Modal */}
        {activeMapField && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Pick Location on Map</h3>
              <div style={{ height: "250px", margin: "10px 0" }}>
                <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapPicker onSelectLocation={(latlng) => setTempCoords(latlng)} />
                  {tempCoords && <Marker position={tempCoords} />}
                </MapContainer>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setActiveMapField(null)}>Cancel</button>
                <button type="button" onClick={confirmMapPicker} disabled={!tempCoords}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Booking;