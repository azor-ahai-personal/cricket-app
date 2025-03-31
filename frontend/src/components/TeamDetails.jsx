import React, { useEffect, useState } from 'react';
import { uniq } from 'lodash';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiService from '../utils/api';
import { fetchPlayers } from '../store/playersSlice'; // Import the fetchPlayers action and selector
import { getPlayerDetailsByIds } from '../utils/playerUtils'; // Import the utility function
import './TeamDetails.css'; // Add styles for the team details page
import { TEAM_CREDIT } from '../constants'; // Import constants
import PlayerSelectionDialog from './PlayerSelectionDialog'; // Import the dialog component

const TeamDetails = () => {
  const { id: teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  
  const players = useSelector((state) => state.players.players); // Access players
  const [playerDetails, setPlayerDetails] = useState([]); // State to hold player details
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [isModified, setIsModified] = useState(false); // Track if player selection has changed

  const fetchTeamDetails = async () => {
    try {
      const response = await apiService.getTeam(teamId); // Fetch team details
      setTeam(response.fantasy_team); // Adjust based on your API response structure
    } catch (err) {
      setError('Failed to fetch team details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch team details
    fetchTeamDetails(); // Fetch team details

    // Check if players are already in the Redux store
    if (!players || players.length === 0) {
      dispatch(fetchPlayers()); // Fetch players if not present
    }
  }, [teamId, dispatch]); // Only run when teamId or dispatch changes

  useEffect(() => {
    // Call the utility function whenever players are updated
    if (players && team) {
      const ids = uniq(team.players.map(player => player.id));
      const details = getPlayerDetailsByIds(players, ids);
      setPlayerDetails(details); // Update playerDetails state
    }
  }, [players, team]); // Run when players or team changes

  console.log({playerDetails});

  const usedCredits = playerDetails.reduce((sum, player) => sum + player.credits, 0);
  const remainingCredits = TEAM_CREDIT - usedCredits;

  const handleRemovePlayer = (playerId) => {
    setPlayerDetails(prev => prev.filter(player => player.id !== playerId));
    setIsModified(true); // Mark as modified
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddPlayers = (newPlayers) => {
    setPlayerDetails(prev => [...newPlayers]);
    setIsModified(true); // Mark as modified
  };

  const handleSave = async () => {
    // Make the backend call to update the IPL team
    const updatedPlayers = playerDetails.map(player => player.id); // Get the updated player IDs
    await apiService.updateTeam(teamId, {players: updatedPlayers});
    setIsModified(false); // Reset modified state
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="team-details-container">
      <h2>{team.name}</h2>
      <h3>Team Information</h3>
      <div className="team-info">
        <div className="info-item">
          <strong>Total Credits:</strong> {TEAM_CREDIT}
        </div>
        <div className="info-item">
          <strong>Current Number of Players:</strong> {team.players.length}
        </div>
        <div className="info-item">
          <strong>Used Credits:</strong> {usedCredits}
        </div>
        <div className="info-item">
          <strong>Remaining Credits:</strong> {remainingCredits}
        </div>
      </div>
      <h3>Players</h3>
      <button onClick={handleOpenDialog}>Add a Player</button> {/* Button to open dialog */}
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Team</th>
            <th>Role</th>
            <th>Credits</th>
            <th>Indian/Overseas</th>
            <th>Action</th> {/* Column for removing players */}
          </tr>
        </thead>
        <tbody>
          {playerDetails.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.team_short_name}</td>
              <td>{player.role.toLowerCase()}</td> {/* Convert role to lowercase */}
              <td>{player.credits}</td>
              <td>{player.indian ? 'Indian' : 'Overseas'}</td> {/* Determine Indian/Overseas */}
              <td>
                <button onClick={() => handleRemovePlayer(player.id)}>Remove</button> {/* Button to remove player */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {dialogOpen && (
        <PlayerSelectionDialog 
          players={players} 
          onClose={handleCloseDialog} 
          onAddPlayers={handleAddPlayers} 
          alreadySelectedPlayers={playerDetails} // Pass the already selected players
        />
      )}
      <button 
        onClick={handleSave} 
        disabled={!isModified} // Disable if no changes
        style={{ float: 'right' }} // Position the save button to the right
      >
        Save
      </button>
    </div>
  );
};

export default TeamDetails; 