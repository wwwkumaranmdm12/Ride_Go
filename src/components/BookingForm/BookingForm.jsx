import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Moving Car Icon
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202003.png',
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const CAB_TYPES = [
  { 
    id: 'mini', 
    name: 'Mini', 
    perKm: 12, 
    capacity: 4, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    perKm: 16, 
    capacity: 4, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'suv', 
    name: 'SUV', 
    perKm: 22, 
    capacity: 7, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=500&q=80' 
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    perKm: 40, 
    capacity: 4, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80' 
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

export default function BookingForm() {
  const [pickup, setPickup] = useState({ name: '', lat: null, lng: null });
  const [drop, setDrop] = useState({ name: '', lat: null, lng: null });

  const [pickupQuery, setPickupQuery] = useState('');
  const [dropQuery, setDropQuery] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const [activeMapField, setActiveMapField] = useState(null);
  const [tempMapCoords, setTempMapCoords] = useState(null);

  const [selectedCab, setSelectedCab] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);

  // Live Tracking States
  const [isBooked, setIsBooked] = useState(false);
  const [driverPos, setDriverPos] = useState(null);
  const [rideStatus, setRideStatus] = useState('Driver assigned and on the way!');

  const defaultCenter = [11.0168, 76.9558];

  const handleSearch = async (query, type) => {
    if (type === 'pickup') setPickupQuery(query);
    else setDropQuery(query);

    if (query.trim().length < 3) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      if (type === 'pickup') setPickupSuggestions(data);
      else setDropSuggestions(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const selectSuggestion = (item, type) => {
    const loc = {
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
    if (type === 'pickup') {
      setPickup(loc);
      setPickupQuery(item.display_name);
      setPickupSuggestions([]);
    } else {
      setDrop(loc);
      setDropQuery(item.display_name);
      setDropSuggestions([]);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    return parseFloat((R * c).toFixed(2));
  };

  useEffect(() => {
    if (pickup.lat && drop.lat) {
      const dist = calculateDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);
      setDistanceKm(dist);
    } else {
      setDistanceKm(0);
      setSelectedCab(null);
    }
  }, [pickup, drop]);

  const confirmMapSelection = async () => {
    if (!tempMapCoords) return;
    const { lat, lng } = tempMapCoords;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const placeName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      if (activeMapField === 'pickup') {
        setPickup({ name: placeName, lat, lng });
        setPickupQuery(placeName);
      } else {
        setDrop({ name: placeName, lat, lng });
        setDropQuery(placeName);
      }
    } catch (err) {
      const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (activeMapField === 'pickup') {
        setPickup({ name: fallbackName, lat, lng });
        setPickupQuery(fallbackName);
      } else {
        setDrop({ name: fallbackName, lat, lng });
        setDropQuery(fallbackName);
      }
    }
    setActiveMapField(null);
    setTempMapCoords(null);
  };

  const handleConfirmBooking = () => {
    setIsBooked(true);
    setDriverPos([pickup.lat, pickup.lng]);

    let step = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        const currentLat = pickup.lat + ((drop.lat - pickup.lat) * step) / totalSteps;
        const currentLng = pickup.lng + ((drop.lng - pickup.lng) * step) / totalSteps;
        setDriverPos([currentLat, currentLng]);

        if (step === 30) setRideStatus('Cab arrived at pickup point');
        if (step === 40) setRideStatus('Trip Started - Heading to Destination');
        if (step === 90) setRideStatus('Reaching destination soon');
      } else {
        clearInterval(interval);
        setRideStatus('🎉 You have arrived at your destination!');
      }
    }, 1000);
  };

  const resetBooking = () => {
    setIsBooked(false);
    setPickup({ name: '', lat: null, lng: null });
    setDrop({ name: '', lat: null, lng: null });
    setPickupQuery('');
    setDropQuery('');
    setSelectedCab(null);
    setDriverPos(null);
  };

  return (
    <div style={styles.container}>
      {!isBooked ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>Book Your Ride</h2>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Pickup Location:</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter pickup location..."
                value={pickupQuery}
                onChange={(e) => handleSearch(e.target.value, 'pickup')}
                style={styles.input}
              />
              <button onClick={() => setActiveMapField('pickup')} style={styles.mapBtn}>
                🗺️ Map
              </button>
            </div>
            {pickupSuggestions.length > 0 && (
              <ul style={styles.dropdown}>
                {pickupSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => selectSuggestion(item, 'pickup')} style={styles.dropdownItem}>
                    📍 {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Drop Location:</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter drop location..."
                value={dropQuery}
                onChange={(e) => handleSearch(e.target.value, 'drop')}
                style={styles.input}
              />
              <button onClick={() => setActiveMapField('drop')} style={styles.mapBtn}>
                🗺️ Map
              </button>
            </div>
            {dropSuggestions.length > 0 && (
              <ul style={styles.dropdown}>
                {dropSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => selectSuggestion(item, 'drop')} style={styles.dropdownItem}>
                    📍 {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {pickup.lat && drop.lat && (
            <div style={styles.cabSection}>
              <h3>Select Vehicle</h3>
              <p style={styles.distanceText}>Total Distance: <strong>{distanceKm} km</strong></p>

              <div style={styles.cardGrid}>
                {CAB_TYPES.map((cab) => {
                  const totalFare = Math.round(distanceKm * cab.perKm);
                  const isSelected = selectedCab?.id === cab.id;

                  return (
                    <div
                      key={cab.id}
                      onClick={() => setSelectedCab(cab)}
                      style={{
                        ...styles.card,
                        ...(isSelected ? styles.cardSelected : {}),
                      }}
                    >
                      <img src={cab.image} alt={cab.name} style={styles.cardImg} />
                      <div style={styles.cardBody}>
                        <h4 style={styles.cardTitle}>{cab.name}</h4>
                        <span style={styles.badge}>Available</span>
                        <div style={styles.metaInfo}>
                          <span>👥 {cab.capacity} Seats</span>
                          <span>❄️ AC</span>
                          <span>⭐ {cab.rating}</span>
                        </div>
                        <div style={styles.rateText}>₹{cab.perKm} / km</div>
                        <div style={styles.fareHighlight}>
                          Estimated: <strong>₹{totalFare}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedCab && (
            <div style={styles.summaryCard}>
              <div>
                <div>Selected: <strong>{selectedCab.name}</strong></div>
                <div style={styles.totalPrice}>Total: ₹{Math.round(distanceKm * selectedCab.perKm)}</div>
              </div>
              <button style={styles.bookBtn} onClick={handleConfirmBooking}>
                Book Now 🚕
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={styles.trackingContainer}>
          <div style={styles.trackingHeader}>
            <h3>🚗 Live Trip Tracking</h3>
            <p style={styles.statusText}>{rideStatus}</p>
          </div>

          <div style={styles.liveMapWrapper}>
            <MapContainer
              center={[(pickup.lat + drop.lat) / 2, (pickup.lng + drop.lng) / 2]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[pickup.lat, pickup.lng]} />
              <Marker position={[drop.lat, drop.lng]} />
              {driverPos && <Marker position={driverPos} icon={carIcon} />}
              <Polyline
                positions={[
                  [pickup.lat, pickup.lng],
                  [drop.lat, drop.lng],
                ]}
                color="#2563eb"
                weight={4}
                dashArray="8, 8"
              />
            </MapContainer>
          </div>

          <div style={styles.tripDetailsCard}>
            <div><strong>Vehicle:</strong> {selectedCab.name}</div>
            <div><strong>Total Fare:</strong> ₹{Math.round(distanceKm * selectedCab.perKm)}</div>
            <div><strong>Pickup:</strong> {pickup.name.substring(0, 30)}...</div>
            <div><strong>Drop:</strong> {drop.name.substring(0, 30)}...</div>
            <button style={styles.resetBtn} onClick={resetBooking}>
              Book Another Ride
            </button>
          </div>
        </div>
      )}

      {activeMapField && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Pick {activeMapField === 'pickup' ? 'Pickup' : 'Drop'} on Map</h3>
            <div style={styles.mapContainer}>
              <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapPicker onSelectLocation={(latlng) => setTempMapCoords(latlng)} />
                {tempMapCoords && <Marker position={tempMapCoords} />}
              </MapContainer>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setActiveMapField(null)}>Cancel</button>
              <button style={styles.confirmBtn} disabled={!tempMapCoords} onClick={confirmMapSelection}>
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '850px',
    margin: '30px auto',
    padding: '25px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  fieldGroup: { marginBottom: '15px', position: 'relative' },
  label: { fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#334155' },
  inputWrapper: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' },
  mapBtn: { padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    listStyle: 'none',
    padding: 0,
    margin: '4px 0 0 0',
    maxHeight: '160px',
    overflowY: 'auto',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  dropdownItem: { padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '13px' },
  cabSection: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' },
  distanceText: { fontSize: '14px', color: '#64748b', marginBottom: '15px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
  },
  cardSelected: { borderColor: '#2563eb', boxShadow: '0 0 0 2px #2563eb', transform: 'translateY(-2px)' },
  cardImg: { width: '100%', height: '120px', objectFit: 'cover' },
  cardBody: { padding: '12px' },
  cardTitle: { margin: '0 0 4px 0', fontSize: '16px' },
  badge: { display: 'inline-block', backgroundColor: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', marginBottom: '8px' },
  metaInfo: { display: 'flex', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '8px' },
  rateText: { fontSize: '15px', fontWeight: 'bold', color: '#2563eb' },
  fareHighlight: { marginTop: '4px', fontSize: '13px', color: '#059669' },
  summaryCard: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
  },
  totalPrice: { fontSize: '20px', fontWeight: 'bold', color: '#0f172a' },
  bookBtn: { backgroundColor: '#2563eb', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  trackingContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  trackingHeader: { textAlign: 'center', backgroundColor: '#eff6ff', padding: '15px', borderRadius: '10px' },
  statusText: { color: '#2563eb', fontWeight: 'bold', margin: '5px 0 0 0' },
  liveMapWrapper: { height: '380px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  tripDetailsCard: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' },
  resetBtn: { marginTop: '10px', backgroundColor: '#0f172a', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '500px' },
  mapContainer: { height: '300px', borderRadius: '8px', overflow: 'hidden', margin: '15px 0' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#cbd5e1' },
  confirmBtn: { padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};