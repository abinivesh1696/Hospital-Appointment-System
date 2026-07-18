import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token if exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Redirect or handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (token expired or invalid), clear token and redirect
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optional: force window refresh or handle inside React state
    }
    return Promise.reject(error);
  }
);

export default api;