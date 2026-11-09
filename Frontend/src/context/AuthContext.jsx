import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER, null));
  const [token, setToken] = useState(() => storage.get(STORAGE_KEYS.TOKEN, null));
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = storage.get(STORAGE_KEYS.TOKEN);
      if (storedToken) {
        try {
          const res = await userAPI.getProfile();
          if (res?.data) {
            setUser(res.data);
            storage.set(STORAGE_KEYS.USER, res.data);
          }
        } catch (err) {
          // If profile check fails, remove session
          console.warn('Session verification failed:', err);
          storage.remove(STORAGE_KEYS.TOKEN);
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
          storage.remove(STORAGE_KEYS.USER);
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res?.data) {
      const { token, refreshToken, ...userData } = res.data;
      storage.set(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER, userData);
      setToken(token);
      setUser(userData);
      return res.data;
    }
    throw new Error(res?.message || 'Login gagal');
  };

  const register = async (nama, email, password) => {
    const res = await authAPI.register(nama, email, password);
    if (res?.data) {
      const { token, refreshToken, ...userData } = res.data;
      storage.set(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER, userData);
      setToken(token);
      setUser(userData);
      return res.data;
    }
    throw new Error(res?.message || 'Registrasi gagal');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      storage.remove(STORAGE_KEYS.TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      storage.set(STORAGE_KEYS.USER, updated);
      return updated;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

