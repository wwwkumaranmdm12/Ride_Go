import "./CabSection.css";

function CabSection() {

  const cabData = [

    {
      name: "Mini",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
      price: "₹12 / km",
      seats: "4 Seats",
      ac: "AC",
      rating: "4.8 ⭐"
    },

    {
      name: "Sedan",
      image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Dzire/12186/1771935643542/front-left-side-47.jpg",
      price: "₹16 / km",
      seats: "4 Seats",
      ac: "AC",
      rating: "4.9 ⭐"
    },

    {
      name: "SUV",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600",
      price: "₹22 / km",
      seats: "7 Seats",
      ac: "AC",
      rating: "5.0 ⭐"
    },

    {
      name: "Luxury",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
      price: "₹40 / km",
      seats: "4 Seats",
      ac: "Luxury",
      rating: "5.0 ⭐"
    }

  ];

  return (

    <section className="cab-section">

      <div className="cab-title">

        <h2>Choose Your Ride</h2>

        <p>
          Select your favorite cab and enjoy a comfortable journey.
        </p>

      </div>

      <div className="cab-container">

        {cabData.map((cab,index)=>(

          <div className="cab-card" key={index}>

            <img src={cab.image} alt={cab.name}/>

            <div className="cab-details">

              <h3>{cab.name}</h3>

              <span className="available">
                Available
              </span>

              <p>👥 {cab.seats}</p>

              <p>❄️ {cab.ac}</p>

              <p>⭐ {cab.rating}</p>

              <h4>{cab.price}</h4>

              <button>
                Book Now
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default CabSection;