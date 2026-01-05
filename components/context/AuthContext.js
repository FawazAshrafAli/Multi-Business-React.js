// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import auth from '../../lib/api/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithOtp: async () => {},
  verifyOtp: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children, cookieHeader = '' }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const refreshUser = async () => {
    setLoading(true);
    const currentUser = await auth.getCurrentUser(cookieHeader);
    setUser(currentUser);
    setLoading(false);
    return currentUser;
  };

  // Login with OTP request
  const loginWithOtp = async (email) => {
    const res = await auth.getLoginOtp({ email });
    return res;
  };

  // Verify OTP and login
  const verifyOtp = async (email, otp) => {
    const res = await auth.verifyLoginOtp({ email, otp });
    if (res.data) {
      await refreshUser(); // update user state after login
    }
    return res;
  };

  // Logout
  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  // On mount, fetch current user (client-side)
  useEffect(() => {
    if (!cookieHeader) {
      refreshUser();
    }
  }, []);

  const setUserCartCount = (cart_count) => {
    setUser({...user, cart_count})
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithOtp,
        verifyOtp,
        logout,
        refreshUser,
        setUserCartCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming AuthContext
// export const AuthContext = () => useContext(AuthContext);
export default AuthContext;
