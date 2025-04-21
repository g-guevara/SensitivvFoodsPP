import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define types
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  isLoading: boolean;
  login: (userId: string, name: string, token?: string) => Promise<void>;
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
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserName = await AsyncStorage.getItem('userName');
        
        if (storedUserId) {
          setUserId(storedUserId);
          setUserName(storedUserName);
          setIsAuthenticated(true);
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
  const login = async (userId: string, name: string, token?: string) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userName', name);
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      }
      
      setUserId(userId);
      setUserName(name);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', 'There was a problem logging in. Please try again.');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userToken');
      
      setUserId(null);
      setUserName(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);