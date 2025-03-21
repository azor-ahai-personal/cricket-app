import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './components/Home';
import CreateTeam from './components/CreateTeam';
import ViewTeam from './components/ViewTeam';
import Login from './components/Login';  // Import Login component
import Players from './components/Players';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
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
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/view-team" element={<ViewTeam />} />
        <Route 
          path="/players" 
          element={
            <ProtectedRoute>
              <Players />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App; 