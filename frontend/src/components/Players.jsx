import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import './Players.css';
import apiService from '../utils/api';

const Players = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await apiService.getPlayers();
        setTeams(data.teams);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleOpenDialog = (team) => {
    setSelectedTeam(team);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeam(null);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="players-container-players">
      <div className="header-players">
        <IconButton 
          className="home-button-players"
          onClick={handleHomeClick}
          size="small"
        >
          <HomeIcon fontSize="medium" />
        </IconButton>
        <h1>IPL Teams</h1>
      </div>
      <div className="teams-grid-players">
        {teams.map((team) => (
          <Paper 
            key={team.id} 
            className="team-badge-players"
            onClick={() => handleOpenDialog(team)}
            elevation={3}
          >
            <Typography className="team-name-players">
              {team.short_name}
            </Typography>
            <Typography className="team-full-name-players">
              {team.name}
            </Typography>
          </Paper>
        ))}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTeam && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {selectedTeam.name} Players
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <div className="players-grid-players">
                {selectedTeam.players.map((player) => (
                  <div key={player.id} className="player-card-players">
                    <h3>{player.name}</h3>
                    <div className="player-details-players">
                      <p>
                        <span className="label-players">Role:</span> 
                        <span className={`role-players ${player.role.toLowerCase()}`}>{player.role}</span>
                      </p>
                      <p>
                        <span className="label-players">Type:</span> 
                        <span className={player.indian ? 'indian-players' : 'overseas-players'}>
                          {player.indian ? 'Indian' : 'Overseas'}
                        </span>
                      </p>
                      <p>
                        <span className="label-players">Credits:</span> 
                        <span className="credits-players">{player.credits}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default Players; 