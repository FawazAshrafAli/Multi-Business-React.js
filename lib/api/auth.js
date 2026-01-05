// lib/auth.js
import Cookies from 'js-cookie';
import apiClient from './axios';

const USER_URL = '/auth_api/user/';
const LOGIN_OTP_URL = '/auth_api/login_otp/';
const VERIFY_OTP_URL = '/auth_api/verify_login_otp/';
const REFRESH_URL = '/auth_api/refresh/';

export default {
  // Request OTP
  async getLoginOtp(data) {
    try {
            const res = await apiClient.post(LOGIN_OTP_URL, data);
            return ({ data: res.data });
        } catch (err) {
            return ({ error: err.response?.data || { message: err.message } });
        }
  },

  // Verify OTP and login
  async verifyLoginOtp(data) {
    try {
          const res = await apiClient.post(VERIFY_OTP_URL, data);
          return ({ data: res.data });
      } catch (err) {
          return ({ error: err.response?.data || { message: err.message } });
      }
  },

  // Logout
  async logout() {
    try {
          return await apiClient.post('/auth_api/logout/', {});
      } catch (err) {
          return console.log('Logout failed', err);
      }
  },

  // Get current user (SSR compatible with optional cookieHeader)
    async getCurrentUser(cookieHeader = '') {
        const config = { withCredentials: true };

        if (cookieHeader) config.headers = { cookie: cookieHeader };

        try {
            // 1. Try to fetch user
            const res = await apiClient.get(USER_URL, config);
            return res.data;

        } catch (err) {
            // If unauthorized, try refresh ONCE
            if (err.response && err.response.status === 401) {

                try {
                    await apiClient.post(REFRESH_URL, {}, config);

                    // retry user once
                    const res2 = await apiClient.get(USER_URL, config);
                    return res2.data;

                } catch (refreshErr) {
                    // 🔥 STOP HERE — DO NOT LOOP
                    return null;
                }
            }

            return null; // other errors
        }
    },


    async handleLogout() {
        await auth.logout();

        // optional: clear local auth state
        setUser(null);

        // redirect
        router.push("/login");
    }

};
