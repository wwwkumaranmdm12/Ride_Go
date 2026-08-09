import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Settings() {
  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: "40px" }}>
        <h2>⚙ Settings</h2>

        <div
          style={{
            maxWidth: "500px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >
          <p>🌙 Dark Mode (Coming Soon)</p>
          <p>🔔 Notifications (Coming Soon)</p>
          <p>🔒 Change Password (Coming Soon)</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Settings;