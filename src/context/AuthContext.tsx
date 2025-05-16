import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import localStorage from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Define a user credential type to store passwords securely
interface UserCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    // Check if localStorage is available
    if (!localStorage.isAvailable()) {
      console.error('LocalStorage is not available. Authentication will not persist.');
      setLoading(false);
      return;
    }

    // Get user from localStorage
    const storedUser = localStorage.getItem<User | null>('user', null);
    if (storedUser) {
      console.log('Found stored user:', storedUser);
      setUser(storedUser);
    } else {
      console.log('No user found in localStorage');
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email, passwordProvided: !!password });
      
      // Check for registered users
      const registeredUsers = localStorage.getItem<UserCredential[]>('registeredUsers', []);
      const userMatch = registeredUsers.find(
        u => u.email === email && u.password === password
      );

      // First check if it's a registered user
      if (userMatch) {
        // Create user without password for security
        const userWithoutPassword: User = {
          id: userMatch.id,
          name: userMatch.name,
          email: userMatch.email,
          role: userMatch.role
        };
        console.log('Login successful for registered user:', userWithoutPassword);
        
        setUser(userWithoutPassword);
        localStorage.setItem('user', userWithoutPassword);
        return;
      }
      
      // If not a registered user, check demo accounts
      if (email === 'user@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          role: 'user',
        };
        console.log('Login successful for demo user:', mockUser);
        setUser(mockUser);
        localStorage.setItem('user', mockUser);
      } else if (email === 'admin@example.com' && password === 'admin') {
        const mockAdmin: User = {
          id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        };
        console.log('Login successful for demo admin:', mockAdmin);
        setUser(mockAdmin);
        localStorage.setItem('user', mockAdmin);
      } else {
        console.log('Login failed: Invalid credentials');
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Rethrow to allow the Login component to handle it
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Acknowledge that password was provided without logging its value
      console.log('Attempting registration:', { name, email, passwordProvided: !!password });
      
      // Get current registered users
      const registeredUsers = localStorage.getItem<UserCredential[]>('registeredUsers', []);
      
      // Check if email is already used by an existing user
      if (registeredUsers.some(user => user.email === email)) {
        console.log('Registration failed: Email already in use');
        throw new Error('Email already in use');
      }
      
      // Check if email is a demo account
      if (email === 'user@example.com' || email === 'admin@example.com') {
        console.log('Registration failed: Email already in use');
        throw new Error('Email already in use');
      }
      
      // Create new user with a unique ID
      const newUser: UserCredential = {
        id: Date.now().toString(), // Simple ID generation
        name,
        email,
        password,
        role: 'user',
      };
      
      // Save to registered users
      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('registeredUsers', updatedUsers);
      
      // Create user without password for the session
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      console.log('Registration successful:', userWithoutPassword);
      setUser(userWithoutPassword);
      localStorage.setItem('user', userWithoutPassword);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  // Debug current auth state
  useEffect(() => {
    console.log('Auth state updated:', { user, loading, error });
  }, [user, loading, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};