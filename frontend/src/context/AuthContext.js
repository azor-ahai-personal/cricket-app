import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, decode the token to check its validity
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      setIsAuthenticated(!isExpired);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Set loading to false after checking
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    navigate('/'); // Redirect to home or desired page after login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 