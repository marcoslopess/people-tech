import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { UserForm } from "../components/UserForm";
import { useCreateUser } from "@/hooks/useUsers";
import { useProfile } from "@/hooks/useAuth";
import { User } from "@/types/User";

export default function CreateUser() {
  const router = useRouter();
  const createUser = useCreateUser();
  const { data: profile, isLoading, isError } = useProfile();

  const handleCreate = async (data: User) => {
    await createUser.mutateAsync(data);
    router.push("/home");
  };

  // 🔒 Enquanto carrega, mostra spinner
  if (isLoading) {
    return (
      <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // 🔒 Se der erro (sem token ou inválido), redireciona
  if (isError || !profile) {
    router.push("/");
    return null;
  }

  // ✅ Autenticado, renderiza
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        Criar Usuário
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ mt: 4 }}>
        <Box width="100%" maxWidth={500}>
          <UserForm onSubmit={handleCreate} isEdit={false} />
        </Box>
      </Box>
    </Container>
  );
}
