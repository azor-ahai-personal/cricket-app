import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiService from '../utils/api';
import './Teams.css'; // Add styles for the table

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getTeams(); // Fetch teams owned by the current user
      setTeams(response.teams); // Adjust based on your API response structure
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
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
      </div>

      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Players</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id} className="team-row">
              <td>{team.name}</td>
              <td>{team.players.join(', ')}</td>
              <td>{team.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teams; 