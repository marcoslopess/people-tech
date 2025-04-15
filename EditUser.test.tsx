import { render, screen } from "@testing-library/react";
import EditPage from "./frontend/src/pages/edit/[id]";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import * as api from "@/services/api";
import { useRouter } from "next/router";

// Mocks
jest.mock("@/services/api");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Função auxiliar para renderizar com providers
const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>{component}</SnackbarProvider>
    </QueryClientProvider>
  );
};

describe("EditUser Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: "1" },
      push: jest.fn(),
    });

    jest.spyOn(api, "getUser").mockResolvedValue({
      id: 1,
      name: "Usuário Teste",
      email: "teste@email.com",
    });

    jest.spyOn(api, "updateUser").mockResolvedValue({});
  });

  it("deve preencher os campos com os dados do usuário carregado", async () => {
    renderWithProviders(<EditPage />);

    const nameInput = await screen.findByLabelText(/nome/i);
    const emailInput = await screen.findByLabelText(/e-mail/i);

    expect(nameInput).toHaveValue("Usuário Teste");
    expect(emailInput).toHaveValue("teste@email.com");
  });
});
