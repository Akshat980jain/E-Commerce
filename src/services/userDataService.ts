/**
 * User Data Service
 * 
 * A service for managing user-specific data in localStorage
 */

// Get a storage key specific to a user
export const getUserStorageKey = (userId: string, dataType: string): string => {
  return `user_${userId}_${dataType}`;
};

// Save data to localStorage for a specific user
export const saveUserData = <T>(userId: string, dataType: string, data: T): void => {
  try {
    const key = getUserStorageKey(userId, dataType);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${dataType} data to localStorage:`, error);
  }
};

// Get data from localStorage for a specific user
export const getUserData = <T>(userId: string, dataType: string, defaultValue: T): T => {
  try {
    const key = getUserStorageKey(userId, dataType);
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error getting ${dataType} data from localStorage:`, error);
    return defaultValue;
  }
};

// Clear all data for a user
export const clearUserData = (userId: string): void => {
  try {
    const prefix = `user_${userId}_`;
    const keysToRemove: string[] = [];
    
    // Find all localStorage items for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the items
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Clear specific data type for a user
export const clearUserDataByType = (userId: string, dataType: string): void => {
  try {
    const key = getUserStorageKey(userId, dataType);
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${dataType} data for user:`, error);
  }
}; 