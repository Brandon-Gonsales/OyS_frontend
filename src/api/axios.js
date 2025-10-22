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
  // 1. Verificar si el token existe
  if (!token) return true;

  try {
    // 2. Decodificar el payload (la segunda parte)
    // El formato de un JWT es header.payload.signature
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return true; // Token mal formado

    // atob() decodifica de Base64. JSON.parse() convierte el string a objeto.
    const payload = JSON.parse(atob(encodedPayload));

    // 3. Obtener el tiempo de expiración
    // 'exp' está en SEGUNDOS de Unix time (epoch).
    if (!payload.exp) return true; // No tiene tiempo de expiración

    // Multiplicamos por 1000 para convertir de segundos a milisegundos
    const expirationTime = payload.exp * 1000;

    // 4. Comparar con el tiempo actual
    // Date.now() devuelve el tiempo actual en MILISEGUNDOS.
    const now = Date.now();

    // Si el tiempo actual (now) es MAYOR o IGUAL que el tiempo de expiración, el token ha expirado.
    return now >= expirationTime;

  } catch (error) {
    // Esto captura errores de decodificación (token no es Base64, JSON no válido, etc.)
    console.error("Error al decodificar o parsear el token:", error);
    return true; // Si hay un error, se considera inválido o expirado por seguridad
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
