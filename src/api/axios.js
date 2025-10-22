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

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

const apiClient2 = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL2}/api`,
});

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload)
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return true;
  }
};

const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo && userInfo.token) {
          // Verificar si el token expiró
          if (isTokenExpired(userInfo.token)) {
            localStorage.removeItem("userInfo");
            window.dispatchEvent(new CustomEvent('token-expired'));
            return Promise.reject({ tokenExpired: true });
          }

          config.headers["Authorization"] = `Bearer ${userInfo.token}`;
        }
      } catch (error) {
        console.error("Error al añadir token:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para respuestas 401
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        window.dispatchEvent(new CustomEvent('token-expired'));
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(apiClient);
addAuthInterceptor(apiClient2);

export { apiClient, apiClient2, isTokenExpired };

// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: `${process.env.REACT_APP_API_URL}/api`,
// });

// const apiClient2 = axios.create({
//   baseURL: `${process.env.REACT_APP_API_URL2}/api`,
// });

// const addAuthInterceptor = (client) => {
//   client.interceptors.request.use(
//     (config) => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         if (userInfo && userInfo.token) {
//           config.headers["Authorization"] = `Bearer ${userInfo.token}`;
//         }
//       } catch (error) {
//         console.error("Error al añadir token:", error);
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };

// addAuthInterceptor(apiClient);
// addAuthInterceptor(apiClient2);

// export { apiClient, apiClient2 };
