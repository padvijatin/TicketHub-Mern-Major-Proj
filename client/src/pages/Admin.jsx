import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

export const Admin = () => {
  const { isAdmin, isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-15rem)] w-[min(120rem,calc(100%_-_3.2rem))] items-center justify-center py-[4rem] text-[1.8rem] font-semibold text-[var(--color-text-secondary)]">
        Checking admin access...
      </section>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-15rem)] w-[min(72rem,calc(100%_-_3.2rem))] place-items-center py-[4rem]">
        <div className="rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white p-[3rem] text-center shadow-[0_24px_60px_rgba(28,28,28,0.1)]">
          <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1.2rem] py-[0.7rem] text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
            Restricted
          </span>
          <h1 className="mt-[1.6rem] text-[3rem] font-extrabold text-[var(--color-text-primary)]">
            Admin access only
          </h1>
          <p className="mt-[1rem] text-[1.6rem] leading-[1.7] text-[var(--color-text-secondary)]">
            This page is available only for users with the admin role.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-15rem)] w-[min(72rem,calc(100%_-_3.2rem))] place-items-center py-[4rem]">
      <div className="rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white p-[3rem] text-center shadow-[0_24px_60px_rgba(28,28,28,0.1)]">
        <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1.2rem] py-[0.7rem] text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
          Admin
        </span>
        <h1 className="mt-[1.6rem] text-[3rem] font-extrabold text-[var(--color-text-primary)]">
          Admin access enabled
        </h1>
        <p className="mt-[1rem] text-[1.6rem] leading-[1.7] text-[var(--color-text-secondary)]">
          Role-based access is active. Admin-only management tools can be added here next.
        </p>
      </div>
    </section>
  );
};
