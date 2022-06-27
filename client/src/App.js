import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Auth from './hoc/auth'

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={ Auth(<LandingPage /> , null) }/>
          <Route exact path="/login" element={ Auth(<LoginPage /> , false)}/>
          <Route exact path="/register" element={ Auth(<RegisterPage /> , false)}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
