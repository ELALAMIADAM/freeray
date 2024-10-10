import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Footer from './footer.jsx';
import Login from './pages/login.jsx';
import Header from './Header.jsx';
import Home from './pages/Home.jsx';
import DASH_List from './pages/DASH_List.jsx';
import List_Slave from './pages/List_Slave.jsx';
import List_Signal from './pages/List_Signal.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Data from './pages/Data.jsx';
import Compte from './pages/Compte.jsx';
import Proj from './pages/projects.jsx';
import ProjCR from './pages/create_project.jsx';
import ProjCO from './pages/connectproject.jsx';
import Standard from './pages/Standard.jsx';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  

  const handleSignUp = async (username, password, email) => {
    try {
      const response = await axios.post('http://localhost:3001/signup', {
        username,
        password,
        email
      });
      alert('Sign up successful');
    } catch (error) {
      console.error('Sign up error details:', error.response?.data || error.message);
      setError('Sign up failed. Please check your input and try again.');
    }
  };
  
  

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      });
      const token = response.data.token; 
      setIsLoggedIn(true);
    } catch (error) {
      alert('Login failed');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {isLoggedIn && <Header onLogout={handleLogout} />}
        <div className="content">
          <Routes>
            {!isLoggedIn && <Route path="/login" element={<Login onLogin={handleLogin} onSignUp={handleSignUp} />} />}
            {isLoggedIn ? (
              <> {/* Render these routes only if logged in */}
                <Route path="/" element={<Home />} />
                <Route path="/Standard" element={<Standard />} />
                <Route path="/List/Slave" element={<List_Slave />} />
                <Route path="/List/Signal" element={<List_Signal />} />
                {/* <Route path="/Compte" element={<Compte />} /> */}
                <Route path="/projects" element={<Proj/>} />
                <Route path="/projects/create" element={<ProjCR/>} />
                <Route path="/projects/connect" element={<ProjCO/>} />
                <Route path="/Data" element={<Data />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Dashboard/List_insert" element={<DASH_List />} />
                <Route path="*" element={<Navigate to="/" />} /> 
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} /> 
            )}
          </Routes>
        </div>
        {isLoggedIn && <Footer onLogout={handleLogout} />}
      </div>
    </Router>
  );
};

export default App;
