import axios from 'axios';
import { getToken } from '../utils/tokenStorage.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const httpClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
