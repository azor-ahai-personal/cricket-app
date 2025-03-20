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

  return (
    <div className="home-container">
      <div className="buttons-container">
        <button className="home-button" onClick={handleCreateTeam}>
          Create Team
        </button>
        <button className="home-button" onClick={handleViewTeam}>
          View Team
        </button>
      </div>
    </div>
  );
};

export default Home; 