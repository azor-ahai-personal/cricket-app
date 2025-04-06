import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../utils/api';
import './ContestDetails.css'; // Import the CSS file
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlayers } from '../store/playersSlice';
import { Select, MenuItem, Chip, InputLabel, FormControl, Card, CardContent, Typography, Grid } from '@mui/material';

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
        alert("Successfully participated with the team!");
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
  const orangeCapPlayer = players.find(player => player.id === selectedTeam?.orange_cap_player_id);
  const purpleCapPlayer = players.find(player => player.id === selectedTeam?.purple_cap_player_id);
  const playerOfTheTournament = players.find(player => player.id === selectedTeam?.player_of_the_tournament_id);
  const captain = players.find(player => player.id === selectedTeam?.captain_id);
  const viceCaptain = players.find(player => player.id === selectedTeam?.vice_captain_id);
  const topTeams = teams.filter(team => selectedTeam?.top_teams.includes(team.id));

  const getRoleString = (role) => {
    if (role === 'BATTER') return 'Batsman';
    if (role === 'BOWLER') return 'Bowler';
    if (role === 'ALLROUNDER') return 'All-Rounder';
    return role;
  }

  return (
    <div className="contest-details">
      <h2 className="contest-title">{contest.name}</h2>
      <p className="contest-passkey"><strong>Passkey:</strong> {contest.passkey}</p>
      <p className="contest-owner"><strong>Owner:</strong> {contest.contest_owner?.name}</p>

      {(selectedTeam || published) && (
        <>
          <h3>Contest Standings</h3>
          <table className="user-teams-table">
            <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Current Points</th>
          </tr>
        </thead>
        <tbody>
          {allTeams.sort((a, b) => b.current_score - a.current_score).map((team, index) => (
            <tr key={team.id} style={{ backgroundColor: team.id === selectedTeam?.id ? 'lightblue' : 'transparent' }}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.owner.name}</td>
              <td>{team.owner.email}</td>
              <td>{team.points}</td>
            </tr>
          ))}
          </tbody>
        </table>
        </>
      )}

      <div className="your-team-section">
        <h3>Your Participation</h3>
        {selectedTeam || published ? (
          <div className="team-details">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    {selectedTeam ? (
                      <div>
                        <Typography variant="h6">{selectedTeam.name} </Typography>
                        <table className="players-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Role</th>
                              <th>Nationality</th>
                              <th>Credits</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTeam.players.map(player => (
                              <tr key={player.id}>
                                <td>
                                  {player.name} 
                                  {player.id === captain?.id && <span className="captain-tag"> (Captain)</span>}
                                  {player.id === viceCaptain?.id && <span className="vice-captain-tag"> (Vice Captain)</span>}
                                </td>
                                <td>{getRoleString(player.role)}</td>
                                <td>{player.indian ? 'Indian' : 'Overseas'}</td>
                                <td>{player.credits}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <Typography>No team selected.</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <table className="selections-table">
                      <tbody>
                        <tr>
                          <td><strong>Orange Cap Player</strong></td>
                          <td>{orangeCapPlayer ? orangeCapPlayer.name : 'None'}</td>
                          <td>{orangeCapPlayer ? orangeCapPlayer.team_short_name : 'None'}</td>
                          <td>{orangeCapPlayer ? getRoleString(orangeCapPlayer.role) : 'None'}</td>
                        </tr>
                        <tr>
                          <td><strong>Purple Cap Player</strong></td>
                          <td>{purpleCapPlayer ? purpleCapPlayer.name : 'None'}</td>
                          <td>{purpleCapPlayer ? purpleCapPlayer.team_short_name : 'None'}</td>
                          <td>{purpleCapPlayer ? getRoleString(purpleCapPlayer.role) : 'None'}</td>
                        </tr>
                        <tr>
                          <td><strong>Player of the Tournament</strong></td>
                          <td>{playerOfTheTournament ? playerOfTheTournament.name : 'None'}</td>
                          <td>{playerOfTheTournament ? playerOfTheTournament.team_short_name : 'None'}</td>
                          <td>{playerOfTheTournament ? getRoleString(playerOfTheTournament.role) : 'None'}</td>
                        </tr>
                        <tr>
                          <td><strong>Top Teams</strong></td>
                          <td>{topTeams.length > 0 ? topTeams.map(team => team.short_name).join(', ') : 'None'}</td>
                          <td> </td>
                          <td> </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
    </div>
  );
};

export default ContestDetails; 