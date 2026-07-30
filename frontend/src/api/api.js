import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Token ${token}` },
});

export const signupUser = (data) => axios.post(`${API_BASE}/auth/signup/`, data);
export const loginUser = (data) => axios.post(`${API_BASE}/auth/login/`, data);
export const logoutUser = (token) => axios.post(`${API_BASE}/auth/logout/`, {}, getAuthHeaders(token));
export const fetchUser = (token) => axios.get(`${API_BASE}/auth/user/`, getAuthHeaders(token));
export const convertText = (sen, token) => axios.post(`${API_BASE}/convert/`, { sen }, getAuthHeaders(token));
