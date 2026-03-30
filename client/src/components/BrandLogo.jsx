import { Link } from "react-router-dom";

const sizeClassNames = {
  sm: "text-[2.2rem]",
  md: "text-[2.8rem] max-[980px]:text-[2.5rem]",
  lg: "text-[3.2rem]",
};

const LogoText = ({ size = "md", light = false }) => {
  const textClassName = sizeClassNames[size] || sizeClassNames.md;

  return (
    <span
      className={`${textClassName} font-extrabold tracking-[0.04em] ${
        light ? "text-white" : "text-[var(--color-primary)]"
      }`}
    >
      TicketHub
    </span>
  );
};

export const BrandLogo = ({ to, size = "md", light = false, className = "", onClick }) => {
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={`inline-flex items-center ${className}`.trim()}>
        <LogoText size={size} light={light} />
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={`inline-flex items-center ${className}`.trim()}>
      <LogoText size={size} light={light} />
    </div>
  );
};
