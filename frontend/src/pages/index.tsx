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
import { useQuery } from "@tanstack/react-query";
import { getUsers, deleteUser } from "../services/api";
import { useState } from "react";
import { User } from "types/User";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };
  const { showMessage } = useSnackbar();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
      await deleteUser(selectedUserId);
      showMessage("Usuário excluído com sucesso!", "success");
      await refetch();
      handleCloseDialog();
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
            {data?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDialog(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Diálogo de confirmação */}
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
