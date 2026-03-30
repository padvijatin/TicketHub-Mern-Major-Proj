import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth.jsx";
import { getAdminBookings, updateAdminBooking } from "../../utils/adminApi.js";

const BookingManagement = ({ role = "admin" }) => {
  const queryClient = useQueryClient();
  const { authorizationToken } = useAuth();
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["admin-bookings", authorizationToken, role],
    queryFn: () => getAdminBookings(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const updateMutation = useMutation({
    mutationFn: ({ bookingId, payload }) => updateAdminBooking({ authorizationToken, bookingId, payload }),
    onSuccess: () => {
      toast.success("Booking updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to update booking right now");
    },
  });

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          {role === "admin" ? "Booking Management" : "Bookings For My Events"}
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          {role === "admin"
            ? "Track booking status, customer details, and payment progress."
            : "Review bookings and payment status for the events you organize."}
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[110rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Booking ID</th>
                <th className="py-[1rem] font-semibold">Customer</th>
                <th className="py-[1rem] font-semibold">Event</th>
                <th className="py-[1rem] font-semibold">Seats</th>
                <th className="py-[1rem] font-semibold">Amount</th>
                <th className="py-[1rem] font-semibold">Method</th>
                <th className="py-[1rem] font-semibold">Reference</th>
                <th className="py-[1rem] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Loading bookings...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="8" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Unable to load bookings right now.</td>
                </tr>
              ) : bookings.length ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                    <td className="py-[1.3rem] text-[1.35rem] font-mono text-[var(--color-text-primary)]">{booking.bookingId}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{booking.user?.username || booking.user?.email || "Unknown"}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{booking.event?.title || "Event unavailable"}</td>
                    <td className="py-[1.3rem] text-[1.2rem] text-[var(--color-text-primary)]">{booking.seats?.length ? booking.seats.join(", ") : "-"}</td>
                    <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">Rs {Number(booking.finalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="py-[1.3rem] text-[1.35rem] capitalize text-[var(--color-text-primary)]">{booking.paymentMethod || "upi"}</td>
                    <td className="py-[1.3rem] text-[1.2rem] font-mono text-[var(--color-text-secondary)]">{booking.paymentReference || "-"}</td>
                    <td className="py-[1.3rem]">
                      <select
                        value={booking.paymentStatus || "paid"}
                        onChange={(event) => updateMutation.mutate({ bookingId: booking.id, payload: { paymentStatus: event.target.value } })}
                        className="rounded-[1rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold capitalize text-[var(--color-text-primary)]"
                      >
                        <option value="paid">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
