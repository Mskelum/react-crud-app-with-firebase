import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import NavbarAdmin from './Components/Navbar/NavbarAdmin';
import Contact from './Pages/Contact/Contact';
import Forgot from './Pages/ForgotPassword/Forgot';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/navbaradmin" element={<NavbarAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
