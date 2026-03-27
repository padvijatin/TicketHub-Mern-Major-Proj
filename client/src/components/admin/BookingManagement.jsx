const bookings = [
  {
    id: "BK-1024",
    customer: "Aarav Mehta",
    event: "Friday Night Comedy",
    amount: "Rs 1,200",
    status: "Confirmed",
  },
  {
    id: "BK-1042",
    customer: "Riya Kapoor",
    event: "Rock Arena Live",
    amount: "Rs 2,400",
    status: "Pending",
  },
  {
    id: "BK-1061",
    customer: "Sara Khan",
    event: "Indie Music Fest",
    amount: "Rs 1,800",
    status: "Cancelled",
  },
];

const BookingManagement = () => {
  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          Booking Management
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          Track booking status and payment progress
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[72rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Booking ID</th>
                <th className="py-[1rem] font-semibold">Customer</th>
                <th className="py-[1rem] font-semibold">Event</th>
                <th className="py-[1rem] font-semibold">Amount</th>
                <th className="py-[1rem] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                  <td className="py-[1.3rem] text-[1.35rem] font-mono text-[var(--color-text-primary)]">
                    {booking.id}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {booking.customer}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {booking.event}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                    {booking.amount}
                  </td>
                  <td className="py-[1.3rem]">
                    <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[var(--color-primary)]">
                      {booking.status}
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

export default BookingManagement;
