import React, { useState, useEffect } from 'react';
import './PlayerSelectionDialog.css'; // Add styles for the dialog
import { MAX_PLAYERS, TEAM_CREDIT } from '../constants'; // Import constants

const PlayerSelectionDialog = ({ players, onClose, onAddPlayers, alreadySelectedPlayers }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const teams = [...new Set(players.map(player => player.team_short_name))]; // Get unique team names
  const roles = ['BATTER', 'BOWLER', 'ALLROUNDER']; // Define normalized player roles

  // Initialize selected players with already selected players
  useEffect(() => {
    setSelectedPlayers(alreadySelectedPlayers);
  }, [alreadySelectedPlayers]);

  const handleSelectPlayer = (player) => {
    if (!selectedPlayers.includes(player) ) {
      setSelectedPlayers(prev => [...prev, player]);
    }
  };

  const handleRemoveSelectedPlayer = (player) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
  };

  const handleDone = () => {
    onAddPlayers(selectedPlayers);
    onClose();
  };

  // Calculate total credits of selected players
  const totalCredits = selectedPlayers.reduce((total, player) => total + player.credits, 0);

  const playerSelectionDisabled = selectedPlayers.length >= MAX_PLAYERS || totalCredits >= TEAM_CREDIT;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>Select Players</h3>
        <div className="selected-players">
          {selectedPlayers.map(player => (
            <span 
              key={player.id} 
              className="badge" 
              onClick={() => handleRemoveSelectedPlayer(player)} // Remove player on badge click
            >
              {player.name} - {player.role} - {player.credits}
            </span>
          ))}
        </div>
        <div className="total-credits">
          <strong>Total Credits of Selected Players: </strong> {totalCredits}
        </div>
        {selectedPlayers.length >= MAX_PLAYERS && (
          <div className="error-message">11 players already selected. Please remove a player to add a new one.</div>
        )}
        {totalCredits >= TEAM_CREDIT && (
          <div className="error-message">Total credits exceed the limit of {TEAM_CREDIT}. Please adjust your selection.</div>
        )}
        <div className="player-dropdowns">
          {teams.map(team => (
            <div key={team} className="team-dropdown">
              <label>{team}</label>
              <select 
                onChange={(e) => handleSelectPlayer(players.find(p => p.id === e.target.value))}
                disabled={playerSelectionDisabled}
              >
                <option value="">Select a player</option>
                {players
                  .filter(player => player.team_short_name === team) // Filter players by team
                  .map(player => (
                    <option 
                      key={player.id} 
                      value={player.id} 
                      disabled={selectedPlayers.includes(player) || totalCredits + player.credits > TEAM_CREDIT} // Disable if already selected or exceeds credit
                    >
                      {player.name} - {player.role} - {player.credits}
                    </option>
                  ))}
              </select>
            </div>
          ))}
          {/* Add dropdowns for player roles */}
          {roles.map(role => (
            <div key={role} className="role-dropdown">
              <label>{role}</label>
              <select 
                onChange={(e) => handleSelectPlayer(players.find(p => p.role.toUpperCase() === role))}
                disabled={playerSelectionDisabled}
              >
                <option value="">Select a player</option>
                {players
                  .filter(player => player.role.toUpperCase() === role) // Normalize role comparison
                  .map(player => (
                    <option 
                      key={player.id} 
                      value={player.id} 
                      disabled={selectedPlayers.includes(player)} // Disable if already selected
                    >
                      {player.name} - {player.team_short_name} - {player.credits}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>
        <button onClick={handleDone}>Done</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PlayerSelectionDialog; 