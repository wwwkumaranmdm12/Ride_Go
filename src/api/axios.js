import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://ridego-backend-production-c091.up.railway.app'
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true'
  }
});

export default apiClient;