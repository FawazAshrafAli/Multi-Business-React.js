// lib/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // critical for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: attach CSRF token if needed for unsafe methods
apiClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
});

export default apiClient;
