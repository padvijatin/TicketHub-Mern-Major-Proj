import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context.jsx";
import { getApiErrorMessage } from "../utils/apiError.js";
import {
  getValidatedFieldClassName,
  hasValidationErrors,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from "../utils/formValidation.js";

const initialState = {
  username: "",
  email: "",
  phone: "",
  password: "",
};

const initialTouchedState = {
  username: false,
  email: false,
  phone: false,
  password: false,
};

const initialErrorState = {
  username: "",
  email: "",
  phone: "",
  password: "",
};

const validateRegisterState = (user) => ({
  username: validateUsername(user.username),
  email: validateEmail(user.email),
  phone: validatePhone(user.phone, { required: true }),
  password: validatePassword(user.password),
});

export const Register = () => {
  const [user, setUser] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState(initialErrorState);
  const [touchedFields, setTouchedFields] = useState(initialTouchedState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skipAlreadyLoggedInToastRef = useRef(false);
  const location = useLocation();
  const { isLoading, isLoggedIn, registerUser } = useAuth();
  const navigate = useNavigate();
  const authNotice = typeof location.state?.authNotice === "string" ? location.state.authNotice : "";
  const authNoticeTone = location.state?.authNoticeTone === "warning" ? "warning" : "info";
  const pageClassName =
    "min-h-[calc(100vh-15rem)] bg-[radial-gradient(circle_at_top_left,_rgba(248,68,100,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(123,63,228,0.14),_transparent_26%),linear-gradient(180deg,_#fff8fa_0%,_#f5f5f5_100%)] py-[5.6rem] max-[640px]:py-[3.2rem]";
  const containerClassName =
    "mx-auto grid w-[min(120rem,calc(100%_-_3.2rem))] place-items-center";
  const cardClassName =
    "w-full max-w-[56rem] rounded-[2.4rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.94)] p-[3.2rem] shadow-[0_24px_60px_rgba(28,28,28,0.12)] max-[640px]:rounded-[2rem] max-[640px]:px-[2rem] max-[640px]:py-[2.4rem]";
  const eyebrowClassName =
    "inline-flex items-center rounded-full bg-[rgba(248,68,100,0.1)] px-[1.2rem] py-[0.7rem] text-[1.3rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]";
  const inputClassName =
    "w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.14)] bg-white px-[1.4rem] py-[1.35rem] text-[1.5rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.65)] focus:shadow-[0_0_0_0.4rem_rgba(248,68,100,0.12)] focus:-translate-y-px";
  const submitClassName =
    "mt-[0.4rem] w-full rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] py-[1.35rem] text-[1.6rem] font-extrabold text-[var(--color-text-light)] transition-[transform,box-shadow,background] duration-200 hover:bg-[var(--color-primary-hover)] enabled:hover:-translate-y-px enabled:hover:shadow-[0_16px_28px_rgba(248,68,100,0.22)] disabled:cursor-wait disabled:opacity-80";

  useEffect(() => {
    if (isLoading || !isLoggedIn) {
      return;
    }

    if (skipAlreadyLoggedInToastRef.current) {
      skipAlreadyLoggedInToastRef.current = false;
      return;
    }

    toast.info("You are already logged in.");
    navigate("/", { replace: true });
  }, [isLoading, isLoggedIn, navigate]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    const nextState = { ...user, [name]: value };
    setUser(nextState);

    if (touchedFields[name]) {
      setFieldErrors(validateRegisterState(nextState));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouchedFields((current) => ({ ...current, [name]: true }));
    setFieldErrors(validateRegisterState(user));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegisterState(user);

    setTouchedFields({
      username: true,
      email: true,
      phone: true,
      password: true,
    });
    setFieldErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        username: user.username.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.trim(),
        password: user.password,
      });
      skipAlreadyLoggedInToastRef.current = true;
      toast.success(response.message || "Registration successful");
      setUser(initialState);
      setFieldErrors(initialErrorState);
      setTouchedFields(initialTouchedState);
      navigate("/");
    } catch (error) {
      const message = getApiErrorMessage(error, {
        fallbackMessage: "Registration failed",
        statusMessages: {
          409: "An account with this email already exists. Please log in instead.",
          429: "Too many registration attempts. Please wait a few minutes and try again.",
        },
      });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={pageClassName}>
      <div className={containerClassName}>
        <div className={cardClassName}>
          <span className={eyebrowClassName}>Create account</span>
          <h1 className="mt-[1.6rem] text-[clamp(3rem,4vw,4.2rem)] leading-[1.2] font-extrabold tracking-[-0.02em]">
            Join TicketHub
          </h1>
          <p className="mt-[1.2rem] text-[1.6rem] leading-[1.7] text-[var(--color-text-secondary)]">
            Create your account to discover events, book tickets, and manage every booking with ease.
          </p>

          {authNotice ? (
            <div
              className={`mt-[1.8rem] rounded-[1.6rem] border px-[1.4rem] py-[1.2rem] text-left text-[1.38rem] leading-[1.7] ${
                authNoticeTone === "warning"
                  ? "border-[rgba(245,158,11,0.24)] bg-[rgba(255,247,237,0.95)] text-[#9a3412]"
                  : "border-[rgba(59,130,246,0.2)] bg-[rgba(239,246,255,0.95)] text-[#1d4ed8]"
              }`}
            >
              {authNotice}
            </div>
          ) : null}

          <a
            href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth"}/google`}
            className={`${authNotice ? "mt-[1.6rem]" : "mt-[2.2rem]"} inline-flex w-full items-center justify-center gap-[1rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.14)] bg-white px-[1.8rem] py-[1.2rem] text-[1.45rem] font-bold text-[var(--color-text-primary)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[rgba(248,68,100,0.35)] hover:shadow-[0_12px_24px_rgba(248,68,100,0.12)] hover:-translate-y-px`}
          >
            <img
              src="/google-g.svg"
              alt=""
              aria-hidden="true"
              className="h-[1.9rem] w-[1.9rem]"
            />
            Continue with Google
          </a>

          <div className="my-[2rem] flex items-center gap-[1rem]">
            <div className="h-px flex-1 bg-[rgba(28,28,28,0.08)]" />
            <span className="text-[1.2rem] font-bold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
              Or register with email
            </span>
            <div className="h-px flex-1 bg-[rgba(28,28,28,0.08)]" />
          </div>

          <form className="mt-[2.6rem] grid gap-[1.6rem]" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-[1.6rem] max-[640px]:grid-cols-1">
              <div className="grid gap-[0.8rem]">
                <label className="text-[1.4rem] font-bold text-[var(--color-text-primary)]" htmlFor="username">
                  Username
                </label>
                <input
                  className={getValidatedFieldClassName(inputClassName, touchedFields.username && Boolean(fieldErrors.username))}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your name"
                  value={user.username}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  aria-invalid={touchedFields.username && Boolean(fieldErrors.username)}
                  required
                />
                {touchedFields.username && fieldErrors.username ? (
                  <p className="text-[1.18rem] font-medium text-[var(--color-error)]">{fieldErrors.username}</p>
                ) : null}
              </div>

              <div className="grid gap-[0.8rem]">
                <label className="text-[1.4rem] font-bold text-[var(--color-text-primary)]" htmlFor="phone">
                  Phone
                </label>
                <input
                  className={getValidatedFieldClassName(inputClassName, touchedFields.phone && Boolean(fieldErrors.phone))}
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={user.phone}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  aria-invalid={touchedFields.phone && Boolean(fieldErrors.phone)}
                  required
                />
                {touchedFields.phone && fieldErrors.phone ? (
                  <p className="text-[1.18rem] font-medium text-[var(--color-error)]">{fieldErrors.phone}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-[0.8rem]">
              <label className="text-[1.4rem] font-bold text-[var(--color-text-primary)]" htmlFor="email">
                Email
              </label>
              <input
                className={getValidatedFieldClassName(inputClassName, touchedFields.email && Boolean(fieldErrors.email))}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleInput}
                onBlur={handleBlur}
                aria-invalid={touchedFields.email && Boolean(fieldErrors.email)}
                required
              />
              {touchedFields.email && fieldErrors.email ? (
                <p className="text-[1.18rem] font-medium text-[var(--color-error)]">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div className="grid gap-[0.8rem]">
              <label className="text-[1.4rem] font-bold text-[var(--color-text-primary)]" htmlFor="password">
                Password
              </label>
              <input
                className={getValidatedFieldClassName(inputClassName, touchedFields.password && Boolean(fieldErrors.password))}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleInput}
                onBlur={handleBlur}
                aria-invalid={touchedFields.password && Boolean(fieldErrors.password)}
                required
              />
              {touchedFields.password && fieldErrors.password ? (
                <p className="text-[1.18rem] font-medium text-[var(--color-error)]">{fieldErrors.password}</p>
              ) : null}
            </div>

            <button className={submitClassName} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-[2rem] text-center text-[1.5rem] text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <NavLink
              className="text-[inherit] text-[var(--color-primary)]"
              to="/login"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};
