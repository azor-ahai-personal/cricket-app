import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateTeam from './components/CreateTeam';
import ViewTeam from './components/ViewTeam';
import Players from './components/Players';
import Login from './components/Login';  // Import Login component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />  {/* Add Login route */}
      <Route path="/home" element={<Home />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/view-team" element={<ViewTeam />} />
      <Route path="/players" element={<Players />} />
    </Routes>
  );
}

export default App; 