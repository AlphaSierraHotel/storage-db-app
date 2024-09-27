import React from 'react';
import Sidebar from './components/Sidebar';
import Users from './components/Users';
import ApiKeys from './components/ApiKeys';
import HddData from './components/HddData';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            {/* Update to use the 'element' prop and remove 'exact' */}
            <Route path="/users" element={<Users />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="/hdd-data" element={<HddData />} />
            <Route path="/" element={<h1>Welcome to the Admin Panel</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
