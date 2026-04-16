import { NavLink } from "react-router-dom";

export const Footer = () => {
  const year = new Date().getFullYear();
  const containerClassName = "mx-auto w-[min(120rem,calc(100%_-_2.4rem))] sm:w-[min(120rem,calc(100%_-_3.2rem))]";
  const footerLinkClassName = ({ isActive }) =>
    [
      "text-[1.42rem] text-[var(--color-text-secondary)] transition-colors duration-200 sm:text-[1.5rem]",
      isActive
        ? "text-[var(--color-primary)]"
        : "hover:text-[var(--color-primary)]",
    ].join(" ");

  return (
    <footer className="mt-[4rem] border-t border-[rgba(28,28,28,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fff3f5_100%)] sm:mt-[6rem]">
      <div
        className={`${containerClassName} grid gap-[2rem] px-[0.2rem] pt-[2.2rem] pb-[2rem] sm:gap-[2.4rem] sm:pt-[2.6rem] sm:pb-[2.4rem] md:grid-cols-2 xl:grid-cols-[1.8fr_1fr_1fr_1.2fr]`}
      >
        <div className="md:col-span-2 xl:col-span-1">
          <h3 className="mb-[0.9rem] text-[2.2rem] font-bold text-[var(--color-primary)] sm:text-[2.4rem]">
            TicketHub
          </h3>
          <p className="max-w-[40ch] text-[1.42rem] leading-[1.7] text-[var(--color-text-secondary)] sm:text-[1.5rem]">
            Book movies, sports, and events with a smooth and secure flow.
          </p>
        </div>

        <div>
          <h4 className="mb-[0.9rem] text-[1.8rem] font-semibold text-[var(--color-text-primary)] sm:text-[1.9rem]">
            Quick Links
          </h4>
          <ul className="grid gap-[0.8rem]">
            <li>
              <NavLink className={footerLinkClassName} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClassName} to="/events">
                Events
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClassName} to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClassName} to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-[0.9rem] text-[1.8rem] font-semibold text-[var(--color-text-primary)] sm:text-[1.9rem]">
            Account
          </h4>
          <ul className="grid gap-[0.8rem]">
            <li>
              <NavLink className={footerLinkClassName} to="/register">
                Register
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClassName} to="/login">
                Login
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="grid gap-[0.8rem]">
          <h4 className="mb-[0.2rem] text-[1.8rem] font-semibold text-[var(--color-text-primary)] sm:text-[1.9rem]">
            Contact
          </h4>
          <p className="break-words text-[1.42rem] text-[var(--color-text-secondary)] sm:text-[1.5rem]">
            Email: support@tickethub.com
          </p>
          <p className="text-[1.42rem] text-[var(--color-text-secondary)] sm:text-[1.5rem]">
            Phone: +91 6354074492
          </p>
        </div>
      </div>

      <div className="border-t border-[rgba(28,28,28,0.08)] px-[1rem] py-[1.4rem] text-center sm:py-[1.6rem]">
        <p className="text-[1.32rem] text-[var(--color-text-secondary)] sm:text-[1.4rem]">
          Copyright {year} TicketHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
