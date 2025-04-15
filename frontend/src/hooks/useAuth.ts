import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Login } from "@/types/Login";
import { User } from "@/types/User";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const useCheckExists = () =>
  useQuery({
    queryKey: ["auth", "exists"],
    queryFn: async () => {
      const { data } = await api.get("/auth/exists");
      return data.exists;
    },
  });

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: Login) => api.post("/auth/login", data).then((res) => res.data),
  });
};

export const useCreateFirstUserMutation = () => {
  return useMutation({
    mutationFn: (data: User) => api.post("/users/first", data).then((res) => res.data),
  });
};

export const useProfile = () => {
  const isClient = typeof window !== "undefined";
  const token = isClient ? localStorage.getItem("token") : null;

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const { data } = await api.get("/auth/profile");
      return data;
    },
    enabled: !!token && isClient,
    retry: false,
  });
};
