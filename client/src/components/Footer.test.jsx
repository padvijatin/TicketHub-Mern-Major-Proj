import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "./Footer.jsx";

describe("Footer", () => {
  it("renders brand and section headings", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("TicketHub")).toBeInTheDocument();
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
  });
});

