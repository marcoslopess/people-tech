import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserForm } from "../UserForm";

describe("UserForm", () => {
  it("preenche e envia o formulário", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());

    render(<UserForm onSubmit={mockSubmit} />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const button = screen.getByRole("button", { name: /salvar/i });

    await userEvent.type(nameInput, "Marcos Lopes");
    await userEvent.type(emailInput, "marcos@email.com");
    await userEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith({
      name: "Marcos Lopes",
      email: "marcos@email.com",
    });
  });
});
