import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    navigate('/create-team');
  };

  const handleViewTeam = () => {
    navigate('/view-team');
  };

  const handleViewPlayers = () => {
    navigate('/players');
  };

  return (
    <div className="home-container">
      <div className="buttons-container">
        <button className="action-button" onClick={handleCreateTeam}>
          Create Team
        </button>
        <button className="action-button" onClick={handleViewTeam}>
          View Team
        </button>
        <button className="action-button" onClick={handleViewPlayers}>
          View Players
        </button>
      </div>
    </div>
  );
};

export default Home; 