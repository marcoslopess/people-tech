import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Painel de Usuários
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit">Listar</Button>
        </Link>
        <Link href="/create" passHref>
          <Button color="inherit">Criar</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
