import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";

export const NotFound = () => {
  return (
    <main className="min-h-[calc(100vh-15rem)] bg-[radial-gradient(circle_at_top_left,_rgba(248,68,100,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,179,71,0.16),_transparent_26%),linear-gradient(180deg,_#fff9f7_0%,_#f5f5f5_100%)] py-[5.6rem] max-[640px]:py-[3.2rem]">
      <section className="mx-auto grid w-[min(96rem,calc(100%_-_3.2rem))] gap-[2rem] rounded-[2.8rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.94)] p-[3rem] shadow-[0_28px_60px_rgba(28,28,28,0.12)] md:grid-cols-[1.2fr_0.8fr] max-[640px]:rounded-[2rem] max-[640px]:px-[2rem]">
        <div>
          <span className="inline-flex items-center gap-[0.7rem] rounded-full bg-[rgba(248,68,100,0.1)] px-[1.2rem] py-[0.7rem] text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
            <Compass className="h-[1.5rem] w-[1.5rem]" />
            Page not found
          </span>
          <h1 className="mt-[1.8rem] text-[clamp(3rem,4vw,4.6rem)] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
            This TicketHub page does not exist.
          </h1>
          <p className="mt-[1.2rem] max-w-[58rem] text-[1.65rem] leading-[1.75] text-[var(--color-text-secondary)]">
            The link may be outdated, mistyped, or no longer available. Let&apos;s get you back to a working page.
          </p>

          <div className="mt-[2.4rem] flex flex-wrap gap-[1rem]">
            <Link
              to="/"
              className="inline-flex items-center gap-[0.8rem] rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] py-[1.2rem] text-[1.45rem] font-bold text-white transition-[transform,box-shadow,background] duration-200 hover:bg-[var(--color-primary-hover)] hover:-translate-y-px hover:shadow-[0_14px_28px_rgba(248,68,100,0.2)]"
            >
              <Home className="h-[1.7rem] w-[1.7rem]" />
              Back to home
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-[0.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.8rem] py-[1.2rem] text-[1.45rem] font-bold text-[var(--color-text-primary)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-[rgba(248,68,100,0.24)] hover:shadow-[0_14px_28px_rgba(28,28,28,0.08)]"
            >
              <Search className="h-[1.7rem] w-[1.7rem]" />
              Browse events
            </Link>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-[rgba(28,28,28,0.06)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(255,244,246,0.92)_100%)] p-[2rem]">
          <div className="text-[7rem] font-black leading-none tracking-[-0.08em] text-[rgba(248,68,100,0.16)]">
            404
          </div>
          <p className="mt-[1.2rem] text-[1.5rem] leading-[1.7] text-[var(--color-text-secondary)]">
            If you were trying to access admin login, use the regular login page and then continue to the admin panel with an authorized account.
          </p>
        </div>
      </section>
    </main>
  );
};
