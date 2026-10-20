import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import type { UserDto } from '../types';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isManager: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT to get roles without external library
function decodeToken(token: string): { roles?: string; exp?: number } {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return {};
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch {
      // If profile fails, use stored user
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;
      if (!isExpired) {
        setToken(storedToken);
        loadUser().finally(() => setIsLoading(false));
      } else {
        // Try refresh
        authApi.refresh()
          .then((resp) => {
            localStorage.setItem('accessToken', resp.accessToken);
            setToken(resp.accessToken);
            return loadUser();
          })
          .catch(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const accessToken = response.accessToken;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    await loadUser();
  };

  const signup = async (name: string, email: string, password: string) => {
    await authApi.signup({ name, email, password });
    // Auto-login after signup
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (token) await loadUser();
  };

  const isManager = (() => {
    if (!token) return false;
    const decoded = decodeToken(token);
    return decoded.roles?.includes('HOTEL_MANAGER') ?? false;
  })();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isManager,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
