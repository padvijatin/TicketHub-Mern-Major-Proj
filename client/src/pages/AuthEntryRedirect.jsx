import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context.jsx";

const entryConfig = {
  login: {
    targetPath: "/login",
    eyebrow: "Admin sign-in",
    title: "Redirecting to the secure admin login",
    message: "Admin accounts use the regular TicketHub login form. Sign in with your admin email to continue.",
    notice: "Admin access uses the regular login form. Sign in with your admin account to continue.",
  },
  register: {
    targetPath: "/register",
    eyebrow: "Admin access",
    title: "Redirecting to the correct admin access flow",
    message: "Admin accounts are managed internally. If you already have admin access, use login instead of creating a new account.",
    notice: "Admin accounts are created by the system. Use the regular login page with your admin credentials.",
  },
};

export const AuthEntryRedirect = ({ entry = "login" }) => {
  const { audience = "" } = useParams();
  const navigate = useNavigate();
  const hasNotifiedRef = useRef(false);
  const { isAdmin, isLoading, isLoggedIn } = useAuth();
  const normalizedEntry = entry === "register" ? "register" : "login";
  const config = entryConfig[normalizedEntry];

  useEffect(() => {
    if (isLoading || audience !== "admin" || hasNotifiedRef.current) {
      return;
    }

    hasNotifiedRef.current = true;

    if (isLoggedIn && isAdmin) {
      toast.success("Welcome back. Opening the admin panel.");
      navigate("/admin", { replace: true });
      return;
    }

    toast.info(config.notice);
    navigate(config.targetPath, {
      replace: true,
      state: {
        authNotice: config.notice,
        authNoticeTone: normalizedEntry === "register" ? "warning" : "info",
      },
    });
  }, [audience, config.notice, config.targetPath, isAdmin, isLoading, isLoggedIn, navigate, normalizedEntry]);

  if (audience !== "admin") {
    return <Navigate to={`/${normalizedEntry}`} replace />;
  }

  return (
    <main className="min-h-[calc(100vh-15rem)] bg-[radial-gradient(circle_at_top_left,_rgba(248,68,100,0.14),_transparent_30%),linear-gradient(180deg,_#fff8fa_0%,_#f5f5f5_100%)] py-[5.6rem] max-[640px]:py-[3.2rem]">
      <section className="mx-auto grid w-[min(78rem,calc(100%_-_3.2rem))] place-items-center">
        <div className="w-full rounded-[2.6rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.95)] p-[3.2rem] text-center shadow-[0_24px_60px_rgba(28,28,28,0.12)] max-[640px]:rounded-[2rem] max-[640px]:px-[2rem]">
          <span className="inline-flex items-center gap-[0.7rem] rounded-full bg-[rgba(248,68,100,0.1)] px-[1.2rem] py-[0.7rem] text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
            <ShieldCheck className="h-[1.5rem] w-[1.5rem]" />
            {config.eyebrow}
          </span>
          <h1 className="mt-[1.6rem] text-[clamp(2.8rem,4vw,4rem)] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
            {config.title}
          </h1>
          <p className="mt-[1rem] text-[1.6rem] leading-[1.7] text-[var(--color-text-secondary)]">
            {config.message}
          </p>
        </div>
      </section>
    </main>
  );
};
