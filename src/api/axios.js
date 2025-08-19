import axios from 'axios';

const apiClient = axios.create({
  // El proxy en package.json se encarga del prefijo 'http://localhost:5000'
   baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.token) {
        config.headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error("Error al añadir token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;