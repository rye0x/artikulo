'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, LoginCredentials, RegisterCredentials } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const userData = await api.getProfile(token);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    localStorage.setItem('access_token', response.access_token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await api.register(credentials);
    localStorage.setItem('access_token', response.access_token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
