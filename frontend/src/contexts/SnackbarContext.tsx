import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarContextProps = {
  showMessage: (message: string, severity?: "success" | "error" | "info" | "warning") => void;
};

const SnackbarContext = createContext<SnackbarContextProps>({ showMessage: () => {} });

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const showMessage = (msg: string, sev: typeof severity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
