import { useEffect, useState } from "react";
import { checkAuth, logout, getCurrentUser, setTokens } from "../lib/api/auth-old";

const isBrowser = () => typeof window !== "undefined";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isBrowser()) return;

    checkAuth()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 Call this right after OTP login
  const loginUser = async (access, refresh) => {
    if (!isBrowser()) return;

    // 1. Save tokens
    setTokens(access, refresh);

    // 2. Fetch user from backend
    const u = await getCurrentUser();

    // 3. Update state instantly
    setUser(u);

    return u;
  };

  const handleLogout = async () => {
    if (!isBrowser()) return;
    await logout();
    setUser(null);
  };

  const refresh = () => {
    if (!isBrowser()) return;
    return checkAuth().then(setUser);
  };

  return {
    user,
    loading,
    loginUser, 
    logout: handleLogout,
    refreshUser: refresh,
  };
};
