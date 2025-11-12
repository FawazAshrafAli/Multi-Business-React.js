import { useEffect, useState } from "react";
import { checkAuth, logout } from "../lib/api/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then(setUser).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, logout: handleLogout, refresh: () => checkAuth().then(setUser) };
};
