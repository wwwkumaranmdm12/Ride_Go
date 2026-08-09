import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (user.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        user
      );

      alert(response.data);

      navigate("/login");

    } catch (error) {

      if (error.response) {
        alert(error.response.data.message || error.response.data);
      } else {
        alert("Server Connection Failed");
      }

    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-left">

          <h1>🚖 RideGo</h1>

          <h2>Join RideGo Today</h2>

          <p>
            Create your account and enjoy safe, fast and affordable cab rides.
          </p>

        </div>

        <div className="register-right">

          <h2>Create Account</h2>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={user.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={user.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">
              Register
            </button>

          </form>

          <p className="login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;