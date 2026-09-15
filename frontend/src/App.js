import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import BackToTopButton from './Components/BackToTopButton';
import Main from './Components/Main';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ResetPassword from './Components/ResetPassword';
import ForgotPassword from './Components/ForgotPassword';
import EmailForm from './Components/EmailForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data); // Handle response from CodeIgniter
  
      if (data.status === 200) {
        // If login is successful, set loggedIn state to true
        setLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user_lvl', data.data.user_lvl); // Ensure the correct path to user_lvl
        localStorage.setItem('id', data.data.id); // Ensure the correct path to user_lvl
        return { success: true, user_lvl: data.data.user_lvl, first_name: data.data.first_name, id: data.data.id, last_name: data.data.last_name }; // Return user_lvl
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/DOST" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/send-email" element={<EmailForm/>} />
        <Route path="/DOST/*" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
