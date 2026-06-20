import axios from 'axios';

// Vite proxy handles routing '/api' to 'http://localhost:8000'
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    // Hardcoded dev key matching the backend's expected AGENT_API_KEY
    'X-API-Key': 'dev-secret-key', 
  },
});

export default api;
