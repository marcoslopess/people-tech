import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/User";
import api from "@/services/api";

// GET /users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
};

// GET /users/:id
export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// POST /users
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) => api.post("/users", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// PUT /users/:id
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: User }) => api.put(`/users/${id}`, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// DELETE /users/:id
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
