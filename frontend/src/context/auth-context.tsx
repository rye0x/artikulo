'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile, LoginCredentials } from '@/lib/api';

// Define types
interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      console.log('Auth check - token exists:', !!token);
      
      if (token) {
        try {
          console.log('Validating token...');
          const response = await getUserProfile(token);
          if (response.user) {
            console.log('Token valid, user authenticated:', response.user.username);
            setUser({
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('auth_token');
        }
      } else {
        console.log('No token found, user not authenticated');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with credentials:', { email: credentials.email, password: '********' });
      
      const response = await loginUser(credentials);
      console.log('Login successful, received token');
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      console.log('Token stored in localStorage');
      
      // Set user data
      setUser({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
      });
      console.log('User data set:', response.user.username);
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await registerUser({ username, email, password });
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      
      // Set user data
      setUser({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);