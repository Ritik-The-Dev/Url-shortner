import "../styles/Login.css";
import Images from "../assets";
import React, { useState } from "react";
import { useRegister } from "../api/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useRegister();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    number: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
    });

    let nameError = false
    if (registerData.name.length < 3) {
      nameError = true
      setError((prev) => ({
        ...prev,
        name: "Username should be greater than 3 characters.",
      }));
    }

    let emailError = false
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(registerData.email)) {
      emailError = true
      setError((prev) => ({ ...prev, email: "Invalid Email Id." }));
    }

    let numberError = false
    if (registerData.number.length !== 10) {
      numberError = true
      setError((prev) => ({
        ...prev,
        number: "Please enter a valid 10 digit mobile number.",
      }));
    }

    let passwordError = false
    if (!registerData.password) {
      passwordError = true
      setError((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    }

    let confirmPasswordError = false
    if (registerData.confirmPassword !== registerData.password) {
      confirmPasswordError = true
      setError((prev) => ({
        ...prev,
        password: "Password and Confirm Password do not match!",
        confirmPassword: "Password and Confirm Password do not match!",
      }));
    }
    if (
      !nameError &&
      !emailError &&
      !numberError &&
      !passwordError &&
      !confirmPasswordError
    ) {
      try {
        const response = await register(registerData);
        if (response && response?.success) {
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message || "Registration failed!");
      }
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
            onClick={() => navigate("/register")}
          >
            SignUp
          </button>
          <button
            className="login-nav-signup"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
        <form
          onSubmit={loading ? (e) => e.preventDefault() : handleSubmit}
          className="login-form"
        >
          <span className="login-title">Join us Today!</span>
          <div className="input-divs">
            <div>
              <input
                type="text"
                required
                placeholder="Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />
              {error.name && <p className="error-label">{error.name}</p>}
            </div>
            <div>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email Id"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              {error.email && <p className="error-label">{error.email}</p>}
            </div>
            <div>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="Mobile no."
                value={registerData.number}
                onChange={(e) =>
                  setRegisterData({ ...registerData, number: e.target.value })
                }
              />
              {error.number && <p className="error-label">{error.number}</p>}
            </div>
            <div className="password-input-container">
              <input
                type={"password"}
                required
                placeholder="Password"
                autoComplete="new-password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              {error.password && (
                <p className="error-label">{error.password}</p>
              )}
            </div>

            <div className="password-input-container">
              <input
                type={"password"}
                required
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {error.confirmPassword && (
                <p className="error-label">{error.confirmPassword}</p>
              )}
            </div>
          </div>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <span className="already-text">
            Already have an account?{" "}
            <span className="colored-text" onClick={() => navigate("/login")}>
              Login
            </span>
          </span>
        </form>
      </div>
      {loading && <Loader text="Creating your account." />}
    </div>
  );
}

export default Register;
