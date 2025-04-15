import axios from "axios";
import Router from "next/router";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend Nest
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      Router.push("/");
    }
    return Promise.reject(error);
  }
);

export default api;
