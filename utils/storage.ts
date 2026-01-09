import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Platform-specific storage implementation
class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Web storage error:', error);
        throw error;
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Web storage error:', error);
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Web storage error:', error);
        throw error;
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
}

export const storageService = new StorageService();