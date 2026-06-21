import axios from 'axios';

// Vite proxy handles routing '/api' to 'http://localhost:8000'
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    // Hardcoded dev key matching the backend's expected AGENT_API_KEY
    'X-API-Key': 'xflvmsfkljo9gu409t4-VDSPOVJWOR9T74RU2I0EI24T75Y08EOIW4U5T3Q8aJMo', 
  },
});

export default api;
