import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase';

const NavbarAdmin = () => {

  const navigate = useNavigate();

  const Logout = async () => {
    await signOut(auth);
    navigate('/'); 
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/admin">
          <p style = {{color: 'white'}}>Logo</p>
        </Link>
      </div>
      <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default NavbarAdmin;
