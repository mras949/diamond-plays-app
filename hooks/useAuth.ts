import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStore.getItemAsync('jwtToken');
      setIsAuthenticated(!!token);
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync('jwtToken', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwtToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}