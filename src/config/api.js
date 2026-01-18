
// // const api = axios.create({
// //   baseURL: API_BASE_URL,
// // });
// import axios from "axios";

// // Use Render backend URL in production, localhost in development
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// // 🔥 Automatically attach token from session storage
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle response errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.status, error.response?.data);
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("❌ VITE_API_URL not defined");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
