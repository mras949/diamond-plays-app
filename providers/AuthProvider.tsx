import * as SecureStore from 'expo-secure-store';
import React, { useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const loading = !hasChecked;

  // Handle auth state
  const login = React.useCallback(async (token: string) => {
    try {
      await SecureStore.setItemAsync('jwtToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('jwtToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (!mounted) return;
      
      try {
        const token = await SecureStore.getItemAsync('jwtToken');
        if (mounted) {
          setIsAuthenticated(!!token);
          setHasChecked(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setHasChecked(true);
        }
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, []);

  // Create stable context value
  const contextValue = React.useMemo(() => ({
    isAuthenticated: !!isAuthenticated,
    loading,
    login,
    logout
  }), [isAuthenticated, loading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}