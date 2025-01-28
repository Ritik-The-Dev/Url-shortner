import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/NotFound.css'

function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className='main-app'>
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Oops! Page not found</h2>
        <p className="error-description">
          The page you're looking for might have been moved or deleted. Please
          check the URL or return to the homepage.
        </p>
        <button onClick={goHome} className="back-home-btn">
          Go to Homepage
        </button>
      </div>
    </div>
    </div>
  );
}

export default NotFound;
