import "../styles/Login.css";
import Images from "../assets";
import { useLogin } from "../api/hooks";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { USERDATA } from "../recoil/recoil";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const setUserData = useSetRecoilState(USERDATA);
  const { login, loading } = useLogin();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData);
      if (response && response?.success) {
        setUserData(response?.data);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Login failed!");
    }
  };

  return (
    <div className="main-login">
      <div
        className="login-container-left"
        style={{ backgroundImage: `url(${Images.loginBackground})` }}
      >
        <img src={Images.logo} alt="logo" className="login-logo" />
      </div>
      <div className="login-container-right">
        <div className="login-container-top-right">
          <div className="sm-logo">
          <img src={Images.logo} alt="logo" className="md-login-logo" />
            <img src={Images.smLogo} alt="logo" className="sm-login-logo" />
          </div>
          <button
            className="register-nav-signup"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="login-nav-signup"
            onClick={() => navigate("/register")}
          >
            SignUp
          </button>
        </div>
        <form
          onSubmit={loading ? (e) => e.preventDefault() : handleSubmit}
          className="login-form"
        >
          <span className="login-title">Login</span>
          <br />
          <div className="input-divs">
            <input
              type="email"
              required
              placeholder="Email Id"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <div className="password-input-container">
              <input
                type={"password"}
                required
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
          </div>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <span className="already-text">
            Don't have an account?{" "}
            <span
              className="colored-text"
              onClick={() => navigate("/register")}
            >
              SignUp
            </span>
          </span>
        </form>
      </div>
      {loading && <Loader text="Please Wait, Signing In..." />}
    </div>
  );
}

export default Login;
