import React, { useEffect, useState } from 'react';
import { uniq } from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiService from '../utils/api';
import { fetchPlayers } from '../store/playersSlice'; // Import the fetchPlayers action and selector
import { getPlayerDetailsByIds } from '../utils/playerUtils'; // Import the utility function
import './TeamDetails.css'; // Add styles for the team details page
import { MAX_PLAYERS, TEAM_CREDIT } from '../constants'; // Import constants
import PlayerSelectionDialog from './PlayerSelectionDialog'; // Import the dialog component
import { toast, ToastContainer } from 'react-toastify';
import './ToastStyles.css'; // Import the toast styles

const TeamDetails = () => {
  const { id: teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const players = useSelector((state) => state.players.players); // Access players
  const [playerDetails, setPlayerDetails] = useState([]); // State to hold player details
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [isModified, setIsModified] = useState(false); // Track if player selection has changed
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
  const [isPublished, setIsPublished] = useState(false);
  const [showRules, setShowRules] = useState(false); // State for rules tooltip
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for confirmation dialog

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
      setCaptainId(team.captain_id);
      setViceCaptainId(team.vice_captain_id);
      setIsPublished(team.published);
    }
  }, [players, team]); // Run when players or team changes

  // Close rules tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRules && !event.target.closest('.rules-tooltip-container-team-details')) {
        setShowRules(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRules]);

  const usedCredits = playerDetails.reduce((sum, player) => sum + player.credits, 0);
  const remainingCredits = TEAM_CREDIT - usedCredits;

  const handleRemovePlayer = (playerId) => {
    setPlayerDetails(prev => prev.filter(player => player.id !== playerId));
    if (captainId === playerId) {
      setCaptainId(null);
    }
    if (viceCaptainId === playerId) {
      setViceCaptainId(null);
    }
    setIsModified(true); // Mark as modified
  };

  const handleActionClick = (playerId, action) => {
    const player = playerDetails.find(p => p.id === playerId);
    if (action === 'remove') {
      handleRemovePlayer(playerId);
    } else if (action === 'captain') {
      if (viceCaptainId === playerId) {
        setViceCaptainId(null); // Remove vice-captain if the same player is made captain
      }
      setCaptainId(player.id);
    } else if (action === 'vice-captain') {
      if (captainId === playerId) {
        setCaptainId(null); // Remove captain if the same player is made vice-captain
      }
      setViceCaptainId(player.id);
    }
    setIsModified(true);
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
    try {
      // Make the backend call to update the IPL team
      const updatedPlayers = playerDetails.map(player => player.id); // Get the updated player IDs
      await apiService.updateTeam(
        teamId, { 
          players: updatedPlayers, 
          captain_id: captainId, 
          vice_captain_id: viceCaptainId
        }
      );
      setIsModified(false); // Reset modified state

      // Show success toast
      toast.success("Information saved successfully!");
      
      // Return a resolved promise
      return Promise.resolve();
    } catch (error) {
      // Handle error (optional)
      toast.error("Failed to save information. Please try again.");
      
      // Return a rejected promise
      return Promise.reject(error);
    }
  };

  const toggleDropdown = (playerId) => {
    setOpenDropdownId(openDropdownId === playerId ? null : playerId);
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const publishData = async () => {
    try{
      await apiService.publishTeam(teamId);
      setIsModified(false);
      toast.success("Team published successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    } catch (error) {
      toast.error("Could not publish team");
    }
  };

  const handlePublish = async () => {
    const confirmPublish = window.confirm("Once published, you can't make changes to your team. Do you still want to publish?");
    if (confirmPublish){
      try {
        // Save first
        await handleSave();
        // Then publish
        await publishData();
      } catch (error) {
        toast.error("Error during publish process: " + error.message);
      }
    }
    return;
  };

  // Function to check if the publish button should be enabled
  const isPublishEnabled = () => {
    const selectedPlayersCount = playerDetails.length;
    const isCreditsValid = usedCredits <= TEAM_CREDIT;
    const isCaptainSelected = captainId !== null;
    const isViceCaptainSelected = viceCaptainId !== null;
    return selectedPlayersCount === MAX_PLAYERS && isCreditsValid && isCaptainSelected && isViceCaptainSelected;
  };

  // Function to get missing requirements for tooltip
  const getMissingRequirements = () => {
    const requirements = [];
    
    if (playerDetails.length !== MAX_PLAYERS) {
      requirements.push(`Select ${MAX_PLAYERS} players (currently have ${playerDetails.length})`);
    }
    
    if (usedCredits > TEAM_CREDIT) {
      requirements.push(`Reduce team credits (currently ${usedCredits}, maximum allowed is ${TEAM_CREDIT})`);
    }
    
    if (captainId === null) {
      requirements.push('Select a captain');
    }
    
    if (viceCaptainId === null) {
      requirements.push('Select a vice-captain');
    }
    
    return requirements;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const navigateToHome = () => {
    if (isModified) {
      const confirmNavigation = window.confirm("You have unsaved changes. If you navigate away, all changes will be lost. Do you want to continue?");
      
      if (!confirmNavigation) {
          return; // Stop navigation if the user cancels
      }
    }
    navigate('/');
  }; 

  const navigateBack = () => {
    if (isModified) {
      const confirmNavigation = window.confirm("You have unsaved changes. If you navigate away, all changes will be lost. Do you want to continue?");
      
      if (!confirmNavigation) {
          return; // Stop navigation if the user cancels
      }
    }
    navigate('/teams');
  }; 


  return (
    <div className="team-details-container-team-details">
      {isPublished && (
        <div className="published-message-team-details">
          This team is published and no changes can be made to it.
        </div>
      )}
      <div className="header-team-details">
        <div className="save-publish-buttons-team-details">
        <button
          className="home-button-team-details"
          onClick={() => navigateToHome()} // Navigate to the home page
        >
          Home
        </button>
        <button
          className="home-button-team-details"
          onClick={() => navigateBack()} // Navigate to the home page
        >
          Back
        </button>
        </div>
        <h2>{team.name}</h2>
        <div className="save-publish-buttons-team-details">
          <button 
            className="save-button-team-details"
            onClick={handleSave} 
            disabled={!isModified || isPublished} // Disable if no changes or published
          >
          Save
        </button>
        <div className="publish-button-container">
          <button 
            onClick={handlePublish} 
            disabled={!isPublishEnabled() || isPublished} // Disable if conditions are not met
            className="publish-button-team-details"
          >
            Publish
          </button>
          {(!isPublishEnabled() && !isPublished) && (
            <div className="publish-tooltip">
              <div className="publish-tooltip-title">Complete these steps to publish:</div>
              <ul>
                {getMissingRequirements().map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <h3>Team Information</h3>
        <div className="rules-tooltip-container-team-details">
          <div className="rules-icon-team-details" onClick={toggleRules}>ⓘ</div>
          {showRules && (
            <div className="rules-tooltip-team-details">
              <div className="rules-tooltip-title-team-details">Team Selection Rules</div>
              <ul className="rules-tooltip-list-team-details">
                <li>You need to select 11 players</li>
                <li>You have 975 credits to spend to create a team</li>
                <li>You can select up to 4 overseas players</li>
                <li>Make a captain and vice-captain. Your captain will receive 2x and vice-captain 1.5x points for every match</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="team-info-team-details">
        <div className="info-item-team-details">
          <strong>Total Credits:</strong> {TEAM_CREDIT}
        </div>
        <div className="info-item-team-details">
          <strong>Current Number of Players:</strong> {team.players.length}
        </div>
        <div className="info-item-team-details">
          <strong>Used Credits:</strong> {usedCredits}
        </div>
        <div className="info-item-team-details">
          <strong>Remaining Credits:</strong> {remainingCredits}
        </div>
      </div>
      <div className="team-details-players-team-details">
        <h3>Players</h3>
        <button 
          className="add-player-button-team-details"
          onClick={handleOpenDialog} 
          disabled={isPublished}
        > 
          Add players
        </button> {/* Button to open dialog */}
      </div>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Team</th>
            <th>Role</th>
            <th>Credits</th>
            <th>Indian/Overseas</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {playerDetails.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                {player.name} 
                {captainId === player.id && <span className="badge-team-details">Captain</span>}
                {viceCaptainId === player.id && <span className="badge-team-details">Vice-Captain</span>}
              </td>
              <td>{player.team_short_name}</td>
              <td>{player.role.toLowerCase()}</td> {/* Convert role to lowercase */}
              <td>{player.credits}</td>
              <td>{player.indian ? 'Indian' : 'Overseas'}</td> {/* Determine Indian/Overseas */}
              <td>
                <div className="actions-dropdown-team-details">
                  <button
                    className="actions-button-team-details"
                    disabled={isPublished}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(player.id);
                    }}
                  >
                    &#8942;
                  </button>
                  {openDropdownId === player.id && (
                    <div className="dropdown-content-team-details">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(player.id, 'remove')
                          setOpenDropdownId(null);
                        }}
                      >
                        Remove
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(player.id, 'captain')
                          setOpenDropdownId(null);
                        }}
                      >
                        Make Captain
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(player.id, 'vice-captain')
                          setOpenDropdownId(null); 
                        }}
                      >
                        Make Vice-Captain
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {dialogOpen && (
        <PlayerSelectionDialog 
          players={players} 
          onClose={handleCloseDialog}
          disabled={isPublished} 
          onAddPlayers={handleAddPlayers} 
          alreadySelectedPlayers={playerDetails} // Pass the already selected players
        />
      )}
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default TeamDetails; 