// services/apiService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from './constants';

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  reactionType: string;
  emoji: string;
}

/**
 * Get all food items or filter by category/reaction type
 * @param {string} category - Optional category filter
 * @param {string} reactionType - Optional reaction type filter
 * @returns {Promise<FoodItem[]>} - Promise with food items data
 */
export const getFoodItems = async (category?: string, reactionType?: string): Promise<FoodItem[]> => {
  try {
    let url = `${API_BASE_URL}/api/food-items`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (reactionType) params.append('reactionType', reactionType);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch food items');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }
};

/**
 * Perform authenticated API calls
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Promise with response data
 */
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in authenticated fetch to ${endpoint}:`, error);
    throw error;
  }
};