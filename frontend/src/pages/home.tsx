/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useState } from "react";
import { User } from "types/User";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";

export default function Home() {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const { data: users, isLoading, refetch } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
      try {
        await deleteUserMutation.mutateAsync(selectedUserId);
        showMessage("Usuário excluído com sucesso!", "success");
        await refetch();
      } catch (error) {
        showMessage("Erro ao excluir usuário", "error");
      } finally {
        handleCloseDialog();
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        Lista de Usuários
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user.id!)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" aria-label="Excluir" onClick={() => handleOpenDialog(user.id!)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
