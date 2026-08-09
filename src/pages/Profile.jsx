import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Profile() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
   

      <div className="container" style={{ padding: "40px" }}>

        <h2>My Profile</h2>

        <div
          style={{
            maxWidth: "500px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >

          <p><b>Name :</b> {user?.fullName}</p>

          <p><b>Email :</b> {user?.email}</p>

          <p><b>Phone :</b> {user?.phone}</p>

        </div>

      </div>

    
    </>
  );
}

export default Profile;