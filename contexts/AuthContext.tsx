'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  mobile?: string;
  email?: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (mobile: string, password: string) => Promise<void>;
  signup: (name: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            const response = await api.getMe();
            if (response.success && response.data) {
              setUser(response.data);
            }
          } catch (error) {
            console.error('Failed to load user:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (mobile: string, password: string) => {
    try {
      const response = await api.login({ mobile, password });
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.id || response.data._id,
          mobile: response.data.mobile,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as 'admin' | 'user',
          createdAt: response.data.createdAt,
        };
        
        setUser(userData);
        // Also store in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, mobile: string, password: string) => {
    try {
      const response = await api.register({ name, mobile, password });
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.id || response.data._id,
          mobile: response.data.mobile,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as 'admin' | 'user',
          createdAt: response.data.createdAt,
        };
        
        setUser(userData);
        // Also store in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
