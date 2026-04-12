import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronRight, MapPin, Receipt, Ticket, Tickets } from "lucide-react";
import { useAuth } from "../store/auth-context.jsx";
import { getMyBookings } from "../utils/eventApi.js";

const fallbackPosterClassByType = {
  event: "bg-[linear-gradient(135deg,#1c1c1c_0%,#343434_44%,#f84464_100%)]",
  movie: "bg-[linear-gradient(135deg,#1c1c1c_0%,#4b5563_52%,#f84464_100%)]",
  sports: "bg-[linear-gradient(135deg,#111111_0%,#374151_42%,#f84464_100%)]",
};

const bookingTabs = [
  { id: "all", label: "All" },
  { id: "event", label: "Events" },
  { id: "movie", label: "Movies" },
  { id: "sports", label: "Sports" },
];

const getBookingStatusMeta = (booking) => {
  const rawStatus = String(booking?.paymentStatus || "").toLowerCase();

  if (rawStatus === "pending") {
    return {
      label: "Pending",
      className: "border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.14)] text-[#b45309]",
    };
  }

  if (rawStatus === "failed" || rawStatus === "cancelled" || rawStatus === "canceled") {
    return {
      label: "Cancelled",
      className: "border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.14)] text-[#b91c1c]",
    };
  }

  return {
    label: "Confirmed",
    className: "border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.14)] text-[#15803d]",
  };
};

