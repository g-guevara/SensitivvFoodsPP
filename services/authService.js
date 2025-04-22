// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from './constants';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data or error
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, data.name);
    if (data.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, data.token);
    }
    if (data.language) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, data.language);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with user data or error
 */
export const registerUser = async (userData: { email: string, password: string, name?: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, data.name);
    if (data.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, data.token);
    }
    if (data.language) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, data.language);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Check if user is logged in by validating token
 * @returns {Promise} - Promise with user data or error
 */
export const validateSession = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/validate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Session validation failed');
    }
    
    return data;
  } catch (error) {
    console.error('Session validation error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise} - Promise with user profile data or error
 */
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/user-profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Logout user by clearing tokens
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    // Don't remove language preference
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};