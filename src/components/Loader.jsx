import React from 'react';
import '../styles/Loader.css'; 

const Loader = ({ text }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <svg className="loader-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="loader-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="loader-path" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="loader-text">{text ? text : 'Loading...'}</span>
      </div>
    </div>
  );
}

export default Loader;
