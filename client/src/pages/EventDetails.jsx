import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  Clock3,
  Heart,
  Info,
  MapPin,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useWishlist } from "../store/wishlist.jsx";
import { getEventById, getEvents } from "../utils/eventApi.js";

const formatDate = (value) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value || "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "8:30 PM";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const getStableRating = (event = {}) => {
  const seedSource = `${event.id || ""}${event.title || ""}${event.category || ""}`;
  const seedValue = Array.from(seedSource).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0
  );
  return Number((4 + (seedValue % 9) / 10).toFixed(1));
};

const getInterestedCount = (event = {}) => {
  const seedSource = `${event.id || ""}${event.title || ""}`;
  const seedValue = Array.from(seedSource).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 3),
    0
  );
  return 1800 + (seedValue % 4200);
};

const infoChipClassName =
  "inline-flex items-center gap-[0.8rem] rounded-full border border-[rgba(28,28,28,0.08)] bg-white px-[1.3rem] py-[0.95rem] text-[1.35rem] text-[var(--color-text-primary)] shadow-[0_10px_24px_rgba(28,28,28,0.04)]";

const getAboutParagraphs = (event, eventDate, eventTime) => {
  const customDescription = (event?.aboutThisEvent || "").trim();

  if (customDescription) {
    return customDescription
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return [
    `Join us for an unforgettable experience at ${event.title}. This event will be held at ${event.venue}, ${event.city} on ${eventDate} starting at ${eventTime}. Don't miss out on one of the most anticipated ${event.category.toLowerCase()} experiences of the season.`,
    "Whether you're a long-time fan or experiencing it for the first time, this event promises a lively atmosphere, smooth booking, and a memorable crowd. Grab your tickets before they sell out.",
  ];
};

const groupSeatZones = (seatZones = []) => {
  return seatZones.reduce((groups, zone) => {
    const groupName = zone.sectionGroup || "Tickets";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(zone);
    return groups;
  }, {});
};

export const EventDetails = () => {
  const { id } = useParams();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });
  const { data: relatedEvents = [] } = useQuery({
    queryKey: ["related-events", id],
    queryFn: () => getEvents({ type: event?.contentType || "" }),
    enabled: Boolean(event?.contentType),
  });

  const rating = useMemo(() => getStableRating(event), [event]);
  const interestedCount = useMemo(() => getInterestedCount(event), [event]);
  const suggestedEvent = useMemo(
    () => relatedEvents.find((item) => item.id !== event?.id) || null,
    [event?.id, relatedEvents]
  );

  if (isLoading) {
    return (
      <main className="py-[3rem]">
        <section className="mx-auto w-[min(120rem,calc(100%_-_3.2rem))] rounded-[2.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
          <div className="aspect-[16/7] animate-pulse rounded-[2rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
        </section>
      </main>
    );
  }

  if (isError || !event) {
    return (
      <main className="py-[3rem]">
        <section className="mx-auto w-[min(80rem,calc(100%_-_3.2rem))] rounded-[2.4rem] border border-[rgba(248,68,100,0.14)] bg-[rgba(248,68,100,0.05)] px-[1.8rem] py-[1.6rem] text-[1.5rem] text-[var(--color-text-secondary)]">
          Event details could not be loaded right now.
        </section>
      </main>
    );
  }

  const isLiked = isWishlisted(event);
  const eventDate = formatDate(event.date);
  const eventTime = formatTime(event.date);
  const eventPrice = formatCurrency(event.price);
  const aboutParagraphs = getAboutParagraphs(event, eventDate, eventTime);
  const zoneGroups = groupSeatZones(event.seatZones || []);
  const terms = [
    "Entry is subject to valid ticket and photo ID.",
    "No refunds on confirmed bookings.",
    "Outside food and beverages are not allowed.",
    "The organizer reserves the right to deny entry.",
    "Children below 5 years are not permitted.",
  ];

  return (
    <main className="bg-[linear-gradient(180deg,#faf7f2_0%,#f5f5f5_18%,#f5f5f5_100%)] py-[3rem]">
      <section className="mx-auto w-[min(120rem,calc(100%_-_3.2rem))]">
        <div className="mb-[1.6rem] flex flex-wrap items-center gap-[0.8rem] text-[1.3rem] text-[var(--color-text-secondary)]">
          <Link to="/" className="transition-colors duration-200 hover:text-[var(--color-primary)]">
            Home
          </Link>
          <span>/</span>
          <Link
            to={event.contentType === "movie" ? "/movies" : event.contentType === "sports" ? "/sports" : "/events"}
            className="transition-colors duration-200 hover:text-[var(--color-primary)]"
          >
            {event.category}
          </Link>
          <span>/</span>
          <span className="font-medium text-[var(--color-text-primary)]">{event.title}</span>
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-[rgba(28,28,28,0.06)] bg-white p-[1.6rem] shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[16/7] overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#1c1c1c_0%,#7b3fe4_46%,#f84464_100%)]">
            {event.poster ? (
              <img src={event.poster} alt={event.title} className="h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,0.12)_0%,rgba(28,28,28,0.18)_38%,rgba(28,28,28,0.68)_100%)]" />

            <Link
              to={event.contentType === "movie" ? "/movies" : event.contentType === "sports" ? "/sports" : "/events"}
              className="absolute left-[1.8rem] top-[1.8rem] inline-flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full bg-white/92 text-[var(--color-text-primary)] shadow-[0_14px_30px_rgba(28,28,28,0.12)] transition-colors duration-200 hover:text-[var(--color-primary)]"
            >
              <ChevronLeft className="h-[2rem] w-[2rem]" />
            </Link>

            <div className="absolute right-[1.8rem] top-[1.8rem]">
              <span className="inline-flex rounded-full bg-[var(--color-primary)] px-[1.3rem] py-[0.75rem] text-[1.2rem] font-extrabold text-[var(--color-text-light)]">
                Popular
              </span>
            </div>

            <div className="absolute inset-x-[2rem] bottom-[2rem]">
              <h1 className="max-w-[14ch] text-[clamp(3rem,4.6vw,5rem)] leading-[1] font-extrabold tracking-[-0.05em] text-white">
                {event.title}
              </h1>
              <p className="mt-[1rem] max-w-[64rem] text-[1.5rem] leading-[1.7] text-white/84">
                {event.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[1.8rem] grid gap-[2rem] lg:grid-cols-[minmax(0,1.25fr)_minmax(32rem,0.62fr)]">
          <div className="space-y-[2rem]">
            <div className="flex flex-wrap gap-[1rem]">
              <span className={infoChipClassName}>
                <CalendarDays className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                {eventDate}
              </span>
              <span className={infoChipClassName}>
                <Clock3 className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                {eventTime}
              </span>
              <span className={infoChipClassName}>
                <MapPin className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                {event.venue}, {event.city}
              </span>
              <span className={infoChipClassName}>
                <Star className="h-[1.7rem] w-[1.7rem] fill-[#f59e0b] text-[#f59e0b]" />
                {rating} / 5
              </span>
              <span className={infoChipClassName}>
                <Users className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                {interestedCount.toLocaleString("en-IN")} interested
              </span>
            </div>

            <section className="rounded-[2.4rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
              <h2 className="flex items-center gap-[0.8rem] text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                <Info className="h-[1.9rem] w-[1.9rem] text-[var(--color-primary)]" />
                About this Event
              </h2>
              {aboutParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-[1.4rem] text-[1.6rem] leading-[1.8] text-[var(--color-text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="rounded-[2.4rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
              <h2 className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Ticket Pricing
              </h2>
              <div className="mt-[1.6rem] space-y-[1.6rem]">
                {Object.entries(zoneGroups).map(([groupName, zones]) => (
                  <div key={groupName} className="rounded-[1.8rem] border border-[rgba(28,28,28,0.06)] bg-[rgba(28,28,28,0.02)] p-[1.4rem]">
                    <p className="text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                      {groupName}
                    </p>
                    <div className="mt-[1rem] grid gap-[0.9rem]">
                      {zones.map((zone) => (
                        <div
                          key={`${groupName}-${zone.name}`}
                          className="flex flex-wrap items-center justify-between gap-[0.8rem] rounded-[1.4rem] bg-white px-[1.3rem] py-[1.1rem]"
                        >
                          <div>
                            <p className="text-[1.55rem] font-bold text-[var(--color-text-primary)]">{zone.name}</p>
                            <p className="mt-[0.25rem] text-[1.3rem] text-[var(--color-text-secondary)]">
                              {zone.availableSeats} left
                            </p>
                          </div>
                          <p className="text-[1.55rem] font-extrabold text-[var(--color-primary)]">
                            {formatCurrency(zone.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2.4rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
              <h2 className="flex items-center gap-[0.8rem] text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                <MapPin className="h-[1.9rem] w-[1.9rem] text-[var(--color-primary)]" />
                Venue
              </h2>
              <p className="mt-[1.2rem] text-[1.55rem] text-[var(--color-text-secondary)]">
                {event.venue}, {event.city}
              </p>
              <div className="mt-[1.6rem] aspect-[16/6] rounded-[2rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
            </section>

            <section className="rounded-[2.4rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
              <h2 className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Terms & Conditions
              </h2>
              <ul className="mt-[1.4rem] grid gap-[0.95rem] pl-[2rem] text-[1.55rem] leading-[1.75] text-[var(--color-text-secondary)]">
                {terms.map((term) => (
                  <li key={term} className="list-disc">
                    {term}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-[1.8rem] lg:sticky lg:top-[9rem] lg:self-start">
            <div className="rounded-[2.6rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
              <p className="text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                Price starts at
              </p>
              <p className="mt-[0.4rem] text-[4.2rem] font-extrabold tracking-[-0.05em] text-[var(--color-text-primary)]">
                {eventPrice}
              </p>

              <div className="mt-[1.8rem] space-y-[1rem] text-[1.5rem]">
                <div className="flex items-center justify-between gap-[1rem]">
                  <span className="text-[var(--color-text-secondary)]">Date</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{eventDate}</span>
                </div>
                <div className="flex items-center justify-between gap-[1rem]">
                  <span className="text-[var(--color-text-secondary)]">Time</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{eventTime}</span>
                </div>
                <div className="flex items-center justify-between gap-[1rem]">
                  <span className="text-[var(--color-text-secondary)]">Venue</span>
                  <span className="font-medium text-right text-[var(--color-text-primary)]">{event.venue}</span>
                </div>
              </div>

              <Link
                to={`/event/${event.id}/seats`}
                className="mt-[2rem] inline-flex h-[5rem] w-full items-center justify-center rounded-[1.6rem] bg-[var(--color-primary)] text-[1.7rem] font-extrabold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
              >
                Book Now
              </Link>

              <div className="mt-[1.4rem] grid grid-cols-2 gap-[1rem]">
                <button
                  type="button"
                  onClick={() => void toggleWishlist(event)}
                  className="inline-flex h-[4.6rem] items-center justify-center gap-[0.7rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.03)] text-[1.45rem] font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                >
                  <Heart className={`h-[1.7rem] w-[1.7rem] ${isLiked ? "fill-current text-[var(--color-primary)]" : ""}`} />
                  Wishlist
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.subtitle,
                        url: window.location.href,
                      });
                      return;
                    }

                    navigator.clipboard?.writeText(window.location.href);
                  }}
                  className="inline-flex h-[4.6rem] items-center justify-center gap-[0.7rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.03)] text-[1.45rem] font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                >
                  <Share2 className="h-[1.7rem] w-[1.7rem]" />
                  Share
                </button>
              </div>
            </div>

            {suggestedEvent ? (
              <div className="rounded-[2.6rem] border border-[rgba(28,28,28,0.06)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
                <h3 className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  You might also like
                </h3>
                <Link to={`/event/${suggestedEvent.id}`} className="mt-[1.6rem] flex gap-[1.2rem]">
                  <img
                    src={suggestedEvent.poster || "/fallback.jpg"}
                    alt={suggestedEvent.title}
                    className="h-[8.4rem] w-[8.4rem] rounded-[1.4rem] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[1.5rem] font-bold leading-[1.4] text-[var(--color-text-primary)]">
                      {suggestedEvent.title}
                    </p>
                    <p className="mt-[0.5rem] text-[1.25rem] text-[var(--color-text-secondary)]">
                      {formatDate(suggestedEvent.date)}
                    </p>
                    <p className="mt-[0.25rem] text-[1.35rem] font-bold text-[var(--color-text-primary)]">
                      {formatCurrency(suggestedEvent.price)}
                    </p>
                  </div>
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
};
