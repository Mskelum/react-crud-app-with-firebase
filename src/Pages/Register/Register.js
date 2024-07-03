import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../Firebase';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cmpassword, setCmpassword] = useState('');

  const navigate = useNavigate();

  const SignIn = async (e) => {
    e.preventDefault();
    if (password !== cmpassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setCmpassword('');
      alert("Register success");
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="cmpassword">Confirm Password:</label>
          <input
            type="password"
            id="cmpassword"
            value={cmpassword}
            onChange={(e) => setCmpassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit" className="login-button" onClick={SignIn}>Register</button><p></p>
        Don't you have account?<p></p>
        <button className="login-button">
          <Link to='/'>Login</Link>
        </button>
        <br />
      </form>
    </div>
  );
};

export default Register;
