import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './components/Home';
import Teams from './components/Teams';
import Login from './components/Login';  // Import Login component
import Players from './components/Players';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Signup from './components/Signup';
import Contests from './components/Contests'; // Import your Contests component
import ContestDetails from './components/ContestDetails'; // Import your ContestDetails component
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './features/auth/authSlice';
import { apiService } from './utils/api';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

     useEffect(() => {
       const fetchBootstrapData = async () => {
         try {
           const data = await apiService.getBootstrapData();
           dispatch(setCurrentUser(data.currentUser));
         } catch (error) {
           console.error('Failed to fetch bootstrap data:', error);
         }
       };

       fetchBootstrapData();
     }, [dispatch]);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />  {/* Redirect from root to /home */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />  {/* Add Login route */}
        <Route path="/signup" element={<Signup />} />  {/* Add Login route */}
        <Route 
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }  
        />
        <Route 
          path="/players" 
          element={
            <ProtectedRoute>
              <Players />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contests" 
          element={
            <ProtectedRoute>
              <Contests />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/contests/:id"
          element={
            <ProtectedRoute>
              <ContestDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App; 