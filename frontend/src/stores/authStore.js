import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = process.env.REACT_NATIVE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),

  register: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);

      set({ token, user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);

      set({ token, user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  getMe: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ user: response.data.user, token, isAuthenticated: true });
      return response.data.user;
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      set({ user: null, token: null, isAuthenticated: false });
      return null;
    }
  }
}));
