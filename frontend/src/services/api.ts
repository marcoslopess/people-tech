import { Login } from "@/types/Login";
import { User } from "@/types/User";
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

export const login = (data: Login) => api.post("/auth/login", data);

export const createUserFirst = (data: User) => api.post("/users/first", data).then((res) => res.data);
export const getUsers = () => api.get("/users").then((res) => res.data);
export const getUser = (id: number) => api.get(`/users/${id}`).then((res) => res.data);
export const createUser = (data: User) => api.post("/users", data).then((res) => res.data);
export const updateUser = (id: number, data: User) => api.put(`/users/${id}`, data).then((res) => res.data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then((res) => res.data);

export default api;
