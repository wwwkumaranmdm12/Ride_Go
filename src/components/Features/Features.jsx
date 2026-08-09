import "./Features.css";

function Features() {
  const featureData = [
    {
      icon: "🚖",
      title: "Easy Booking",
      desc: "Book your ride in less than a minute with a simple booking process."
    },
    {
      icon: "🛡️",
      title: "100% Safe Ride",
      desc: "Verified drivers with live GPS tracking for complete safety."
    },
    {
      icon: "💰",
      title: "Affordable Fare",
      desc: "Transparent pricing with no hidden charges."
    },
    {
      icon: "⚡",
      title: "Fast Pickup",
      desc: "Nearest driver reaches you within minutes."
    },
    {
      icon: "📍",
      title: "Live Tracking",
      desc: "Track your cab in real-time from pickup to destination."
    },
    {
      icon: "⭐",
      title: "Top Rated Drivers",
      desc: "Professional drivers with excellent customer ratings."
    }
  ];

  return (
    <section className="features">

      <div className="features-title">
        <h2>Why Choose RideGo?</h2>
        <p>
          Experience premium cab booking with comfort, safety and speed.
        </p>
      </div>

      <div className="features-container">

        {featureData.map((item, index) => (

          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;