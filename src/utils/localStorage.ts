/**
 * LocalStorage utility functions with error handling
 */

/**
 * Safely get an item from localStorage with error handling
 */
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage with error handling
 */
export const setLocalStorageItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage with error handling
 */
export const removeLocalStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Check if localStorage is available and working
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('LocalStorage is not available:', error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export default {
  getItem: getLocalStorageItem,
  setItem: setLocalStorageItem,
  removeItem: removeLocalStorageItem,
  isAvailable: isLocalStorageAvailable,
  clear: clearLocalStorage
}; 