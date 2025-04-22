// components/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { loginUser, registerUser, logoutUser, validateSession } from '../services/authService';
import { STORAGE_KEYS } from '../services/constants';

// Define types
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  userName: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        const storedUserName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
        const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        
        if (storedUserId && token) {
          // Validate the token with the server
          try {
            await validateSession();
            setUserId(storedUserId);
            setUserName(storedUserName);
            setIsAuthenticated(true);
          } catch (error) {
            // Token is invalid, clear storage
            console.log('Session validation failed, clearing auth data');
            await logoutUser();
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await loginUser(email, password);
      
      setUserId(userData.userId);
      setUserName(userData.name);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      Alert.alert('Login Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      const userData = await registerUser({ email, password, name });
      
      setUserId(userData.userId);
      setUserName(userData.name);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      Alert.alert('Registration Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      
      setUserId(null);
      setUserName(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        userName,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);