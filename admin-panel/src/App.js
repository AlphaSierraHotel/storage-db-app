import React from 'react';
import Sidebar from './components/Sidebar';
import Users from './components/Users';
import ApiKeys from './components/ApiKeys';
import HddData from './components/HddData';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
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
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// PrivateRoute component to protect the dashboard route
const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
  return token ? <Component /> : <Navigate to="/" />;
};

export default App;
