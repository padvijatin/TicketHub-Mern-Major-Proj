import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { BrandLogo } from "../components/BrandLogo.jsx";
import { getBookingTicket } from "../utils/eventApi.js";

export const TicketView = () => {
  const { bookingId } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", bookingId],
    queryFn: () => getBookingTicket(bookingId),
    enabled: Boolean(bookingId),
  });

  if (isLoading) {
    return (
      <main className="py-[3rem]">
        <section className="mx-auto w-[min(80rem,calc(100%_-_3.2rem))] rounded-[2.2rem] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
          <div className="h-[18rem] animate-pulse rounded-[1.6rem] bg-[rgba(28,28,28,0.08)]" />
        </section>
      </main>
    );
  }

  if (isError || !data?.booking || !data?.event) {
    return (
      <main className="py-[3rem]">
        <section className="mx-auto w-[min(80rem,calc(100%_-_3.2rem))] rounded-[2.2rem] border border-[rgba(248,68,100,0.18)] bg-white p-[2rem] text-center shadow-[var(--shadow-soft)]">
          <p className="text-[1.5rem] text-[var(--color-text-secondary)]">Ticket not found.</p>
          <Link to="/" className="mt-[1rem] inline-flex text-[1.3rem] font-bold text-[var(--color-primary)]">
            Go to home
          </Link>
        </section>
      </main>
    );
  }

  const { booking, event } = data;

  return (
    <main className="py-[3rem]">
      <section className="mx-auto w-[min(84rem,calc(100%_-_3.2rem))]">
        <article className="overflow-hidden rounded-[2.4rem] border border-[rgba(248,68,100,0.14)] bg-white shadow-[0_18px_36px_rgba(28,28,28,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-[0.8rem] border-b border-[rgba(248,68,100,0.16)] bg-[linear-gradient(90deg,rgba(248,68,100,0.08)_0%,rgba(248,68,100,0.02)_100%)] px-[1.8rem] py-[1.2rem]">
            <BrandLogo size="sm" />
            <p className="inline-flex h-[2.6rem] items-center rounded-full border border-[rgba(248,68,100,0.2)] bg-white px-[1rem] text-[1.05rem] font-extrabold tracking-[0.08em] text-[var(--color-text-secondary)]">
              VALID TICKET
            </p>
          </div>
          <div className="grid gap-[1.8rem] p-[2rem] md:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-[1rem]">
              <h1 className="text-[2.2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">{event.title}</h1>
              <p className="text-[1.3rem] text-[var(--color-text-secondary)]">Booking ID: {booking.bookingId}</p>
              <div className="flex items-start gap-[0.7rem] text-[1.3rem] text-[var(--color-text-secondary)]">
                <CalendarDays className="mt-[0.1rem] h-[1.5rem] w-[1.5rem] text-[var(--color-primary)]" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-start gap-[0.7rem] text-[1.3rem] text-[var(--color-text-secondary)]">
                <MapPin className="mt-[0.1rem] h-[1.5rem] w-[1.5rem] text-[var(--color-primary)]" />
                <span>{event.venue}, {event.city}</span>
              </div>
              <div className="flex items-start gap-[0.7rem] text-[1.3rem] text-[var(--color-text-secondary)]">
                <Ticket className="mt-[0.1rem] h-[1.5rem] w-[1.5rem] text-[var(--color-primary)]" />
                <span>{(booking.seats || []).join(", ") || "Seat allocation confirmed"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-[0.6rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1rem]">
              {booking.qrCodeDataUrl ? (
                <img src={booking.qrCodeDataUrl} alt={`Ticket QR ${booking.bookingId}`} className="h-[16rem] w-[16rem] object-contain" />
              ) : null}
              <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Scan to verify ticket</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};
