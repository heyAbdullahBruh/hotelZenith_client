import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true, // CRITICAL: Allows cookies (guestId) to persist
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can log errors to a service here later
    console.error("API Call Failed:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;