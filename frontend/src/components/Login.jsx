import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/login`, {
        email,
        password,
      });
      
      const token = response.data.token;
      login(token);
      navigate('/home'); // Redirect to home page after successful login
      
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container-login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-login">{error}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{' '}
          <span className="link-login" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login; 