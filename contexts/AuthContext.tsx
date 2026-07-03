'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { API_BASE_URL } from '@/components/config/api';

interface User {
  id: string;
  mobile?: string;
  email?: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

interface ExtendedUserData {
  id: string;
  name: string;
  mobile: string;
  role: string;
  email?: string;
  createdAt?: string;
}

interface AuthFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (mobile: string, password: string) => Promise<void>;
  signup: (name: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  authFetch: (endpoint: string, options?: AuthFetchOptions) => Promise<Response>;
  verifyUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * authFetch - A wrapper function for fetch that automatically includes authentication headers
   * @param endpoint - The API endpoint (e.g., '/products', '/cart', etc.)
   * @param options - Fetch options (method, body, headers, etc.)
   * @returns Promise with the fetch response
   * 
   * Usage example:
   * const response = await authFetch('/cart', { method: 'GET' });
   * const response = await authFetch('/cart', { method: 'POST', body: JSON.stringify(data) });
   */
  const authFetch = useCallback(async (endpoint: string, options: AuthFetchOptions = {}) => {
    const { skipAuth = false, headers = {}, ...restOptions } = options;
    
    // Ensure endpoint starts with /
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${formattedEndpoint}`;
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };
    
    // Add authorization header if not skipped
    if (!skipAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        credentials: 'include',
      });
      
      // Handle 401 Unauthorized - clear token and user state
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      
      return response;
    } catch (error) {
      console.error('authFetch error:', error);
      throw error;
    }
  }, []);

  /**
   * verifyUser - Verify and get the current user from backend
   * @returns Promise with user data or null if not authenticated
   * 
   * Usage example:
   * const currentUser = await verifyUser();
   * if (currentUser) {
   *   console.log('User is authenticated:', currentUser.name);
   * }
   */
  const verifyUser = useCallback(async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return null;
      }

      const response = await api.getMe();
      
      if (response.success && response.data) {
        const apiData = response.data as ExtendedUserData;
        const userData: User = {
          id: apiData.id,
          mobile: apiData.mobile,
          email: apiData.email,
          name: apiData.name,
          role: apiData.role as 'admin' | 'user',
          createdAt: apiData.createdAt,
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('User verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, []);

  // Load user from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window !== 'undefined') {
        await verifyUser();
      }
      setLoading(false);
    };

    loadUser();
  }, [verifyUser]);

  const login = async (mobile: string, password: string) => {
    try {
      const response = await api.login({ mobile, password });
      
      if (response.success && response.data) {
        const apiData = response.data as ExtendedUserData;
        const userData: User = {
          id: apiData.id,
          mobile: apiData.mobile,
          email: apiData.email,
          name: apiData.name,
          role: apiData.role as 'admin' | 'user',
          createdAt: apiData.createdAt,
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
        const apiData = response.data as ExtendedUserData;
        const userData: User = {
          id: apiData.id,
          mobile: apiData.mobile,
          email: apiData.email,
          name: apiData.name,
          role: apiData.role as 'admin' | 'user',
          createdAt: apiData.createdAt,
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
    authFetch,
    verifyUser,
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
