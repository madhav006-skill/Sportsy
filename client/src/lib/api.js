import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  withCredentials: true
});

// Turf API functions
export const turfAPI = {
  // Search turfs by query (name or location)
  search: async (query, sportType = null) => {
    try {
      const params = {};
      if (query) params.query = query;
      if (sportType) params.sportType = sportType;
      
      const response = await api.get('/api/turfs', { params });
      return response.data;
    } catch (error) {
      console.error('Search turfs error:', error);
      throw error;
    }
  },

  // Get a specific turf by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/turfs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get turf error:', error);
      throw error;
    }
  },

  // Create a new turf
  create: async (turfData) => {
    try {
      const response = await api.post('/api/turfs', turfData);
      return response.data;
    } catch (error) {
      console.error('Create turf error:', error);
      throw error;
    }
  },

  // Update a turf
  update: async (id, turfData) => {
    try {
      const response = await api.put(`/api/turfs/${id}`, turfData);
      return response.data;
    } catch (error) {
      console.error('Update turf error:', error);
      throw error;
    }
  },

  // Delete a turf
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/turfs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete turf error:', error);
      throw error;
    }
  },

  // Search turfs by location using Google Places API
  searchByLocation: async (location, radius = 5000) => {
    try {
      const response = await api.get('/api/turfs/search-by-location', {
        params: { location, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Search turfs by location error:', error);
      throw error;
    }
  },

  // Get nearby turfs using coordinates
  getNearby: async (lat, lng, radius = 5000) => {
    try {
      const response = await api.get('/api/turfs/search', {
        params: { lat, lng, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Get nearby turfs error:', error);
      throw error;
    }
  },

  // Get turf details from Google Places
  getDetails: async (placeId) => {
    try {
      const response = await api.get(`/api/turfs/details/${placeId}`);
      return response.data;
    } catch (error) {
      console.error('Get turf details error:', error);
      throw error;
    }
  }
};
