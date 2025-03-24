import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiService from '../utils/api';
import './Teams.css'; // Add styles for the table

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [teamName, setTeamName] = useState(''); // State for team name
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getTeams(); // Fetch teams owned by the current user
      setTeams(response.fantasy_teams); // Adjust based on your API response structure
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createTeam({ name: teamName }); // Send request to create team
      setIsDialogOpen(false); // Close the dialog
      setTeamName(''); // Reset the form field
      await fetchTeams(); // Refresh the teams list
    } catch (err) {
      setError('Failed to create team');
    }
  };

  const handleRowClick = (teamId) => {
    console.log({teamId});
    navigate(`/teams/${teamId}`); // Navigate to the team details page
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="teams-container">
      <div className="header">
        <button
          className="home-button"
          onClick={() => navigate('/')} // Navigate to the home page
        >
          Home
        </button>
        <h2>My Teams</h2>
        <button
          className="action-button"
          onClick={() => setIsDialogOpen(true)} // Open the dialog
        >
          Create Team
        </button>
      </div>

      {/* Dialog for creating a new team */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Create Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="form-actions">
                <button type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Players</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {teams?.map(team => (
            <tr
              key={team.id}
              className="team-row"
              onClick={() => handleRowClick(team.id)} // Make the row clickable
            >
              <td>{team.name}</td>
              <td>{team.players?.join(', ')}</td>
              <td>{team.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teams; 