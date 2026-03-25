import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

const routeByType = {
  movie: "/movies",
  sports: "/sports",
  event: "/events",
};

const gradientByType = {
  movie: "bg-[linear-gradient(135deg,#181032_0%,#7b3fe4_52%,#f84464_100%)]",
  sports: "bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_52%,#22c55e_100%)]",
  event: "bg-[linear-gradient(135deg,#1c1c1c_0%,#7b3fe4_46%,#f84464_100%)]",
};

const formatDate = (value) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const formatPrice = (value) => {
  if (typeof value !== "number") {
    return value;
  }

  return `From Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
};

export const EventCard = ({ event }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const destination = event.to || routeByType[event.contentType] || "/events";
  const fallbackClassName = useMemo(
    () => gradientByType[event.contentType] || gradientByType.event,
    [event.contentType]
  );

  return (
    <Link to={destination} className="group block">
      <article className="overflow-hidden rounded-[2.2rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-[0.4rem] hover:border-[rgba(248,68,100,0.18)]">
        <div className={`relative aspect-[2/3] overflow-hidden ${fallbackClassName}`}>
          {!imageFailed && event.poster ? (
            <img
              src={event.poster}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              onError={() => setImageFailed(true)}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,0.06)_0%,rgba(28,28,28,0.12)_34%,rgba(28,28,28,0.88)_100%)]" />

          <div className="absolute left-[1.4rem] top-[1.4rem]">
            <span className="rounded-full bg-[var(--color-primary)] px-[1.1rem] py-[0.7rem] text-[1.1rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-light)]">
              {event.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-[1.6rem] text-[var(--color-text-light)]">
            <h3 className="text-[2.1rem] leading-[1.15] font-extrabold tracking-[-0.02em]">
              {event.title}
            </h3>
            <div className="mt-[0.9rem] flex flex-wrap gap-[1.2rem] text-[1.2rem] text-white/84">
              <span className="inline-flex items-center gap-[0.5rem]">
                <Calendar className="h-[1.4rem] w-[1.4rem]" />
                {formatDate(event.date)}
              </span>
              <span className="inline-flex items-center gap-[0.5rem]">
                <MapPin className="h-[1.4rem] w-[1.4rem]" />
                {event.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-[1rem] p-[1.6rem]">
          <span className="text-[1.8rem] font-extrabold text-[var(--color-primary)]">
            {formatPrice(event.price)}
          </span>
          <span className="truncate text-[1.3rem] font-semibold text-[var(--color-text-secondary)]">
            {event.venue}
          </span>
        </div>
      </article>
    </Link>
  );
};
