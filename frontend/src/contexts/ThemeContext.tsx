import { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext<{ toggleColorMode: () => void }>({ toggleColorMode: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        ...(isDark
          ? {
              background: {
                default: "#1A1A1D", // fundo geral
                paper: "#242426", // cards, formulário, drawer
              },
              primary: {
                main: "#00B0FF", // azul neon leve
              },
              secondary: {
                main: "#FF4081", // rosa vibrante
              },
              text: {
                primary: "#EDEDED", // texto branco suave
                secondary: "#A8A8A8",
              },
            }
          : {
              background: {
                default: "#f5f5f5",
                paper: "#fff",
              },
              primary: {
                main: "#1976d2",
              },
              secondary: {
                main: "#9c27b0",
              },
              text: {
                primary: "#212121",
                secondary: "#555",
              },
            }),
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              fontWeight: 500,
              textTransform: "uppercase",
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#2C2C2E" : undefined,
              borderRadius: 4,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: isDark ? "#242426" : "#fff",
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useColorMode = () => useContext(ThemeContext);
