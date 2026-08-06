import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Increase timeout for Render free tier cold starts (up to 60s)
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60 second timeout
});

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Token ${token}` },
});

// ── Server Warmup ──────────────────────────────────────────────────────────
// Render free tier sleeps after 15 min of inactivity.
// Pre-warm the server so actual requests are fast.
let serverWarm = false;
let warmupPromise = null;

export function warmupServer() {
  if (serverWarm) return Promise.resolve();
  if (warmupPromise) return warmupPromise;

  warmupPromise = api.get('/health/', { timeout: 65000 })
    .then(() => { serverWarm = true; })
    .catch(() => { /* server might be waking up, that's ok */ })
    .finally(() => { warmupPromise = null; });

  return warmupPromise;
}

// Auto-warmup when the app loads
warmupServer();

// Reset warm status after 14 minutes of inactivity
let inactivityTimer = null;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => { serverWarm = false; }, 14 * 60 * 1000);
}

// ── API Functions ──────────────────────────────────────────────────────────
export const signupUser = async (data) => {
  resetInactivityTimer();
  await warmupServer();
  return api.post('/auth/signup/', data);
};

export const loginUser = async (data) => {
  resetInactivityTimer();
  await warmupServer();
  return api.post('/auth/login/', data);
};

export const logoutUser = (token) => {
  resetInactivityTimer();
  return api.post('/auth/logout/', {}, getAuthHeaders(token));
};

export const fetchUser = async (token) => {
  resetInactivityTimer();
  return api.get('/auth/user/', getAuthHeaders(token));
};

export const convertText = async (sen, token) => {
  resetInactivityTimer();
  await warmupServer();
  return api.post('/convert/', { sen }, getAuthHeaders(token));
};
