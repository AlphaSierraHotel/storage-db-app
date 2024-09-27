import React from 'react';
import Sidebar from './components/Sidebar';
import Users from './components/Users';
import ApiKeys from './components/ApiKeys';
import HddData from './components/HddData';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Switch>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/api-keys">
              <ApiKeys />
            </Route>
            <Route path="/hdd-data">
              <HddData />
            </Route>
            <Route path="/" exact>
              <h1>Welcome to the Admin Panel</h1>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
