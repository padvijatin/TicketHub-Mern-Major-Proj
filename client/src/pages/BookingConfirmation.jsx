import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";
import { CalendarDays, CheckCircle2, Download, MapPin, Share2, Ticket } from "lucide-react";
import { getEventById } from "../utils/eventApi.js";

export const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const bookingState = location.state || {};
  const selectedItems = bookingState.items || [];
  const total = bookingState.total || 0;
  const currency = bookingState.currency || "Rs ";
  const paymentMethod = bookingState.paymentMethod || "upi";
  const bookingId = `TH${Date.now().toString(36).toUpperCase()}`;
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });

  return (
    <main className="py-[3rem]">
      <section className="mx-auto w-[min(84rem,calc(100%_-_3.2rem))] space-y-[2rem]">
        <div className="text-center">
          <div className="mx-auto inline-flex h-[6.4rem] w-[6.4rem] items-center justify-center rounded-full bg-[rgba(34,197,94,0.14)] text-[#16a34a]">
            <CheckCircle2 className="h-[3.6rem] w-[3.6rem]" />
          </div>
          <h1 className="mt-[1.2rem] text-[3.2rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
            Booking Confirmed
          </h1>
          <p className="mt-[0.8rem] text-[1.4rem] text-[var(--color-text-secondary)]">
            Booking ID: <span className="font-bold text-[var(--color-text-primary)]">{bookingId}</span>
          </p>
        </div>

        <article className="overflow-hidden rounded-[2.4rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[var(--shadow-soft)]">
          {event ? (
            <div className="relative h-[20rem] overflow-hidden">
              <img src={event.poster || "/fallback.jpg"} alt={event.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,0.12)_0%,rgba(28,28,28,0.72)_100%)]" />
              <div className="absolute bottom-[1.8rem] left-[1.8rem] right-[1.8rem]">
                <h2 className="text-[2.2rem] font-extrabold tracking-[-0.03em] text-white">{event.title}</h2>
                <p className="mt-[0.3rem] text-[1.2rem] text-white/82">{event.category}</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-[20rem] animate-pulse bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
          ) : null}

          <div className="p-[2rem]">
            {event ? (
              <div className="grid gap-[1.2rem] md:grid-cols-2">
                <div className="flex items-start gap-[0.8rem]">
                  <CalendarDays className="mt-[0.2rem] h-[1.6rem] w-[1.6rem] text-[var(--color-primary)]" />
                  <div>
                    <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Date</p>
                    <p className="text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-[0.8rem]">
                  <MapPin className="mt-[0.2rem] h-[1.6rem] w-[1.6rem] text-[var(--color-primary)]" />
                  <div>
                    <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Venue</p>
                    <p className="text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                      {event.venue}, {event.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-[0.8rem]">
                  <Ticket className="mt-[0.2rem] h-[1.6rem] w-[1.6rem] text-[var(--color-primary)]" />
                  <div>
                    <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Tickets</p>
                    <p className="text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                      {selectedItems.length ? selectedItems.join(", ") : "Selection confirmed"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Payment Method</p>
                  <p className="text-[1.4rem] font-bold uppercase text-[var(--color-text-primary)]">
                    {paymentMethod}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="my-[1.8rem] border-t border-dashed border-[rgba(28,28,28,0.14)]" />

            <div className="flex flex-col items-center gap-[1.2rem] py-[1rem]">
              <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1.2rem]">
                <QRCodeCanvas
                  value={`${bookingId}:${id}:${selectedItems.join(",")}:${total}`}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#1c1c1c"
                  includeMargin
                />
              </div>
              <p className="text-[1.2rem] text-[var(--color-text-secondary)]">
                Show this QR code at the venue entrance.
              </p>
            </div>

            <div className="my-[1.8rem] border-t border-dashed border-[rgba(28,28,28,0.14)]" />

            <div className="flex items-center justify-between">
              <span className="text-[1.4rem] text-[var(--color-text-secondary)]">Total Paid</span>
              <span className="text-[2.3rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
                {currency}
                {Number(total).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </article>

        <div className="flex flex-col gap-[1rem] sm:flex-row">
          <button
            type="button"
            className="inline-flex h-[4.8rem] flex-1 items-center justify-center gap-[0.8rem] rounded-[1.4rem] bg-[var(--color-primary)] text-[1.5rem] font-bold text-[var(--color-text-light)]"
          >
            <Download className="h-[1.8rem] w-[1.8rem]" />
            Download Ticket
          </button>
          <button
            type="button"
            className="inline-flex h-[4.8rem] flex-1 items-center justify-center gap-[0.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white text-[1.5rem] font-bold text-[var(--color-text-primary)]"
          >
            <Share2 className="h-[1.8rem] w-[1.8rem]" />
            Share
          </button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-[1.35rem] font-bold text-[var(--color-primary)]">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};
