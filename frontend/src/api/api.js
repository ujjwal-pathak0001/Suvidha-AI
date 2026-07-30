import axios from 'axios';

// In production, set VITE_API_URL to your Railway backend URL
// In development, defaults to local Django server
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Token ${token}` },
});

export const signupUser  = (data)         => axios.post(`${API_BASE}/auth/signup/`, data);
export const loginUser   = (data)         => axios.post(`${API_BASE}/auth/login/`, data);
export const logoutUser  = (token)        => axios.post(`${API_BASE}/auth/logout/`, {}, getAuthHeaders(token));
export const fetchUser   = (token)        => axios.get(`${API_BASE}/auth/user/`, getAuthHeaders(token));
export const convertText = (sen, token)   => axios.post(`${API_BASE}/convert/`, { sen }, getAuthHeaders(token));
