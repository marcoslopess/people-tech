/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import { UserForm } from "../../components/UserForm";
import { useUser, useUpdateUser } from "@/hooks/useUsers";
import { User } from "@/types/User";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useUser(Number(id));
  const updateUser = useUpdateUser();

  const handleUpdate = async (formData: User) => {
    const { id, createdAt, updatedAt, ...filteredData } = formData;
    await updateUser.mutateAsync({ id: Number(id), data: filteredData });
    router.push("/home");
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        Editar Usuário
      </Typography>
      {!isLoading && data && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ mt: 4 }}>
          <Box width="100%" maxWidth={500}>
            <UserForm onSubmit={handleUpdate} defaultValues={data} isEdit />
          </Box>
        </Box>
      )}
    </Container>
  );
}