const formatBookingDate = (value) => {
  if (!value) {
    return "Date to be announced";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatBookedOn = (value) => {
  if (!value) {
    return "Recently";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const sanitizeSummaryLabel = (value) =>
  String(value || "")
    .replace(/\uFFFD/g, "")
    .replace(/\s+/g, " ")
    .trim();
const BookingCard = ({ booking }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackClassName = fallbackPosterClassByType[booking.event?.contentType] || fallbackPosterClassByType.event;
  const seatsText = booking.seats?.length ? booking.seats.join(", ") : "Seat allocation confirmed";
  const bookingTypeLabel = booking.event?.contentType
    ? booking.event.contentType[0].toUpperCase() + booking.event.contentType.slice(1)
    : "Booking";
  const statusMeta = getBookingStatusMeta(booking);

  return (
    <article className="overflow-hidden rounded-[2.8rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[var(--shadow-soft)]">
      <div className="grid lg:grid-cols-[26rem_1fr]">
        <div className={`relative min-h-[24rem] overflow-hidden ${fallbackClassName}`}>
          {!imageFailed && booking.event?.poster ? (
            <img
              src={booking.event.poster}
              alt={booking.event?.title || "Booking poster"}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,0.08)_0%,rgba(28,28,28,0.74)_100%)]" />
          <div className="absolute left-[1.6rem] right-[1.6rem] top-[1.6rem] flex items-start justify-between gap-[1rem]">
            <span className="inline-flex rounded-full border border-white/15 bg-black/30 px-[1rem] py-[0.55rem] text-[1.05rem] font-extrabold uppercase tracking-[0.08em] text-white backdrop-blur-[8px]">
              {bookingTypeLabel}
            </span>
            <span
              className={`inline-flex rounded-full border px-[1rem] py-[0.55rem] text-[1.05rem] font-bold uppercase tracking-[0.06em] backdrop-blur-[8px] ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </div>
          <div className="absolute bottom-[1.8rem] left-[1.8rem] right-[1.8rem] text-white">
            <p className="text-[1.2rem] text-white/78">Booked on {formatBookedOn(booking.createdAt)}</p>
            <h2 className="mt-[0.8rem] text-[2.2rem] font-extrabold tracking-[-0.03em]">
              {booking.event?.title || "Event details unavailable"}
            </h2>
            <p className="mt-[0.5rem] text-[1.25rem] text-white/80">Booking ID: {booking.bookingId}</p>
          </div>
        </div>

        <div className="p-[2rem] md:p-[2.4rem]">
          <div className="grid gap-[1.4rem] sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.8rem] bg-[rgba(28,28,28,0.03)] p-[1.4rem]">
              <div className="flex items-start gap-[0.8rem]">
                <CalendarDays className="mt-[0.2rem] h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                <div>
                  <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Event date</p>
                  <p className="mt-[0.4rem] text-[1.35rem] font-bold text-[var(--color-text-primary)]">{formatBookingDate(booking.event?.date)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-[rgba(28,28,28,0.03)] p-[1.4rem]">
              <div className="flex items-start gap-[0.8rem]">
                <MapPin className="mt-[0.2rem] h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                <div>
                  <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Venue</p>
                  <p className="mt-[0.4rem] text-[1.35rem] font-bold text-[var(--color-text-primary)]">
                    {booking.event?.venue ? `${booking.event.venue}, ${booking.event.city}` : "Venue to be shared"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-[rgba(28,28,28,0.03)] p-[1.4rem]">
              <div className="flex items-start gap-[0.8rem]">
                <Ticket className="mt-[0.2rem] h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                <div>
                  <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Seats</p>
                  <p className="mt-[0.4rem] text-[1.35rem] font-bold text-[var(--color-text-primary)]">{seatsText}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-[rgba(248,68,100,0.08)] p-[1.4rem]">
              <div className="flex items-start gap-[0.8rem]">
                <Receipt className="mt-[0.2rem] h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                <div>
                  <p className="text-[1.1rem] text-[var(--color-text-secondary)]">Total paid</p>
                  <p className="mt-[0.4rem] text-[1.55rem] font-extrabold tracking-[-0.02em] text-[var(--color-text-primary)]">
                    Rs {Number(booking.finalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[1.8rem] flex flex-wrap items-center gap-[1rem] text-[1.2rem] text-[var(--color-text-secondary)]">
            {booking.summary?.length ? (
              <span className="rounded-full border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.02)] px-[1rem] py-[0.65rem]">
                {booking.summary.map((item) => `${sanitizeSummaryLabel(item.label)} x${item.count}`).join(" | ")}
              </span>
            ) : null}
            {booking.couponCode ? (
              <span className="rounded-full border border-[rgba(248,68,100,0.18)] bg-[rgba(248,68,100,0.08)] px-[1rem] py-[0.65rem] font-bold text-[var(--color-primary)]">
                Coupon {booking.couponCode}
              </span>
            ) : null}
            <span className="rounded-full border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.02)] px-[1rem] py-[0.65rem] capitalize">
              Paid via {booking.paymentMethod || "upi"}
            </span>
          </div>

          <div className="mt-[2rem] flex flex-wrap gap-[1rem]">
            <Link
              to={`/ticket/${booking.bookingId}`}
              className="inline-flex h-[4.8rem] items-center justify-center gap-[0.7rem] rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] text-[1.45rem] font-bold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
            >
              Open ticket
              <ChevronRight className="h-[1.7rem] w-[1.7rem]" />
            </Link>
            {booking.event?.id ? (
              <Link
                to={`/event/${booking.event.id}`}
                className="inline-flex h-[4.8rem] items-center justify-center rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.8rem] text-[1.45rem] font-bold text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
              >
                View event
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};

export const Bookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { authorizationToken, isLoading: isAuthLoading, isLoggedIn } = useAuth();
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["my-bookings", authorizationToken],
    queryFn: () => getMyBookings(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") {
      return bookings;
    }

    return bookings.filter((booking) => booking.event?.contentType === activeTab);
  }, [activeTab, bookings]);

  if (!isAuthLoading && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="py-[3rem]">
      <section className="mx-auto w-[min(120rem,calc(100%_-_3.2rem))]">
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center gap-[0.8rem] rounded-full border border-[rgba(28,28,28,0.08)] bg-white p-[0.7rem] shadow-[var(--shadow-soft)]">
            {bookingTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex min-w-[8.6rem] items-center justify-center rounded-full px-[1.6rem] py-[1rem] text-[1.45rem] font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border border-[rgba(248,68,100,0.18)] bg-[rgba(248,68,100,0.08)] text-[var(--color-primary)]"
                    : "border border-transparent text-[var(--color-text-secondary)] hover:border-[rgba(248,68,100,0.18)] hover:bg-[rgba(248,68,100,0.08)] hover:text-[var(--color-primary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading || isAuthLoading ? (
          <div className="mt-[3rem] grid gap-[2rem]">
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={`booking-skeleton-${index}`}
                className="h-[34rem] animate-pulse rounded-[2.8rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[var(--shadow-soft)]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-[3rem] rounded-[2.4rem] border border-[rgba(248,68,100,0.14)] bg-[rgba(248,68,100,0.05)] px-[2rem] py-[1.8rem] text-[1.5rem] text-[var(--color-text-secondary)]">
            We could not load your bookings right now. Please try again in a moment.
          </div>
        ) : filteredBookings.length ? (
          <div className="mt-[3rem] grid gap-[2rem]">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="mt-[3rem] flex min-h-[44rem] flex-col items-center justify-center rounded-[3rem] border border-[rgba(28,28,28,0.08)] bg-white px-[2rem] py-[4rem] text-center shadow-[var(--shadow-soft)]">
            <div className="flex h-[11rem] w-[11rem] items-center justify-center rounded-[3rem] bg-[rgba(248,68,100,0.1)] text-[var(--color-primary)]">
              <Tickets className="h-[5rem] w-[5rem]" />
            </div>
            <h2 className="mt-[2rem] text-[3rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
              No bookings yet
            </h2>
            <p className="mt-[1rem] max-w-[42rem] text-[1.55rem] leading-[1.75] text-[var(--color-text-secondary)]">
              {activeTab === "all"
                ? "Your confirmed plans will show up here after you book a movie, event, or sports ticket."
                : `You do not have any ${bookingTabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} bookings yet.`}
            </p>
            <Link
              to="/events"
              className="mt-[2rem] inline-flex h-[4.8rem] items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] text-[1.45rem] font-bold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
            >
              Explore events
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};
