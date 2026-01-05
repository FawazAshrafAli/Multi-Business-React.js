import apiClient from './axios';

// Helper to detect browser environment
const isBrowser = () => typeof window !== "undefined";

// API Endpoints
const LOGIN_URL = '/auth/token/';
const REFRESH_URL = '/auth/token/refresh/';
const USER_URL = '/auth_api/user/';

// Get tokens from storage
export const getAccessToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem('access');
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem('refresh');
};

// Store tokens
export const setTokens = (access, refresh) => {
  if (!isBrowser()) return;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

};

// Clear tokens
export const clearTokens = () => {
  if (!isBrowser()) return;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
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
  if (!refresh) return null;

  const response = await apiClient.post(REFRESH_URL, { refresh });
  const { access } = response.data;

  if (isBrowser()) localStorage.setItem('access', access);

  return access;
};

// Get current authenticated user
export const checkAuth = async () => {
  if (!isBrowser()) return null;

  const access = getAccessToken();
  if (!access) return null;

  try {
    const response = await apiClient.get(USER_URL, {
      headers: { Authorization: `Bearer ${access}` }
    });
    return response.data;

  } catch (err) {
    clearTokens();
    return null;
  }
};

// Logout user
export const logout = async () => {
  clearTokens();
};

// OTP requests
export const getLoginOtp = async (data, config) => {
  return apiClient.post(`/auth_api/login_otp/`, data, config);
};

export const verifyLoginOtp = async (data, config) => {
  try {
    const response = await apiClient.post("/auth_api/verify_login_otp/", data, config);
    return { data: response.data };
  } catch (err) {
    return { error: err.response?.data || { message: err.message } };
  }
};

// Safer getCurrentUser with token refresh
export const getCurrentUser = async () => {
  if (!isBrowser()) return null;

  let access = getAccessToken();
  if (!access) return null;

  try {
    const res = await apiClient.get(USER_URL, {
      headers: { Authorization: `Bearer ${access}` }
    });
    return res.data;

  } catch (err) {
    const newAccess = await refreshToken();
    if (!newAccess) return null;

    try {
      const res = await apiClient.get(USER_URL, {
        headers: { Authorization: `Bearer ${newAccess}` }
      });
      return res.data;
      
    } catch {
      return null;
    }
  }
};
