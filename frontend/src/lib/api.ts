// API service for authentication and other backend requests

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// API functions
export const api = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    // Check if the response contains an array (Flask sometimes returns [data, status_code])
    if (Array.isArray(data)) {
      if (data[1] !== 200) {
        throw new Error(data[0].error || 'Login failed');
      }
      return data[0]; // Return just the data part
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    // Check if the response contains an array (Flask sometimes returns [data, status_code])
    if (Array.isArray(data)) {
      if (data[1] !== 201) {
        throw new Error(data[0].error || 'Registration failed');
      }
      return data[0]; // Return just the data part
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    // Check if the response contains an array (Flask sometimes returns [data, status_code])
    if (Array.isArray(data)) {
      if (data[1] !== 200) {
        throw new Error(data[0].error || 'Failed to get profile');
      }
      return data[0].user || data[0]; // Return user data
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }
    
    return data.user || data;
  },
};
