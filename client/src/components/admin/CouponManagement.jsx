import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth.jsx";
import { createAdminCoupon, getAdminCoupons } from "../../utils/adminApi.js";

const initialFormState = {
  code: "",
  discountType: "percentage",
  discountValue: "0",
  maxDiscount: "",
  minOrderAmount: "0",
  usageLimit: "100",
  expiryDate: "",
};

const rupeeSymbol = "\u20B9";
const bulletSymbol = "\u2022";
const infinitySymbol = "\u221e";

const formatCurrency = (value) => `${rupeeSymbol}${Number(value || 0).toLocaleString("en-IN")}`;

const formatExpiryDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTodayDateValue = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

const CouponManagement = () => {
  const queryClient = useQueryClient();
  const { authorizationToken } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);

  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ["admin-coupons", authorizationToken],
    queryFn: () => getAdminCoupons(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createAdminCoupon({ authorizationToken, payload }),
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setFormState(initialFormState);
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to create coupon right now");
    },
  });

  const sortedCoupons = useMemo(() => {
    return [...coupons].sort((left, right) => {
      const leftPriority = left.isExpired || !left.isActive ? 1 : 0;
      const rightPriority = right.isExpired || !right.isActive ? 1 : 0;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return new Date(left.expiryDate || 0).getTime() - new Date(right.expiryDate || 0).getTime();
    });
  }, [coupons]);

  const handleInputChange = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const closeCreateModal = () => {
    if (createMutation.isPending) return;
    setIsCreateOpen(false);
    setFormState(initialFormState);
  };

  const handleCreateCoupon = (event) => {
    event.preventDefault();

    const normalizedCode = formState.code.trim().toUpperCase();
    const discountValue = Number(formState.discountValue || 0);
    const minOrderAmount = Number(formState.minOrderAmount || 0);
    const usageLimit = formState.usageLimit === "" ? null : Number(formState.usageLimit || 0);
    const maxDiscount = formState.maxDiscount === "" ? null : Number(formState.maxDiscount || 0);

    if (!normalizedCode) {
      toast.error("Coupon code is required");
      return;
    }

    if (discountValue <= 0) {
      toast.error("Discount must be greater than zero");
      return;
    }

    if (formState.discountType === "percentage" && discountValue > 100) {
      toast.error("Percentage discount cannot be more than 100");
      return;
    }

    if (usageLimit != null && usageLimit < 1) {
      toast.error("Max uses must be at least 1");
      return;
    }

    if (minOrderAmount < 0) {
      toast.error("Minimum order cannot be negative");
      return;
    }

    if (maxDiscount != null && maxDiscount < 0) {
      toast.error("Max discount cannot be negative");
      return;
    }

    createMutation.mutate({
      code: normalizedCode,
      discountType: formState.discountType,
      discountValue,
      maxDiscount,
      minOrderAmount,
      usageLimit,
      expiryDate: formState.expiryDate,
    });
  };

  return (
    <div className="space-y-[2rem]">
      <div className="flex flex-wrap items-start justify-between gap-[1.6rem]">
        <div>
          <h1 className="text-[2.8rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
            Coupon Management
          </h1>
          <p className="mt-[0.45rem] text-[1.45rem] text-[var(--color-text-secondary)]">
            {sortedCoupons.length} {sortedCoupons.length === 1 ? "coupon" : "coupons"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-[0.7rem] rounded-[1.6rem] bg-[var(--color-primary)] px-[1.9rem] py-[1.15rem] text-[1.35rem] font-semibold text-white shadow-[0_16px_28px_rgba(248,68,100,0.2)] transition-transform duration-150 hover:translate-y-[-1px] active:scale-[0.98]"
        >
          <Plus className="h-[1.6rem] w-[1.6rem]" />
          Create Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-[1.8rem] xl:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[23rem] animate-pulse rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[0_16px_36px_rgba(28,28,28,0.06)]"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] text-[1.45rem] text-[var(--color-text-secondary)] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          Unable to load coupons right now.
        </div>
      ) : sortedCoupons.length ? (
        <div className="grid gap-[2rem] xl:grid-cols-2">
          {sortedCoupons.map((coupon) => {
            const usedCount = Number(coupon.usedCount || 0);
            const usageLimit = coupon.usageLimit == null ? null : Number(coupon.usageLimit || 0);
            const usagePercent = usageLimit && usageLimit > 0 ? Math.min(100, Math.round((usedCount / usageLimit) * 100)) : 0;
            const isExpired = Boolean(coupon.isExpired);
            const statusLabel = isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive";
            const statusClassName = isExpired
              ? "bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]"
              : coupon.isActive
                ? "bg-[rgba(248,68,100,0.12)] text-[var(--color-primary)]"
                : "bg-[rgba(28,28,28,0.08)] text-[var(--color-text-secondary)]";
            const usageLabel = usageLimit ? `${usedCount}/${usageLimit} used` : `${usedCount}/${infinitySymbol} used`;

            return (
              <article
                key={coupon.id}
                className="rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2.3rem] shadow-[0_12px_32px_rgba(28,28,28,0.05)]"
              >
                <div className="flex items-start justify-between gap-[1rem]">
                  <div className="flex flex-wrap items-center gap-[1.2rem]">
                    <h2 className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                      {coupon.code}
                    </h2>
                    <span className={`inline-flex rounded-full px-[1.2rem] py-[0.45rem] text-[1.2rem] font-semibold ${statusClassName}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full text-[var(--color-text-primary)] transition-colors hover:bg-[rgba(28,28,28,0.04)]"
                    aria-label={`Coupon ${coupon.code}`}
                  >
                    <MoreHorizontal className="h-[1.8rem] w-[1.8rem]" />
                  </button>
                </div>

                <div className="mt-[2.2rem] flex flex-wrap items-end gap-x-[1rem] gap-y-[0.6rem]">
                  <span className="text-[3rem] font-extrabold tracking-[-0.04em] text-[var(--color-primary)]">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                  </span>
                  <span className="pb-[0.35rem] text-[1.7rem] text-[var(--color-text-primary)]">off</span>
                  <span className="pb-[0.35rem] text-[1.5rem] text-[var(--color-text-secondary)]">
                    {bulletSymbol} Min {formatCurrency(coupon.minOrderAmount || 0)}
                  </span>
                </div>

                <div className="mt-[1.9rem] flex items-center justify-between gap-[1rem] text-[1.45rem] text-[var(--color-text-primary)]">
                  <span>{usageLabel}</span>
                  <span>{usageLimit ? `${usagePercent}%` : "Active"}</span>
                </div>

                <div className="mt-[0.8rem] h-[0.8rem] overflow-hidden rounded-full bg-[rgba(28,28,28,0.06)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
                    style={{ width: `${usageLimit ? usagePercent : 100}%` }}
                  />
                </div>

                <p className="mt-[1.7rem] text-[1.45rem] text-[var(--color-text-secondary)]">
                  Expires: {formatExpiryDate(coupon.expiryDate)}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] text-[1.45rem] text-[var(--color-text-secondary)] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          No coupons found yet.
        </div>
      )}

      {isCreateOpen ? (
        <div className="fixed inset-0 z-[1300] bg-[rgba(28,28,28,0.35)] px-[1.6rem] py-[3rem]" onClick={closeCreateModal}>
          <div className="flex min-h-full items-center justify-center">
            <div
              className="w-full max-w-[61rem] rounded-[2.2rem] bg-white p-[2.8rem] shadow-[0_24px_54px_rgba(28,28,28,0.18)] sm:p-[3.2rem]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-[1rem]">
                <h3 className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                  Create Coupon
                </h3>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="inline-flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[rgba(28,28,28,0.04)] active:scale-[0.94]"
                  aria-label="Close create coupon modal"
                >
                  <X className="h-[1.8rem] w-[1.8rem]" />
                </button>
              </div>

              <form className="mt-[2.4rem] space-y-[1.9rem]" onSubmit={handleCreateCoupon}>
                <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                  <span>
                    Coupon Code <span className="text-[var(--color-primary)]">*</span>
                  </span>
                  <input
                    type="text"
                    value={formState.code}
                    onChange={(event) => handleInputChange("code", event.target.value.toUpperCase())}
                    placeholder="SUMMER50"
                    className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                    required
                  />
                </label>

                <div className="grid gap-[1.6rem] sm:grid-cols-2">
                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    Type
                    <select
                      value={formState.discountType}
                      onChange={(event) => handleInputChange("discountType", event.target.value)}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </label>

                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    <span>
                      Discount <span className="text-[var(--color-primary)]">*</span>
                    </span>
                    <input
                      type="number"
                      min="0"
                      max={formState.discountType === "percentage" ? "100" : undefined}
                      value={formState.discountValue}
                      onChange={(event) => handleInputChange("discountValue", event.target.value)}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-[1.6rem] sm:grid-cols-2">
                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    Max Uses
                    <input
                      type="number"
                      min="1"
                      value={formState.usageLimit}
                      onChange={(event) => handleInputChange("usageLimit", event.target.value)}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                    />
                  </label>

                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    Min Order ({rupeeSymbol})
                    <input
                      type="number"
                      min="0"
                      value={formState.minOrderAmount}
                      onChange={(event) => handleInputChange("minOrderAmount", event.target.value)}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                    />
                  </label>
                </div>

                <div className="grid gap-[1.6rem] sm:grid-cols-2">
                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    {formState.discountType === "percentage" ? `Max Discount (${rupeeSymbol})` : "Max Discount (optional)"}
                    <input
                      type="number"
                      min="0"
                      value={formState.maxDiscount}
                      onChange={(event) => handleInputChange("maxDiscount", event.target.value)}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                    />
                  </label>

                  <label className="grid gap-[0.8rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
                    Expiry Date
                    <input
                      type="date"
                      value={formState.expiryDate}
                      onChange={(event) => handleInputChange("expiryDate", event.target.value)}
                      min={getTodayDateValue()}
                      className="h-[4.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.4rem] text-[1.45rem] font-medium outline-none transition-colors focus:border-[rgba(248,68,100,0.35)]"
                      required
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-[1rem] pt-[0.8rem]">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white px-[2.3rem] py-[1.05rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[rgba(28,28,28,0.03)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-[1.4rem] bg-[var(--color-primary)] px-[2.3rem] py-[1.05rem] text-[1.35rem] font-semibold text-white shadow-[0_16px_28px_rgba(248,68,100,0.18)] transition-transform duration-150 hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CouponManagement;
