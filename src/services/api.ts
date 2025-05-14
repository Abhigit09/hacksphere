import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'organizer' | 'mentor';
    skills: string[];
    location: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const eventsAPI = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  
  getEvent: async (id: number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  createEvent: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  updateEvent: async (id: number, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  deleteEvent: async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default api; 