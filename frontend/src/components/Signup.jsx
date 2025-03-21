import React, { useState } from 'react';
import apiService from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await apiService.signup({
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      localStorage.setItem('token', response.token);
      navigate('/home');
    } catch (err) {
      console.error('Signup error:', err.response || err); // Debug log
      setError(err.response?.data?.errors?.join(', ') || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
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
            minLength="6"
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <span className="link" onClick={() => navigate('/')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup; 