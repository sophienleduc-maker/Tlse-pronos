import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_NATIVE_API_URL || 'http://localhost:5000/api';

export const usePronoStore = create((set) => ({
  pronos: [],
  selectedProno: null,
  isLoading: false,
  error: null,
  filters: {
    sport: null,
    confidence: null,
    minOdds: null,
    maxOdds: null
  },

  getPronos: async (token, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/pronos?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ pronos: response.data.pronos, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch pronos';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  filterPronos: async (token, filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/pronos/filter?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ pronos: response.data.pronos, filters, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Filter failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchPronos: async (token, query) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/pronos/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ pronos: response.data.pronos, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Search failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getPronoById: async (token, pronoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/pronos/${pronoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ selectedProno: response.data.prono, isLoading: false });
      return response.data.prono;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch prono';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  buyProno: async (token, pronoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/pronos/${pronoId}/buy`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Purchase failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  rateProno: async (token, pronoId, rating) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/pronos/${pronoId}/rate`, { rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Rating failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  }
}));
