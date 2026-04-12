import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calendar,
  IndianRupee,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../store/auth-context.jsx";
import { getAdminDashboard } from "../../utils/adminApi.js";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const formatCompact = (value) => {
  const number = Number(value || 0);

  if (number >= 100000) {
    return `${(number / 100000).toFixed(1)}L`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toLocaleString("en-IN");
};

const DashboardOverview = ({ role }) => {
  const { authorizationToken } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard", authorizationToken, role],
    queryFn: () => getAdminDashboard(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const stats = data?.stats || {
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeEvents: 0,
  };
  const trends = data?.trends || [];
  const recentBookings = data?.recentBookings || [];

  const statCards = [
    {
      label: role === "admin" ? "Total Revenue" : "Your Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
    },
    {
      label: role === "admin" ? "Total Bookings" : "Event Bookings",
      value: formatCompact(stats.totalBookings),
      icon: Ticket,
    },
    {
      label: role === "admin" ? "Total Users" : "Customers",
      value: formatCompact(stats.totalUsers),
      icon: Users,
    },
    {
      label: role === "admin" ? "Active Events" : "Live Events",
      value: formatCompact(stats.activeEvents),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          {role === "admin" ? "Admin Dashboard" : "Organizer Dashboard"}
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          {role === "admin"
            ? "Live platform performance across events, bookings, and users."
            : "Live performance for the events you own, including bookings and revenue."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[1.4rem] sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
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
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className="flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[1.3rem] bg-[rgba(248,68,100,0.1)] text-[var(--color-primary)]">
                  <Icon className="h-[2rem] w-[2rem]" />
                </div>
              </div>

              <div className="mt-[1rem] flex items-center gap-[0.5rem] text-[1.15rem] text-[var(--color-text-secondary)]">
                <TrendingUp className="h-[1.35rem] w-[1.35rem] text-[var(--color-success)]" />
                {isLoading ? "Refreshing metrics..." : "Live data from your current database"}
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-[2rem] lg:grid-cols-2">
        <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Revenue Trend</h2>
          <div className="mt-[2rem] h-[28rem]">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-[1.6rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
            ) : isError ? (
              <div className="grid h-full place-items-center text-[1.4rem] text-[var(--color-text-secondary)]">Unable to load revenue trend.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f84464" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f84464" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(28,28,28,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCompact(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#f84464" strokeWidth={3} fill="url(#adminRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">Bookings Trend</h2>
          <div className="mt-[2rem] h-[28rem]">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-[1.6rem] bg-[linear-gradient(180deg,#eceff3_0%,#e2e8f0_100%)]" />
            ) : isError ? (
              <div className="grid h-full place-items-center text-[1.4rem] text-[var(--color-text-secondary)]">Unable to load booking trend.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(28,28,28,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => Number(value || 0).toLocaleString("en-IN")} />
                  <Bar dataKey="bookings" radius={[10, 10, 0, 0]} fill="#1c1c1c" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>
      </div>

      <article className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">
          {role === "admin" ? "Recent Bookings" : "Recent Bookings On Your Events"}
        </h2>
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Loading recent bookings...</td>
                </tr>
              ) : recentBookings.length ? (
                recentBookings.map((booking) => {
                  const status = String(booking.paymentStatus || "paid").toLowerCase();
                  const statusClassName =
                    status === "paid"
                      ? "bg-[rgba(34,197,94,0.12)] text-[var(--color-success)]"
                      : status === "failed"
                        ? "bg-[rgba(239,68,68,0.12)] text-[var(--color-error)]"
                        : "bg-[rgba(245,158,11,0.12)] text-[var(--color-warning)]";

                  return (
                    <tr key={booking.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                      <td className="py-[1.25rem] text-[1.25rem] font-mono text-[var(--color-text-primary)]">{booking.bookingId}</td>
                      <td className="py-[1.25rem] text-[1.35rem] text-[var(--color-text-primary)]">{booking.user?.username || booking.user?.email || "Unknown"}</td>
                      <td className="py-[1.25rem] text-[1.35rem] text-[var(--color-text-primary)]">{booking.event?.title || "Event unavailable"}</td>
                      <td className="py-[1.25rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">{formatCurrency(booking.finalAmount)}</td>
                      <td className="py-[1.25rem]">
                        <span className={`inline-flex rounded-full px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold ${statusClassName}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};

export default DashboardOverview;
