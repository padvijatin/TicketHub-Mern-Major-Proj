import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "../../utils/couponApi.js";

const CouponManagement = () => {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => getCoupons(),
  });

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          Coupon Management
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          Review active promotional coupon codes from the live collection
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="mb-[1.6rem] flex items-center justify-between gap-[1rem]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Available Coupons</h2>
          <span className="rounded-[1.2rem] bg-[rgba(248,68,100,0.08)] px-[1.2rem] py-[0.85rem] text-[1.2rem] font-semibold text-[var(--color-primary)]">
            Live Data
          </span>
        </div>

        {isLoading ? (
          <div className="h-[18rem] animate-pulse rounded-[1.6rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[72rem] text-left">
              <thead>
                <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                  <th className="py-[1rem] font-semibold">Code</th>
                  <th className="py-[1rem] font-semibold">Discount</th>
                  <th className="py-[1rem] font-semibold">Min Amount</th>
                  <th className="py-[1rem] font-semibold">Usage</th>
                  <th className="py-[1rem] font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                    <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                      {coupon.code}
                    </td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                      {coupon.offerLabel}
                    </td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                      Rs {Number(coupon.minOrderAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                      {coupon.usedCount} / {coupon.usageLimit ?? "Unlimited"}
                    </td>
                    <td className="py-[1.3rem]">
                      <span className="inline-flex rounded-full bg-[rgba(34,197,94,0.12)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[#15803d]">
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
