// import axios from 'axios';

// const apiClient = axios.create({
//   // El proxy en package.json se encarga del prefijo 'http://localhost:5000'
//   baseURL: `${process.env.REACT_APP_API_URL}/api`,
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       console.log("userInfo", userInfo);
//       if (userInfo && userInfo.token) {
//         config.headers['Authorization'] = `Bearer ${userInfo.token}`;
//       }
//     } catch (error) {
//       console.error("Error al añadir token:", error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios from "axios";

// 🟢 Cliente principal (Render)
const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

// 🟣 Segundo cliente (Cloud Run)
const apiClient2 = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL2}/api`,
});

// 🔐 Interceptor para agregar token a ambos
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
          config.headers["Authorization"] = `Bearer ${userInfo.token}`;
        }
      } catch (error) {
        console.error("Error al añadir token:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

addAuthInterceptor(apiClient);
addAuthInterceptor(apiClient2);

export { apiClient, apiClient2 };
