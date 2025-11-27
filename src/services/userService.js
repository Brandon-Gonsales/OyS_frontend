import axios from 'axios';

// Mock data for development
let mockUsers = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: 'password123' },
  { id: 2, name: 'María García', email: 'maria@example.com', password: 'password123' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', password: 'password123' },
];

const API_URL = 'http://localhost:3001/api/users'; // Placeholder URL

const userService = {
  getUsers: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockUsers }), 500);
    });
    // return axios.get(API_URL);
  },

  createUser: async (userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      const newUser = { ...userData, id: Date.now() };
      mockUsers = [...mockUsers, newUser];
      setTimeout(() => resolve({ data: newUser }), 500);
    });
    // return axios.post(API_URL, userData);
  },

  updateUser: async (id, userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      mockUsers = mockUsers.map(user => user.id === id ? { ...user, ...userData } : user);
      setTimeout(() => resolve({ data: { id, ...userData } }), 500);
    });
    // return axios.put(`${API_URL}/${id}`, userData);
  },

  deleteUser: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      mockUsers = mockUsers.filter(user => user.id !== id);
      setTimeout(() => resolve({ data: { success: true } }), 500);
    });
    // return axios.delete(`${API_URL}/${id}`);
  }
};

export default userService;
