import {
  Calendar,
  IndianRupee,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 220000, bookings: 160 },
  { month: "Feb", revenue: 280000, bookings: 210 },
  { month: "Mar", revenue: 340000, bookings: 265 },
  { month: "Apr", revenue: 310000, bookings: 240 },
  { month: "May", revenue: 390000, bookings: 298 },
  { month: "Jun", revenue: 430000, bookings: 332 },
];

const recentBookings = [
  {
    id: "BK-1024",
    userName: "Aarav Mehta",
    eventTitle: "Friday Night Comedy",
    amount: 1200,
    status: "confirmed",
  },
  {
    id: "BK-1042",
    userName: "Riya Kapoor",
    eventTitle: "Rock Arena Live",
    amount: 2400,
    status: "pending",
  },
  {
    id: "BK-1055",
    userName: "Kabir Sharma",
    eventTitle: "Cricket Fan Night",
    amount: 900,
    status: "confirmed",
  },
  {
    id: "BK-1061",
    userName: "Sara Khan",
    eventTitle: "Indie Music Fest",
    amount: 1800,
    status: "cancelled",
  },
  {
    id: "BK-1073",
    userName: "Ishaan Roy",
    eventTitle: "Standup Special",
    amount: 1500,
    status: "confirmed",
  },
];

const baseStats = [
  {
    label: "Total Revenue",
    value: "Rs 14.6L",
    icon: IndianRupee,
    change: "+18.2%",
    up: true,
  },
  {
    label: "Total Bookings",
    value: "8,420",
    icon: Ticket,
    change: "+12.5%",
    up: true,
  },
  {
    label: "Total Users",
    value: "12,180",
    icon: Users,
    change: "+8.1%",
    up: true,
  },
  {
    label: "Active Events",
    value: "128",
    icon: Calendar,
    change: "-3",
    up: false,
  },
];

const DashboardOverview = ({ role }) => {
  const stats = role === "admin" ? baseStats : baseStats.filter((_, index) => index !== 2);

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          {role === "admin" ? "Admin Dashboard" : "Organizer Dashboard"}
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          Overview of your platform performance
        </p>
      </div>

      <div className={`grid gap-[1.4rem] ${role === "admin" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]"
            >
              <div className="flex items-center justify-between gap-[1rem]">
                <div>
                  <p className="text-[1.3rem] text-[var(--color-text-secondary)]">{stat.label}</p>
                  <p className="mt-[0.6rem] text-[2.8rem] font-extrabold text-[var(--color-text-primary)]">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[1.3rem] bg-[rgba(248,68,100,0.1)] text-[var(--color-primary)]">
                  <Icon className="h-[2rem] w-[2rem]" />
                </div>
              </div>

              <div className="mt-[1rem] flex items-center gap-[0.5rem]">
                {stat.up ? (
                  <TrendingUp className="h-[1.35rem] w-[1.35rem] text-[var(--color-success)]" />
                ) : (
                  <TrendingDown className="h-[1.35rem] w-[1.35rem] text-[var(--color-error)]" />
                )}
                <span
                  className={`text-[1.15rem] font-semibold ${
                    stat.up ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-[1.15rem] text-[var(--color-text-secondary)]">
                  vs last month
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-[2rem] lg:grid-cols-2">
        <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Revenue Trend</h2>
          <div className="mt-[2rem] flex h-[26rem] items-end gap-[1rem]">
            {revenueData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-[0.8rem]">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-[1rem] bg-[var(--color-primary)]"
                    style={{ height: `${(item.revenue / 430000) * 100}%` }}
                  />
                </div>
                <span className="text-[1.15rem] font-medium text-[var(--color-text-secondary)]">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Bookings Trend</h2>
          <div className="mt-[2rem] flex h-[26rem] items-end gap-[1rem]">
            {revenueData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-[0.8rem]">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-[1rem] bg-[var(--color-accent)]"
                    style={{ height: `${(item.bookings / 332) * 100}%` }}
                  />
                </div>
                <span className="text-[1.15rem] font-medium text-[var(--color-text-secondary)]">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Recent Bookings</h2>
        <div className="mt-[1.6rem] overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left">
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
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                  <td className="py-[1.25rem] text-[1.25rem] font-mono text-[var(--color-text-primary)]">
                    {booking.id}
                  </td>
                  <td className="py-[1.25rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {booking.userName}
                  </td>
                  <td className="py-[1.25rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {booking.eventTitle}
                  </td>
                  <td className="py-[1.25rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                    Rs {booking.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-[1.25rem]">
                    <span
                      className={`inline-flex rounded-full px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-[rgba(34,197,94,0.12)] text-[var(--color-success)]"
                          : booking.status === "cancelled"
                            ? "bg-[rgba(239,68,68,0.12)] text-[var(--color-error)]"
                            : "bg-[rgba(245,158,11,0.12)] text-[var(--color-warning)]"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};

export default DashboardOverview;
