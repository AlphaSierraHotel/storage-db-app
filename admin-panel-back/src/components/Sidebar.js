import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/users">Manage Users</Link></li>
        <li><Link to="/api-keys">Manage API Keys</Link></li>
        <li><Link to="/hdd-data">View HDD Data</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
