import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from "../api/auth";

const API_BASE_URL = window.location.hostname === "matchet-staging.vercel.app" ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");
const USER_CACHE_KEY = "matchet_cache_user_data";
const USER_HINT_KEY = "matchet_cache_user";

function readCachedUser() {
  try {
    const cached = sessionStorage.getItem(USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function cacheUser(account) {
  sessionStorage.setItem(USER_HINT_KEY, account.id || account.email || "account");
  sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(account));
}

function clearCachedUser() {
  sessionStorage.removeItem(USER_HINT_KEY);
  sessionStorage.removeItem(USER_CACHE_KEY);
}

async function getNotificationsFromServer() {
  const response = await fetch(API_BASE_URL + "/api/notifications", { credentials: "include" });
  if (!response.ok) throw new Error("Unable to load notifications.");
  const payload = await response.json();
  return payload.data || [];
}

async function markServerNotificationsRead() {
  await fetch(API_BASE_URL + "/api/notifications/read", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(() => Boolean(sessionStorage.getItem(USER_HINT_KEY)));
  const [notifications, setNotifications] = useState([]);

  const notificationKey = (account) => account ? `matchet_notifications:${account.id || account.email}` : "matchet_notifications:anonymous";
  const loadNotifications = async (account) => {
    try {
      const serverNotifications = await getNotificationsFromServer();
      setNotifications(serverNotifications);
      return;
    } catch {
      try {
        const saved = JSON.parse(localStorage.getItem(notificationKey(account)) || "[]");
        setNotifications(Array.isArray(saved) ? saved : []);
      } catch {
        setNotifications([]);
      }
    }
  };
  const addNotification = (account, notification) => {
    const next = [{ id: `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), read: false, ...notification }, ...(() => { try { return JSON.parse(localStorage.getItem(notificationKey(account)) || "[]"); } catch { return []; } })()].slice(0, 30);
    localStorage.setItem(notificationKey(account), JSON.stringify(next));
    setNotifications(next);
  };
  const markNotificationsRead = () => {
    if (!user) return;
    const next = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(next);
    markServerNotificationsRead().catch(() => {});
    localStorage.setItem(notificationKey(user), JSON.stringify(next));
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
      cacheUser(response.user);
      loadNotifications(response.user);
      return response.user;
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        setNotifications([]);
        clearCachedUser();
        return null;
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem(USER_HINT_KEY)) {
      setLoading(false);
      return;
    }
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    setUser(response.user);
    cacheUser(response.user);
    await loadNotifications(response.user);
    addNotification(response.user, { type: "login", title: "New login", message: "Your Matchet account was just signed in." });
    return response.user;
  }, []);

  const register = useCallback(async (details) => {
    const response = await registerRequest(details);
    setUser(response.user);
    cacheUser(response.user);
    await loadNotifications(response.user);
    addNotification(response.user, { type: "welcome", title: "Welcome to Matchet", message: "Your account is ready. Start exploring products and services." });
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      clearCachedUser();
      Object.keys(sessionStorage).filter((key) => key.startsWith("matchet_provider_cache:")).forEach((key) => sessionStorage.removeItem(key));
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), notifications, login, register, logout, refreshUser, markNotificationsRead }),
    [user, loading, notifications, login, register, logout, refreshUser, markNotificationsRead],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
