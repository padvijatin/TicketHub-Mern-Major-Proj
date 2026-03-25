import { EventCard } from "./EventCard.jsx";

const SkeletonCard = () => (
  <article className="overflow-hidden rounded-[2.2rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[var(--shadow-soft)]">
    <div className="aspect-[2/3] animate-pulse bg-[linear-gradient(180deg,#f3f4f6_0%,#e5e7eb_100%)]" />
    <div className="grid gap-[1rem] p-[1.6rem]">
      <div className="h-[1.8rem] w-[68%] animate-pulse rounded-full bg-[#e5e7eb]" />
      <div className="h-[1.4rem] w-[52%] animate-pulse rounded-full bg-[#ececec]" />
    </div>
  </article>
);

export const ListingGrid = ({
  items,
  isLoading,
  error,
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-3",
  emptyMessage = "No listings are available right now.",
  skeletonCount = 3,
}) => {
  if (isLoading) {
    return (
      <div className={`grid gap-[1.8rem] ${columnsClassName}`}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2.2rem] border border-[rgba(248,68,100,0.14)] bg-[rgba(248,68,100,0.05)] px-[1.8rem] py-[1.6rem] text-[1.5rem] text-[var(--color-text-secondary)]">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[2.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.8rem] py-[1.6rem] text-[1.5rem] text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid gap-[1.8rem] ${columnsClassName}`}>
      {items.map((item) => (
        <EventCard key={item.id || item.title} event={item} />
      ))}
    </div>
  );
};
