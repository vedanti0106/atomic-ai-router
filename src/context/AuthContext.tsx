import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const performAutoLogin = async () => {
    const mockEmail = 'sayali.google@gmail.com';
    const mockPassword = 'GoogleDemoPassword123!';
    const mockName = 'Sayali';
    try {
      // 1. Try to login
      let response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, password: mockPassword }),
        credentials: 'include',
      });
      
      // 2. If login fails, try to register
      if (!response.ok) {
        response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: mockName, email: mockEmail, password: mockPassword }),
          credentials: 'include',
        });
        
        if (response.ok) {
          // Fetch user details again after registering
          const meResponse = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            credentials: 'include',
          });
          if (meResponse.ok) {
            const meData = await meResponse.json();
            setUser(meData.user);
            return;
          }
        }
      } else {
        const data = await response.json();
        setUser(data.user);
        return;
      }
      setUser(null);
    } catch (e) {
      console.error('Auto login failed:', e);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Transmits secure HTTP-only cookies cross-origin
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        await performAutoLogin();
      }
    } catch (err) {
      console.error('Failed to verify session, attempting auto-login:', err);
      await performAutoLogin();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
