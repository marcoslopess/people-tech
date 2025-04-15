import { User } from "@/types/User";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend Nest
});

export const getUsers = () => api.get("/users").then((res) => res.data);
export const getUser = (id: number) => api.get(`/users/${id}`).then((res) => res.data);
export const createUser = (data: User) => api.post("/users", data).then((res) => res.data);
export const updateUser = (id: number, data: User) => api.put(`/users/${id}`, data).then((res) => res.data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then((res) => res.data);
