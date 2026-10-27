import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types.ts';
import { loginUser, registerUser } from './api.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password?: string; phone?: string; licenseNumber?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // When website opens, users must not be automatically logged in.
  // Only restore from localStorage if a user has explicitly logged in previously.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('rw_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          return parsed;
        }
      }
    } catch {
      localStorage.removeItem('rw_user');
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('rw_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rw_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    const res = await loginUser(email, password);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password?: string; phone?: string; licenseNumber?: string }) => {
    const res = await registerUser(data);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('rw_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout
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
