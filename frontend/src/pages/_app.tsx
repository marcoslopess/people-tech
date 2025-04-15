import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { SnackbarProvider } from "../contexts/SnackbarContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SnackbarProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
