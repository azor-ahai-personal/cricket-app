import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../utils/api';

// Async thunk to fetch players
export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async () => {
  const response = await apiService.getPlayers(); // Adjust the API call as needed
  return response.teams; // Return the teams array from the response
});

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload; // Store teams in the state
        state.players = action.payload.flatMap(team => team.players); // Flatten players into the state
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store error message
      });
  },
});

export const selectPlayers = (state) => state.players.players;

export default playersSlice.reducer;
