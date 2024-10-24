// components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Make sure to style your Navbar in this CSS file

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  const token = localStorage.getItem('token'); // Check if the user is logged in

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyWeatherApp</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {!token ? ( // If no token, show login and register options
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : ( // If token exists, show profile and alerts options
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/weather-alerts">Alerts</Link>
            </li>
            <li>
              <Link to="/stats">Stats</Link>
            </li>

            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
