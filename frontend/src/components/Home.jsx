import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    navigate('/teams');
  };
  
  const handleViewPlayers = () => {
    navigate('/players');
  };

  const handleViewContests = () => {
    navigate('/contests');
  };

  return (
    <div className="home-container">
      <div className="buttons-container">
        <button className="action-button" onClick={handleCreateTeam}>
          Your Teams
        </button>
        <button className="action-button" onClick={handleViewPlayers}>
          View Players
        </button>
        <button className="action-button" onClick={handleViewContests}>
          Contests
        </button>
      </div>
    </div>
  );
};

export default Home; 