import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const apiService = {
  // Auth endpoints
  signup: (data) => api.post('/signup', data),
  login: (data) => api.post('/login', data),

  getBootstrapData: (data) => api.get('/bootstraps/additional_bootstrapped', data),

  logout: () => api.delete('/logout'),

  // Players endpoints
  getPlayers: () => api.get('/players'),

  // Contests endpoints
  getContests: (data) => api.get('/contests', data),
  getContest: (id) => api.get(`/contests/${id}`),
  createContest: (data) => api.post('/contests', data),
  updateContest: (id, data) => api.put(`/contests/${id}`, data),
  joinContest: (data) => api.put('/contests/join', data),
  participateInContest: (id, data) => api.put(`/contests/${id}/participate`, data),

  // Teams endpoints
  createTeam: (data) => api.post('/fantasy_teams', data),
  getTeams: (data) => api.get('/fantasy_teams', {params: data}),
  getTeam: (id) => api.get(`/fantasy_teams/${id}`),
  updateTeam: (id, data) => api.put(`/fantasy_teams/${id}`, data),
  publishTeam: (id) => api.put(`/fantasy_teams/${id}/publish`),
};

// Error handler
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error?.response?.data || error);
  }
);

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService; 