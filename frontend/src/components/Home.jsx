import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="home-container-home">
      <div className="buttons-container-home">
        <div style={{ position: 'relative' }}>
          <div className="tooltip tooltip-teams">
            Dream Team Headquarters! Craft your fantasy squad with IPL superstar! 🏏✨
          </div>
          <button className="action-button-home" onClick={handleCreateTeam}>
            Your Teams
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button className="action-button-home" onClick={handleViewPlayers}>
            View Players
          </button>
          <div className="tooltip tooltip-players">
            Player Paradise! Meet the IPL players and their teams with cool stats about them! 🔍🌟
          </div>
        </div>
        
        {/* <div style={{ position: 'relative' }}>
          <div className="tooltip tooltip-contests">
            Battle Arena! Create or join epic showdowns, climb the leaderboard, and brag about your cricket genius! 🏆🎯
          </div>
          <button className="action-button-home" onClick={handleViewContests}>
            Contests
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Home; 