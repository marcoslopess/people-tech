/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoginMutation, useCreateFirstUserMutation, useCheckExists, useProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function LoginOrCreate() {
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const { data: usersExist, isLoading: checkingUser } = useCheckExists();
  const { isLoading: checkingProfile } = useProfile();

  const loginMutation = useLoginMutation();
  const createFirstMutation = useCreateFirstUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!checkingProfile && localStorage.getItem("token")) {
      router.push("/home");
    }
  }, [checkingProfile, router]);

  const onSubmit = async (formData: any) => {
    try {
      let res;

      if (usersExist) {
        res = await loginMutation.mutateAsync(formData);
        showMessage("Login realizado com sucesso!", "success");
      } else {
        const userWithFallbackName = {
          ...formData,
          name: formData.name || "Novo Usuário",
        };
        res = await createFirstMutation.mutateAsync(userWithFallbackName);
        showMessage("Usuário criado com sucesso!", "success");
      }

      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);
        router.push("/home");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? "Erro inesperado";

      if (status === 403 || status === 401) {
        showMessage("Credenciais inválidas. Verifique o e-mail e a senha.", "error");
      } else {
        showMessage(message, "error");
      }
    }
  };

  if (checkingUser || checkingProfile) {
    return (
      <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {usersExist ? "Login" : "Criação do primeiro usuário"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {!usersExist && (
            <TextField
              fullWidth
              label="Nome"
              {...register("name", {
                required: "Nome obrigatório",
                minLength: { value: 3, message: "Mínimo 3 letras" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message?.toString()}
            />
          )}

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            {...register("email", {
              required: "E-mail obrigatório",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "E-mail inválido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message?.toString()}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            {...register("password", {
              required: "Senha obrigatória",
              minLength: {
                value: 6,
                message: "A senha deve ter pelo menos 6 caracteres",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message?.toString()}
          />

          <Button type="submit" variant="contained" fullWidth>
            {usersExist ? "Entrar" : "Criar usuário"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
