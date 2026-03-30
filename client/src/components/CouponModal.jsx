import { useQuery } from "@tanstack/react-query";
import { Copy, TicketPercent, X } from "lucide-react";
import { toast } from "react-toastify";
import { getCoupons } from "../utils/couponApi.js";
import { useAuth } from "../store/auth.jsx";

export const CouponModal = ({ isOpen, onClose }) => {
  const { authorizationToken } = useAuth();
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["navbar-coupons", authorizationToken],
    queryFn: () => getCoupons({ authorizationToken }),
    enabled: isOpen,
  });

  if (!isOpen) {
    return null;
  }

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied`);
    } catch {
      toast.error("Unable to copy coupon right now");
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-[rgba(15,23,42,0.52)] px-[1.6rem] py-[2rem] backdrop-blur-[4px]">
      <div className="w-full max-w-[74rem] overflow-hidden rounded-[2.6rem] border border-[rgba(255,255,255,0.24)] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-[1.2rem] border-b border-[rgba(28,28,28,0.08)] px-[2rem] py-[1.8rem]">
          <div>
            <p className="text-[1.15rem] font-extrabold uppercase tracking-[0.1em] text-[var(--color-primary)]">
              TicketHub Offers
            </p>
            <h2 className="mt-[0.45rem] text-[2.1rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
              Live deals from your coupons collection
            </h2>
            <p className="mt-[0.45rem] text-[1.35rem] text-[var(--color-text-secondary)]">
              Copy a code here and apply it during checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[4.2rem] w-[4.2rem] shrink-0 items-center justify-center rounded-full border border-[rgba(28,28,28,0.08)] text-[var(--color-text-secondary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
            aria-label="Close coupons"
          >
            <X className="h-[1.9rem] w-[1.9rem]" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-[2rem] py-[2rem]">
          {isLoading ? (
            <div className="grid gap-[1.2rem] md:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-[15rem] animate-pulse rounded-[2rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
              ))}
            </div>
          ) : coupons.length ? (
            <div className="grid gap-[1.2rem] md:grid-cols-2">
              {coupons.map((coupon) => (
                <article
                  key={coupon.id}
                  className="rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-[linear-gradient(135deg,rgba(248,68,100,0.08)_0%,rgba(123,63,228,0.08)_100%)] p-[1.6rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]"
                >
                  <div className="flex items-start justify-between gap-[1rem]">
                    <span className="inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[1.4rem] bg-white text-[var(--color-primary)] shadow-[0_12px_24px_rgba(28,28,28,0.08)]">
                      <TicketPercent className="h-[2rem] w-[2rem]" />
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopy(coupon.code)}
                      className="inline-flex h-[4rem] items-center justify-center gap-[0.6rem] rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.2rem] text-[1.25rem] font-bold text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                    >
                      <Copy className="h-[1.5rem] w-[1.5rem]" />
                      Copy
                    </button>
                  </div>
                  <p className="mt-[1.3rem] text-[1.75rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">{coupon.code}</p>
                  <p className="mt-[0.45rem] text-[1.35rem] font-bold text-[var(--color-primary)]">{coupon.offerLabel}</p>
                  <div className="mt-[1rem] flex flex-wrap gap-[0.65rem] text-[1.1rem] text-[var(--color-text-secondary)]">
                    <span className="rounded-full bg-white px-[0.9rem] py-[0.45rem]">
                      Min Rs {Number(coupon.minOrderAmount || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-white px-[0.9rem] py-[0.45rem]">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.02)] px-[1.8rem] py-[2.4rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">
              No active offers are available right now.
            </div>
          )}
        </div>
      </div>
      <button type="button" aria-label="Close overlay" className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
