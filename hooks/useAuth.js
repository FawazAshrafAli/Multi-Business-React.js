// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext'; // your optimized AuthContext
import auth from '../lib/api/auth';

/**
 * useAuth hook aligned with httpOnly cookie backend
 * @param {boolean} autoCheck - whether to auto-check user on mount
 */
export const useAuthHook = ({ autoCheck = true } = {}) => {
  const { user, setUser, loading: contextLoading, refreshUser: contextRefresh } = useAuth();
  const [loading, setLoading] = useState(autoCheck && contextLoading);

  // Automatically fetch current user on mount
  useEffect(() => {
    if (!autoCheck) return;

    const fetchUser = async () => {
      setLoading(true);
      const currentUser = await contextRefresh();
      setLoading(false);
      return currentUser;
    };

    fetchUser();
  }, [autoCheck, contextRefresh]);

  // Login user via OTP verification
  const loginUser = async (email, otp) => {
    const res = await auth.verifyLoginOtp({ email, otp });
    if (res.data) {
      const currentUser = await contextRefresh(); // update user in context
      return currentUser;
    }
    return null;
  };

  // Refresh current user manually
  const refreshUser = async () => {
    setLoading(true);
    const currentUser = await contextRefresh();
    setLoading(false);
    return currentUser;
  };

  // Logout
  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return { user, loading, loginUser, refreshUser, logout };
};
