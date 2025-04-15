import { render, screen, waitFor } from "@testing-library/react";
import Home from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import * as api from "@/services/api";

jest.mock("@/services/api");

const mockedUsers = [
  { id: 1, name: "João Silva", email: "joao@email.com" },
  { id: 2, name: "Maria Souza", email: "maria@email.com" },
];

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>{component}</SnackbarProvider>
    </QueryClientProvider>
  );
};

describe("Home page", () => {
  beforeEach(() => {
    jest.spyOn(api, "getUsers").mockResolvedValue(mockedUsers);
    jest.spyOn(api, "deleteUser").mockResolvedValue({});
  });

  it("exibe a lista de usuários", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /excluir/i });
    expect(deleteButtons.length).toBe(2);
  });
});
