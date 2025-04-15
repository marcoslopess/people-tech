/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useEffect } from "react"; // 👈 adicionado

type FormProps = {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: {
    name: string;
    email: string;
  };
};

export function UserForm({ onSubmit, defaultValues }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        email: defaultValues.email,
      });
    }
  }, [defaultValues, reset]);

  const { showMessage } = useSnackbar();

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    showMessage("Usuário salvo com sucesso!", "success");
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
        {...register("email", {
          required: "E-mail obrigatório",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "E-mail inválido",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message?.toString()}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </Box>
  );
}
