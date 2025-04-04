import React, { useState, useEffect } from 'react';
import './PlayerSelectionDialog.css'; // Add styles for the dialog
import { MAX_PLAYERS, TEAM_CREDIT, MAX_OVERSEAS_PLAYERS} from '../constants'; // Import constants
import Select from 'react-select';

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
  const overseasPlayersCount = selectedPlayers.filter(player => !player.indian).length

  const playerSelectionDisabled = selectedPlayers.length >= MAX_PLAYERS || totalCredits >= TEAM_CREDIT;

  const isPlayerDisabled = (player) => {
    const isPlayerOverseas = !player.indian; 
    return (
        selectedPlayers.includes(player) || 
        totalCredits + player.credits > TEAM_CREDIT || 
        (isPlayerOverseas && overseasPlayersCount >= MAX_OVERSEAS_PLAYERS)
    );
  };


  return (
    <div className="dialog-overlay-player-selection-dialog">
      <div className="dialog-content-player-selection-dialog">
        <div className="select-players-container-player-selection-dialog">
          <h3>Select Players</h3>
          <div className="button-group-player-selection-dialog">
            <button onClick={handleDone}>Done</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
        <div className="selected-players-player-selection-dialog">
          {selectedPlayers.map(player => (
            <span 
              key={player.id} 
              className="badge-player-selection-dialog" 
              onClick={() => handleRemoveSelectedPlayer(player)} // Remove player on badge click
            >
              {player.name} - {player.role} - {player.credits}
            </span>
          ))}
        </div>
        <div className="player-stats-container">
          <div className="stat-box">
            <strong>Players Selected:</strong> {selectedPlayers.length}
          </div>
          <div className="stat-box">
            <strong>Total Credits Used:</strong> {totalCredits}
          </div>
          <div className="stat-box">
            <strong>Credits Remaining:</strong> {TEAM_CREDIT - totalCredits}
          </div>
        </div>
        {selectedPlayers.length >= MAX_PLAYERS && (
          <div className="error-message-player-selection-dialog">11 players already selected. Please remove a player to add a new one.</div>
        )}
        {totalCredits >= TEAM_CREDIT && (
          <div className="error-message-player-selection-dialog">Total credits exceed the limit of {TEAM_CREDIT}. Please adjust your selection.</div>
        )}
        <div className="player-dropdowns-player-selection-dialog">
          <div className="team-dropdowns-container">
            {teams.map(team => (
              <div key={team} className="team-dropdown-player-selection-dialog">
                <label>{team}</label>
                <Select
                  className="custom-dropdown"
                  classNamePrefix="react-select"
                  value=''
                  placeholder="Select a player"
                  options={players
                    .filter(player => player.team_short_name === team)
                    .map(player => ({
                      value: player.id,
                      label: `${player.name} - ${player.role.toLowerCase()} - ${player.credits}`,
                      isDisabled: selectedPlayers.includes(player) || totalCredits + player.credits > TEAM_CREDIT,
                    }))
                  }
                  isSearchable
                  isDisabled={playerSelectionDisabled}
                  onChange={(selectedOption) => {
                    const selectedPlayer = players.find(p => p.id === selectedOption.value);
                    if (selectedPlayer) {
                      handleSelectPlayer(selectedPlayer);
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Role selection section on the right */}
          <div className="role-dropdowns-container">
            {roles.map(role => (
              <div key={role} className="role-dropdown-player-selection-dialog">
                <label>{role}</label>
                <Select
                  className="custom-dropdown"
                  classNamePrefix="react-select"
                  placeholder="Select a player"
                  value=''
                  options={players
                    .filter(player => player.role.toUpperCase() === role)
                    .map(player => ({
                      value: player.id,
                      label: `${player.name} - ${player.team_short_name} - ${player.credits}`,
                      isDisabled: isPlayerDisabled(player),
                    }))
                  }
                  isSearchable
                  isDisabled={playerSelectionDisabled}
                  onChange={(selectedOption) => {
                    const selectedPlayer = players.find(p => p.id === selectedOption.value);
                    if (selectedPlayer) {
                      handleSelectPlayer(selectedPlayer);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionDialog; 