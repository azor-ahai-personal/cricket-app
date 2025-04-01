import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../utils/api';
import './ContestDetails.css'; // Import the CSS file
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlayers } from '../store/playersSlice';
import { Select, MenuItem, Chip, InputLabel, FormControl } from '@mui/material';

const ContestDetails = () => {
  const { id } = useParams(); // Get the contest ID from the URL
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTeams, setAllTeams] = useState([]); // State for user teams
  const [userTeams, setUserTeams] = useState([]); // State for user teams
  const [selectedTeamId, setSelectedTeamId] = useState(null); // State for selected team
  const [selectedOrangeCap, setSelectedOrangeCap] = useState(null); // State for orange cap player
  const [selectedPurpleCap, setSelectedPurpleCap] = useState(null); // State for purple cap player
  const [selectedPlayerOfTheTournament, setSelectedPlayerOfTheTournament] = useState(null); // State for player of the tournament
  const [selectedTopTeams, setSelectedTopTeams] = useState([]); // State for top 4 teams

  const [published, setPublished] = useState(false);  

  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);
  const teams = useSelector((state) => state.players.teams);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await apiService.getContest(id); // Call the show EP
        setContest(response); // Set the contest details
        setAllTeams(response.all_teams); // Set all teams from the response
      } catch (err) {
        setError('Failed to fetch contest details');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTeams = async () => {
      try {
        const teamsResponse = await apiService.getTeams({published: true}); // API call to get user's published teams
        setUserTeams(teamsResponse.fantasy_teams); // Set user's teams
      } catch (err) {
        setError('Failed to fetch user teams');
      }
    };

    fetchContestDetails();
    fetchUserTeams();
  }, [id]);

  useEffect(() => {
    const fetchPlayersIfNeeded = async () => {
      if (!players || players.length === 0) {
        await dispatch(fetchPlayers()); // Fetch players if not already in the store
      }
    };

    fetchPlayersIfNeeded();
  }, [dispatch, players]);

  const handleTeamChange = (event) => {
    setSelectedTeamId(event.target.value); // Update selected team ID
  };

  const handleParticipate = async () => {
    const confirmParticipation = window.confirm("Are you sure you want to participate with this team?");
    if (confirmParticipation) {
      try {
        const response = await apiService.participateInContest(id, {
          user_id: currentUser.id,
          fantasy_team_id: selectedTeamId,
          orange_cap_player_id: selectedOrangeCap,
          purple_cap_player_id: selectedPurpleCap,
          player_of_the_tournament_id: selectedPlayerOfTheTournament,
          top_teams: selectedTopTeams,
        });
        setPublished(true);
        // Handle successful participation (e.g., show a success message)
        alert("Successfully participated with the team!");
        // Reload the page
        // window.location.reload();
      } catch (err) {
        setPublished(false);
        setError('Failed to participate in the contest');
      }
    }
  };

  const handleOrangeCapChange = (event) => {
    setSelectedOrangeCap(event.target.value); // Update selected orange cap player
  };

  const handlePurpleCapChange = (event) => {
    setSelectedPurpleCap(event.target.value); // Update selected purple cap player
  };

  const handlePlayerOfTheTournamentChange = (event) => {
    setSelectedPlayerOfTheTournament(event.target.value); // Update selected player of the tournament
  };

  const handleTopTeamsChange = (event) => {
    const value = event.target.value; // Get selected values
    if (value.length > 4) {
      alert("You can only select up to 4 teams."); // Alert the user
      return; // Prevent further action
    }
    setSelectedTopTeams(value); // Update selected top teams
  };

  const disableParticipateButton = !selectedTeamId || !selectedOrangeCap || !selectedPurpleCap || !selectedPlayerOfTheTournament || selectedTopTeams.length !== 4;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!players || players.length === 0) return <div>No players available.</div>;

  const selectedTeam = allTeams.find(team => team.owner.id === currentUser.id);

  return (
    <div className="contest-details">
      <h2 className="contest-title">{contest.name}</h2>
      <p className="contest-passkey"><strong>Passkey:</strong> {contest.passkey}</p>
      <p className="contest-owner"><strong>Owner:</strong> {contest.owner?.name}</p>

      <div className="your-team-section">
        <h3>Your Team</h3>
        {selectedTeam || published ? (
          <div className="team-details">
            <h4>Selected Team: {selectedTeam.name}</h4>
            <p><strong>Credits:</strong> {selectedTeam.credits}</p>
            <h5>Players:</h5>
            <ul>
              {selectedTeam.players.map(player => (
                <li key={player.id}>{player.name} - {player.credits} credits</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="team-selection">
            <button 
              onClick={handleParticipate}
              className="participate-button"
              disabled={disableParticipateButton}
            >
                Participate with these selections
            </button>
            <div className="form-control">
              <InputLabel id="team-select-label">Select a Published Team</InputLabel>
              <Select
                id="team-select"
                value={selectedTeamId}
                onChange={handleTeamChange}
                label="Select a Published Team"
              >
                <MenuItem value=""><em>--Select Team--</em></MenuItem>
                {userTeams.map(team => (
                  <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-control">
              <InputLabel id="orange-cap-select-label">Select Orange Cap Player</InputLabel>
              <Select id="orange-cap-select" value={selectedOrangeCap} onChange={handleOrangeCapChange}>
                <MenuItem value=""><em>--Select Player--</em></MenuItem>
                {players.map(player => (
                  <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-control">
              <InputLabel id="purple-cap-select-label">Select Purple Cap Player</InputLabel>
              <Select id="purple-cap-select" value={selectedPurpleCap} onChange={handlePurpleCapChange}>
                <MenuItem value=""><em>--Select Player--</em></MenuItem>
                {players.map(player => (
                  <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-control">
              <InputLabel id="pot-select-label">Select Player of the Tournament</InputLabel>
              <Select id="pot-select" value={selectedPlayerOfTheTournament} onChange={handlePlayerOfTheTournamentChange}>
                <MenuItem value=""><em>--Select Player--</em></MenuItem>
                {players.map(player => (
                  <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-control">
              <InputLabel id="top-teams-select-label">Select Top 4 IPL Teams</InputLabel>
              <Select
                id="top-teams-select"
                multiple
                value={selectedTopTeams}
                onChange={handleTopTeamsChange}
                renderValue={(selected) => (
                  <div className="selected-top-teams">
                    {selected.map((teamId) => {
                      const team = teams.find(t => t.id === teamId);
                      return team ? (
                        <Chip key={team.id} label={team.name} onDelete={() => setSelectedTopTeams(selectedTopTeams.filter(id => id !== teamId))} />
                      ) : null;
                    })}
                  </div>
                )}
              >
                {teams.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        )}
      </div>

      <h3>Contest Standings</h3>
      <table className="user-teams-table">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Current points</th>
          </tr>
        </thead>
        <tbody>
          {allTeams.sort((a, b) => b.current_score - a.current_score).map(team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.owner.name}</td>
              <td>{team.owner.email}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestDetails; 