import { API_URL } from '../config/api';

/**
 * API request utility for making HTTP requests to the backend
 */

// Default request headers
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Basic fetch wrapper with error handling
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    
    // Parse the JSON response only if the status is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Try to parse JSON, but handle cases where response might not be JSON
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Response was not JSON:', error);
      return null;
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// API methods
export const api = {
  // GET request
  get: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'GET',
      headers: defaultHeaders,
    });
  },
  
  // POST request
  post: async <T, D>(endpoint: string, data: D): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  put: async <T, D>(endpoint: string, data: D): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
  },
};

export default api; 