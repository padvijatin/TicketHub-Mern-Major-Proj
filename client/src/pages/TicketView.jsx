import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  ScanLine,
  ShieldCheck,
  Tag,
  Ticket,
} from "lucide-react";
import { BrandLogo } from "../components/BrandLogo.jsx";
import PosterImage from "../components/PosterImage.jsx";
import { getBookingTicket } from "../utils/eventApi.js";

const detectContentType = (category = "") => {
  const value = String(category || "").trim().toLowerCase();

  if (/(movie|film|cinema|screen|premiere)/i.test(value)) {
    return "Movie";
  }

  if (/(sport|cricket|football|match|league|ipl|cup|tournament|stadium)/i.test(value)) {
    return "Sports";
  }

  return "Event";
};

const formatEventDate = (value) => {
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

const formatEventTime = (value) => {
  if (!value) {
    return "Time will be shared";
  }

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatIssuedOn = (value) => {
  if (!value) {
    return "Just now";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getBookingStatusMeta = (paymentStatus = "") => {
  const normalized = String(paymentStatus || "").trim().toLowerCase();

  if (normalized === "paid") {
    return {
      label: "Confirmed",
      chipText: "Payment confirmed",
      className: "text-[#15803d]",
      chipClassName: "bg-[rgba(34,197,94,0.12)] text-[#15803d]",
    };
  }

  if (normalized === "pending") {
    return {
      label: "Pending",
      chipText: "Payment pending",
      className: "text-[rgb(146,64,14)]",
      chipClassName: "bg-[rgba(245,158,11,0.18)] text-[rgb(146,64,14)]",
    };
  }

  if (normalized === "failed") {
    return {
      label: "Failed",
      chipText: "Payment failed",
      className: "text-[rgb(185,28,28)]",
      chipClassName: "bg-[rgba(239,68,68,0.14)] text-[rgb(185,28,28)]",
    };
  }

  if (normalized === "refunded") {
    return {
      label: "Refunded",
      chipText: "Payment refunded",
      className: "text-[rgb(75,85,99)]",
      chipClassName: "bg-[rgba(107,114,128,0.16)] text-[rgb(75,85,99)]",
    };
  }

  return {
    label: "Processing",
    chipText: "Payment processing",
    className: "text-[var(--color-text-secondary)]",
    chipClassName: "bg-[rgba(28,28,28,0.08)] text-[var(--color-text-secondary)]",
  };
};

const DetailCard = ({ icon, label, value, accent = false }) => {
  const IconComponent = icon;

  return (
    <div
      className={`rounded-[1.8rem] border p-[1.4rem] ${
        accent
          ? "border-[rgba(248,68,100,0.16)] bg-[rgba(248,68,100,0.08)]"
          : "border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.03)]"
      }`}
    >
      <div className="flex items-start gap-[0.85rem]">
        <span className="mt-[0.1rem] inline-flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[0_10px_24px_rgba(28,28,28,0.08)]">
          <IconComponent className="h-[1.35rem] w-[1.35rem]" />
        </span>
        <div>
          <p className="text-[1.08rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">{label}</p>
          <p className="mt-[0.45rem] text-[1.4rem] font-bold leading-[1.45] text-[var(--color-text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  );
};

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
        <section className="mx-auto w-[min(96rem,calc(100%_-_3.2rem))] rounded-[3rem] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
          <div className="h-[44rem] animate-pulse rounded-[2.4rem] bg-[rgba(28,28,28,0.08)]" />
        </section>
      </main>
    );
  }

  if (isError || !data?.booking || !data?.event) {
    return (
      <main className="py-[3rem]">
        <section className="mx-auto w-[min(80rem,calc(100%_-_3.2rem))] rounded-[2.6rem] border border-[rgba(248,68,100,0.18)] bg-white p-[2.4rem] text-center shadow-[var(--shadow-soft)]">
          <p className="text-[1.5rem] text-[var(--color-text-secondary)]">Ticket not found.</p>
          <Link to="/" className="mt-[1rem] inline-flex text-[1.3rem] font-bold text-[var(--color-primary)]">
            Go to home
          </Link>
        </section>
      </main>
    );
  }

  const { booking, event } = data;
  const seatsText = booking.seats?.length ? booking.seats.join(", ") : "Seat allocation confirmed";
  const sectionsText = booking.summary?.length
    ? booking.summary.map((item) => `${String(item.label || "").replace(/\uFFFD/g, "").trim()} x${item.count}`).join(" | ")
    : booking.bookingMeta?.selectedZones?.length
      ? booking.bookingMeta.selectedZones.join(", ")
      : "Standard allocation";
  const paymentMethod = String(booking.paymentMethod || "razorpay").toUpperCase();
  const contentType = detectContentType(event.category);
  const bookingStatusMeta = getBookingStatusMeta(booking.paymentStatus);

  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(248,68,100,0.12),transparent_34%),linear-gradient(180deg,#fff7f8_0%,#f5f7fb_44%,#ffffff_100%)] py-[3rem]">
      <section className="mx-auto w-[min(108rem,calc(100%_-_3.2rem))]">
        <article className="overflow-hidden rounded-[3.2rem] border border-[rgba(248,68,100,0.14)] bg-white shadow-[0_28px_80px_rgba(28,28,28,0.12)]">
          <div className="relative">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,14,25,0.86)_0%,rgba(18,23,39,0.46)_46%,rgba(248,68,100,0.22)_100%)]" />
            <div className="absolute inset-y-0 right-[-8rem] w-[24rem] rounded-full bg-[rgba(255,255,255,0.1)] blur-[20px]" />
            <div className="relative grid gap-[1.6rem] p-[1.4rem] md:grid-cols-[12rem_minmax(0,1fr)] md:p-[2rem]">
              <div className="mx-auto w-full max-w-[14rem] overflow-hidden rounded-[2rem] border border-white/12 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
                <PosterImage src={event.poster} alt={event.title} className="h-[18rem] w-full object-cover md:h-full" />
              </div>

              <div className="flex min-w-0 flex-col justify-between text-white">
                <div className="flex flex-wrap items-start justify-between gap-[1rem]">
                  <div className="flex flex-wrap gap-[0.8rem]">
                    <span className="inline-flex items-center rounded-full border border-white/18 bg-white/10 px-[1rem] py-[0.55rem] text-[1rem] font-extrabold uppercase tracking-[0.12em] backdrop-blur-[10px]">
                      {contentType}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[rgba(134,239,172,0.24)] bg-[rgba(34,197,94,0.18)] px-[1rem] py-[0.55rem] text-[1rem] font-extrabold uppercase tracking-[0.12em] text-[#dcfce7]">
                      Valid entry
                    </span>
                  </div>
                  <div className="flex items-center gap-[0.7rem] rounded-full border border-white/12 bg-black/20 px-[1rem] py-[0.65rem] text-[1.05rem] text-white/84 backdrop-blur-[10px]">
                    <ShieldCheck className="h-[1.4rem] w-[1.4rem] text-[#86efac]" />
                    Verified Ticket
                  </div>
                </div>

                <div className="mt-[1.4rem]">
                  <p className="text-[1.1rem] uppercase tracking-[0.14em] text-white/66">{event.category || "Live experience"}</p>
                  <h1 className="mt-[0.8rem] max-w-[60rem] text-[2.6rem] font-extrabold tracking-[-0.05em] text-white md:text-[3.8rem]">
                    {event.title}
                  </h1>
                  <p className="mt-[0.9rem] max-w-[56rem] text-[1.25rem] leading-[1.7] text-white/78">
                    Please show this live ticket at the venue entry gate. Carry a valid photo ID and keep your QR ready for a quick scan.
                  </p>
                </div>

                <div className="mt-[1.6rem] flex flex-wrap gap-[0.8rem]">
                  <span className="rounded-full border border-white/12 bg-white/10 px-[1rem] py-[0.65rem] text-[1.08rem] text-white/84 backdrop-blur-[10px]">
                    Booking ID: <span className="font-bold text-white">{booking.bookingId}</span>
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-[1rem] py-[0.65rem] text-[1.08rem] text-white/84 backdrop-blur-[10px]">
                    Issued on <span className="font-bold text-white">{formatIssuedOn(booking.createdAt)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-[0rem] lg:grid-cols-[minmax(0,1.3fr)_31rem]">
            <div className="p-[1.6rem] md:p-[2rem] lg:p-[2.2rem]">
              <div className="grid gap-[1rem] md:grid-cols-2">
                <DetailCard icon={CalendarDays} label="Event Date" value={formatEventDate(event.date)} />
                <DetailCard icon={Clock3} label="Entry Time" value={formatEventTime(event.date)} />
                <DetailCard icon={MapPin} label="Venue" value={`${event.venue}, ${event.city}`} />
                <DetailCard icon={Ticket} label="Seats" value={seatsText} />
                <DetailCard icon={Tag} label="Sections" value={sectionsText} />
                <DetailCard
                  icon={CreditCard}
                  label="Amount Paid"
                  value={`Rs ${Number(booking.finalAmount || 0).toLocaleString("en-IN")}`}
                  accent
                />
              </div>

              <div className="mt-[1.6rem] rounded-[2.2rem] border border-[rgba(28,28,28,0.08)] bg-[linear-gradient(135deg,rgba(28,28,28,0.02)_0%,rgba(248,68,100,0.05)_100%)] p-[1.5rem]">
                <div className="flex flex-wrap items-center justify-between gap-[1rem]">
                  <div>
                    <p className="text-[1.08rem] uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">Booking Snapshot</p>
                    <h2 className="mt-[0.45rem] text-[1.9rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                      Ready for entry
                    </h2>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-[1rem] py-[0.6rem] text-[1.05rem] font-bold ${bookingStatusMeta.chipClassName}`}>
                    <CheckCircle2 className="mr-[0.55rem] h-[1.35rem] w-[1.35rem]" />
                    {bookingStatusMeta.chipText} via {paymentMethod}
                  </span>
                </div>

                <div className="mt-[1.2rem] grid gap-[1rem] md:grid-cols-3">
                  <div className="rounded-[1.6rem] bg-white px-[1.2rem] py-[1.1rem]">
                    <p className="text-[1rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Ticket Count</p>
                    <p className="mt-[0.45rem] text-[1.7rem] font-extrabold text-[var(--color-text-primary)]">{booking.seats?.length || 1}</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white px-[1.2rem] py-[1.1rem]">
                    <p className="text-[1rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Payment Ref</p>
                    <p className="mt-[0.45rem] truncate text-[1.35rem] font-bold text-[var(--color-text-primary)]">
                      {booking.paymentReference || booking.paymentId || "Captured"}
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] bg-white px-[1.2rem] py-[1.1rem]">
                    <p className="text-[1rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Offer</p>
                    <p className="mt-[0.45rem] text-[1.35rem] font-bold text-[var(--color-text-primary)]">
                      {booking.couponCode ? booking.couponCode : "No coupon used"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-[1.6rem] rounded-[2.2rem] border border-dashed border-[rgba(28,28,28,0.12)] bg-[rgba(255,248,249,0.92)] p-[1.5rem]">
                <p className="text-[1.08rem] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">Important</p>
                <div className="mt-[1rem] grid gap-[0.9rem] text-[1.23rem] leading-[1.65] text-[var(--color-text-secondary)] md:grid-cols-2">
                  <p>Reach the venue 30 minutes before start time to avoid last-minute queue delays.</p>
                  <p>QR code is valid for one booking only. Screenshots may be rejected if the live ticket is required.</p>
                  <p>Seat or stand access is subject to the section mentioned on this ticket and venue policy.</p>
                  <p>Carry a valid photo ID matching the booking details if requested at entry.</p>
                </div>
              </div>
            </div>

            <aside className="border-t border-[rgba(28,28,28,0.08)] bg-[linear-gradient(180deg,#fcfcfd_0%,#f4f7fb_100%)] p-[1.6rem] md:p-[2rem] lg:border-l lg:border-t-0">
              <div className="rounded-[2.4rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1.4rem] shadow-[0_18px_40px_rgba(28,28,28,0.08)]">
                <div className="flex items-center justify-between gap-[1rem]">
                  <BrandLogo size="sm" />
                  <span className="rounded-full bg-[rgba(248,68,100,0.08)] px-[0.9rem] py-[0.5rem] text-[1rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                    Gate scan
                  </span>
                </div>

                <div className="mt-[1.4rem] rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[1rem] text-center">
                  {booking.qrCodeDataUrl ? (
                    <img src={booking.qrCodeDataUrl} alt={`Ticket QR ${booking.bookingId}`} className="mx-auto h-[17rem] w-[17rem] object-contain" />
                  ) : (
                    <p className="px-[1rem] py-[6rem] text-[1.2rem] text-[var(--color-text-secondary)]">QR is being prepared</p>
                  )}
                  <div className="mt-[0.8rem] inline-flex items-center gap-[0.55rem] rounded-full bg-[rgba(28,28,28,0.04)] px-[0.9rem] py-[0.55rem] text-[1.05rem] text-[var(--color-text-secondary)]">
                    <ScanLine className="h-[1.3rem] w-[1.3rem] text-[var(--color-primary)]" />
                    Scan this at the entrance
                  </div>
                </div>

                <div className="mt-[1.4rem] space-y-[0.85rem] rounded-[1.8rem] bg-[rgba(28,28,28,0.03)] p-[1.2rem]">
                  <div className="flex items-center justify-between gap-[1rem] text-[1.15rem]">
                    <span className="text-[var(--color-text-secondary)]">Booking ID</span>
                    <span className="font-bold text-[var(--color-text-primary)]">{booking.bookingId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-[1rem] text-[1.15rem]">
                    <span className="text-[var(--color-text-secondary)]">Category</span>
                    <span className="font-bold text-[var(--color-text-primary)]">{contentType}</span>
                  </div>
                  <div className="flex items-center justify-between gap-[1rem] text-[1.15rem]">
                    <span className="text-[var(--color-text-secondary)]">Status</span>
                    <span className={`font-bold ${bookingStatusMeta.className}`}>{bookingStatusMeta.label}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </section>
    </main>
  );
};
