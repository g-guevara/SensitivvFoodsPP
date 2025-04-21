// services/authService.js
import Config from 'react-native-config';

// Access environment variables
const API_URL = Config.API_URL || 'http://localhost:5008/api';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data or error
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
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
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
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
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Check if user is logged in by validating token
 * @param {string} token - User authentication token
 * @returns {Promise} - Promise with user data or error
 */
export const validateSession = async (token) => {
  try {
    const response = await fetch(`${API_URL}/validate-session`, {
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
 * Logout user by clearing tokens
 */
export const logoutUser = async () => {
  // Any cleanup needed on the client side
};