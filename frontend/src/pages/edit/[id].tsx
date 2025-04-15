import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getUser, updateUser } from "../../services/api";
import { Box, Container, Typography } from "@mui/material";
import { UserForm } from "../../components/UserForm";
import { User } from "@/types/User";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(Number(id)),
    enabled: !!id,
  });

  const handleUpdate = async (formData: User) => {
    await updateUser(Number(id), formData);
    router.push("/");
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        Editar Usuário
      </Typography>
      {!isLoading && data && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ mt: 4 }}>
          <Box width="100%" maxWidth={500}>
            <UserForm onSubmit={handleUpdate} defaultValues={data} />
          </Box>
        </Box>
      )}
    </Container>
  );
}
