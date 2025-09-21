import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      throw new Error('A contact with this email already exists');
    } else if (error.response?.status === 404) {
      throw new Error('Contact not found');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    if (error.response?.data?.details) {
      throw new Error(error.response.data.details.join(', '));
    }
    
    throw new Error(error.response?.data?.error || 'An unexpected error occurred');
  }
);

export const contactsAPI = {
  getContacts: async (page = 1, limit = 10) => {
    const response = await api.get('/contacts', {
      params: { page, limit }
    });
    return response.data;
  },

  addContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  deleteContact: async (contactId) => {
    await api.delete(`/contacts/${contactId}`);
    return contactId;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;