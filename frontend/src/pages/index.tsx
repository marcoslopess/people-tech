/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import api, { login } from "@/services/api";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function LoginOrCreate() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [usersExist, setUsersExist] = useState<boolean | null>(null);
  const { showMessage } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          router.push("/home");
          return;
        } catch {
          localStorage.removeItem("token");
        }
      }

      try {
        const res = await api.get("/auth/exists");
        setUsersExist(res.data.exists);
      } catch {
        setUsersExist(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (usersExist) {
        res = await login(form);
        showMessage("Login realizado com sucesso!", "success");
      } else {
        res = await api.post("/auth/login", form);
        showMessage("Usuário criado com sucesso!", "success");
      }

      localStorage.setItem("token", res.data.access_token);
      router.push("/home");
    } catch (err: any) {
      const message = err?.response?.data?.message?.[0] ?? err?.response?.data?.message ?? "Erro ao autenticar";
      showMessage(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
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
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
            />
          )}
          <TextField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? (usersExist ? "Entrando..." : "Criando usuário...") : usersExist ? "Entrar" : "Criar usuário"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
