const coupons = [
  { code: "SUMMER20", discount: "20% Off", usage: "184", status: "Active" },
  { code: "FIRSTSHOW", discount: "Rs 150 Off", usage: "62", status: "Active" },
  { code: "WEEKEND", discount: "10% Off", usage: "31", status: "Paused" },
];

const CouponManagement = () => {
  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          Coupon Management
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          Create and manage promotional coupon codes
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="mb-[1.6rem] flex items-center justify-between gap-[1rem]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Available Coupons</h2>
          <button
            type="button"
            className="rounded-[1.2rem] bg-[var(--color-primary)] px-[1.4rem] py-[0.85rem] text-[1.25rem] font-semibold text-white"
          >
            Add Coupon
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Code</th>
                <th className="py-[1rem] font-semibold">Discount</th>
                <th className="py-[1rem] font-semibold">Usage</th>
                <th className="py-[1rem] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                  <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                    {coupon.code}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {coupon.discount}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {coupon.usage}
                  </td>
                  <td className="py-[1.3rem]">
                    <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[var(--color-primary)]">
                      {coupon.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;
