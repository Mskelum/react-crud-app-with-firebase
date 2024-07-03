import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../Firebase';

const Navbar = () => {

  const navigate = useNavigate();

  const Logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
        <p style = {{color: 'white'}}>Logo</p>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default Navbar;
