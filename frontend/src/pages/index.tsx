/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { useLoginMutation, useCreateFirstUserMutation, useCheckExists, useProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function LoginOrCreate() {
  const [form, setForm] = useState<any>({ name: "", email: "", password: "" });
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const { data: usersExist, isLoading: checkingUser } = useCheckExists();
  const { isLoading: checkingProfile } = useProfile();

  const loginMutation = useLoginMutation();
  const createFirstMutation = useCreateFirstUserMutation();

  useEffect(() => {
    if (!checkingProfile && localStorage.getItem("token")) {
      router.push("/home");
    }
  }, [checkingProfile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (usersExist) {
        res = await loginMutation.mutateAsync(form);
        showMessage("Login realizado com sucesso!", "success");
      } else {
        res = await createFirstMutation.mutateAsync(form);
        showMessage("Usuário criado com sucesso!", "success");
      }

      localStorage.setItem("token", res.access_token);
      router.push("/home");
    } catch (err: any) {
      const message = err?.response?.data?.message?.[0] ?? err?.response?.data?.message ?? "Erro ao autenticar";
      showMessage(message, "error");
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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!usersExist && (
            <TextField
              label="Nome"
              value={form.name}
              onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
              fullWidth
              required
            />
          )}
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f: any) => ({ ...f, email: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f: any) => ({ ...f, password: e.target.value }))}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            {usersExist ? "Entrar" : "Criar usuário"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
