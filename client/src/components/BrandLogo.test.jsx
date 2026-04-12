import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BrandLogo } from "./BrandLogo.jsx";

describe("BrandLogo", () => {
  it("renders the TicketHub text", () => {
    render(
      <MemoryRouter>
        <BrandLogo />
      </MemoryRouter>
    );

    expect(screen.getByText("TicketHub")).toBeInTheDocument();
  });

  it("renders a navigation link when a target route is provided", () => {
    render(
      <MemoryRouter>
        <BrandLogo to="/" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "TicketHub" })).toHaveAttribute("href", "/");
  });
});
