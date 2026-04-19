import { useNavigate } from "react-router-dom";
import { Ticket, X } from "lucide-react";

export const BookingSummary = ({
  selectedItems,
  summary,
  total,
  currency = "Rs ",
  maxItems,
  onRemove,
  onClear,
  eventId,
  eventSnapshot = null,
  hideChips = false,
  bookingMeta = {},
}) => {
  const navigate = useNavigate();

  return (
    <aside className="space-y-[1.6rem]">
      <div className="sticky top-[9rem] rounded-[2.2rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[var(--shadow-soft)]">
        <h2 className="flex items-center gap-[0.8rem] text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
          <Ticket className="h-[2rem] w-[2rem] text-[var(--color-primary)]" />
          Booking Summary
        </h2>

        {!selectedItems.length ? (
          <p className="py-[3rem] text-center text-[1.45rem] leading-[1.6] text-[var(--color-text-secondary)]">
            Select tickets to start building your booking.
          </p>
        ) : (
          <div className="mt-[1.8rem] space-y-[1.6rem]">
            {!hideChips ? (
              <div className="flex flex-wrap gap-[0.8rem]">
                {selectedItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onRemove(item)}
                    className="inline-flex items-center gap-[0.6rem] rounded-full bg-[rgba(248,68,100,0.08)] px-[1rem] py-[0.55rem] text-[1.15rem] font-bold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[rgba(248,68,100,0.14)]"
                  >
                    {item}
                    <X className="h-[1.2rem] w-[1.2rem]" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="space-y-[1rem] border-t border-[rgba(28,28,28,0.08)] pt-[1.6rem] text-[1.35rem]">
              {summary.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-[1rem] text-[var(--color-text-secondary)]">
                  <span>
                    {item.label} x {item.count}
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {item.currency}
                    {(item.count * item.price).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(28,28,28,0.08)] pt-[1.6rem]">
              <span className="text-[1.4rem] text-[var(--color-text-secondary)]">Total</span>
              <span className="text-[2.5rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
                {currency}
                {total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/event/${eventId}/payment`, {
                  state: { items: selectedItems, summary, total, currency, bookingMeta, eventSnapshot },
                })
              }
              className="inline-flex h-[4.8rem] w-full items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] text-[1.5rem] font-bold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
            >
              Proceed to Payment
            </button>

            <button
              type="button"
              onClick={onClear}
              className="w-full text-center text-[1.3rem] font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
            >
              Clear selection
            </button>
          </div>
        )}

        <p className="mt-[1.8rem] text-center text-[1.1rem] text-[var(--color-text-secondary)]">
          Max {maxItems} tickets per booking
        </p>
      </div>
    </aside>
  );
};
