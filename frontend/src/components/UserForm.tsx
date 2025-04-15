/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../contexts/SnackbarContext";

type FormProps = {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
  };
  isEdit?: boolean;
};

export function UserForm({ onSubmit, defaultValues, isEdit = false }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues ?? { name: "", email: "", password: "" },
  });

  const { showMessage } = useSnackbar();

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    showMessage(isEdit ? "Usuário atualizado!" : "Usuário criado!", "success");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Nome"
        {...register("name", { required: "Nome obrigatório" })}
        error={!!errors.name}
        helperText={errors.name?.message?.toString()}
        sx={{ mb: 2 }}
      />
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
        sx={{ mb: 2 }}
      />

      {/* Campo de senha só aparece na criação */}
      {!isEdit && (
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
          sx={{ mb: 2 }}
        />
      )}

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : isEdit ? "Atualizar" : "Criar"}
      </Button>
    </Box>
  );
}
