// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// if (!API_BASE_URL) {
//   throw new Error("VITE_API_URL not defined");
// }

// const api = axios.create({
//   baseURL: "https://freelance-hub-o2m8.onrender.com",
//   withCredentials: true
// });

// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error(
//       "API Error:",
//       err.response?.status,
//       err.response?.data || err.message
//     );
//     return Promise.reject(err);
//   }
// );

// export default api;


import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL not defined");
}

const api = axios.create({
  baseURL: API_BASE_URL,   // ✅ USE ENV VAR
  withCredentials: true,   // ✅ REQUIRED for cookies
});

// ❌ REMOVE Authorization header interceptor completely
// Cookies are sent automatically by browser

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "API Error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

export default api;
