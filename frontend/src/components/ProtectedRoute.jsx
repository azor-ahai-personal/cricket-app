import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your Auth context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get authentication state

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return children; // Render the children if authenticated
};

export default ProtectedRoute; 