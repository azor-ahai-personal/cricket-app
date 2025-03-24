import { useSelector } from 'react-redux';
import { selectPlayers } from '../store/playersSlice'; // Import the selector to access teams

// Utility function to get player details by IDs
export const getPlayerDetailsByIds = (playersData ,playerIds) => {
  return playersData.filter(player => playerIds.includes(player.id)); // Filter players based on the provided IDs
}; 