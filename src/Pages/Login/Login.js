import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../../Firebase';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate]);

  const SignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (code === '1234') {
        alert("Login to admin page");
        navigate('/admin', { replace: true });
      } else if (code !== '1234' && code !== '') {
        alert("Code incorrect");
        navigate('/', { replace: true });
      } else {
        alert("Login to home page");
        navigate('/home', { replace: true });
      }
    } catch (error) {
      alert("Email or password incorrect!");
    }
  };



  const SignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setEmail('');
      setPassword('');
      navigate('/home', { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={SignIn}>
        <h2>Login</h2>
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
        <p>If you are an admin, please enter code</p>
        <div className="form-group">
          <label htmlFor="code">Code = 1234</label>
          <input
            type="number"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <p>
          Forgot your password? <Link to="/forgot">Reset it here</Link>
        </p>
        <button type="submit" className="login-button">Login</button><p></p>
        <button type="button" className="login-button" onClick={SignInWithGoogle}>Sign in with Google</button><p></p>
        <button type="button" className="login-button">
          <Link to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
        </button>
      </form>
    </div>
  );
};

export default Login;
