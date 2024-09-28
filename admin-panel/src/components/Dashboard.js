// File: src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Logout function to clear token and redirect to login
  const handleLogout = () => {
    // Clear the token from both localStorage and sessionStorage
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('jwtToken');
    
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      <p>This page is only accessible if you are logged in.</p>
      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
  );
};

export default Dashboard;
