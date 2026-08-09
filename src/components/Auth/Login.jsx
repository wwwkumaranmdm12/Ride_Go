import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log("LOGIN SUCCESS:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      if (error.response) {

        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);

        alert(
          error.response.data.message ||
          "Login Failed"
        );

      } else {

        alert("Server Connection Failed");

      }

    }

  };


  return (

    <div className="login-page">

      <div className="login-container">


        <div className="login-left">

          <h1>🚖 RideGo</h1>

          <h2>Welcome Back!</h2>

          <p>
            Login to continue your journey with RideGo.
            Book safe and affordable rides anytime.
          </p>

        </div>



        <div className="login-right">

          <h2>Login</h2>


          <form onSubmit={handleLogin}>


            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button type="submit">
              Login
            </button>


          </form>


          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              {" "}Register
            </Link>

          </p>


        </div>


      </div>


    </div>

  );

}

export default Login;