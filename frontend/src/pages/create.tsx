import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { UserForm } from "../components/UserForm";
import { createUser } from "../services/api";
import { User } from "@/types/User";

export default function CreateUser() {
  const router = useRouter();

  const handleCreate = async (data: User) => {
    await createUser(data);
    router.push("/");
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        Criar Usuário
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ mt: 4 }}>
        <Box width="100%" maxWidth={500}>
          <UserForm onSubmit={handleCreate} />
        </Box>
      </Box>
    </Container>
  );
}
