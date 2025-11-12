import apiClient from './axios';
import Cookies from 'js-cookie';

// API Endpoints (customize these if different)
const LOGIN_URL = '/auth/token/';
const REFRESH_URL = '/auth/token/refresh/';
const USER_URL = '/auth/user/';

// Get tokens from storage
const getAccessToken = () => localStorage.getItem('access');
const getRefreshToken = () => localStorage.getItem('refresh');

// Store tokens
const setTokens = (access, refresh) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};

// Clear tokens
const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// Login user and save tokens
export const login = async (username, password) => {
  const response = await apiClient.post(LOGIN_URL, { username, password });
  const { access, refresh } = response.data;
  setTokens(access, refresh);
  return access;
};

// Refresh access token using refresh token
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token found');
  const response = await apiClient.post(REFRESH_URL, { refresh });
  const { access } = response.data;
  localStorage.setItem('access', access);
  return access;
};

// Get current authenticated user
export const checkAuth = async () => {
  const access = getAccessToken();
  if (!access) return null;

  try {
    const response = await apiClient.get(USER_URL, {
      headers: {
        Authorization: `Bearer ${access}`
      }
    });
    return response.data;
  } catch (error) {
    // Try refreshing token
    try {
      const newAccess = await refreshToken();
      const response = await apiClient.get(USER_URL, {
        headers: {
          Authorization: `Bearer ${newAccess}`
        }
      });
      return response.data;
    } catch (refreshError) {
      clearTokens();
      return null;
    }
  }
};

// Logout user
export const logout = async () => {
  clearTokens();
  // Optionally: await apiClient.post('/auth/logout/') if your backend supports it
};
