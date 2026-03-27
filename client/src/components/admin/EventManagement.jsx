const events = [
  {
    title: "Friday Night Comedy",
    type: "Comedy",
    city: "Mumbai",
    date: "12 Apr 2026",
    status: "Published",
  },
  {
    title: "Rock Arena Live",
    type: "Concert",
    city: "Bangalore",
    date: "18 Apr 2026",
    status: "Draft",
  },
  {
    title: "Cricket Fan Night",
    type: "Sports",
    city: "Delhi",
    date: "22 Apr 2026",
    status: "Published",
  },
];

const EventManagement = ({ role }) => {
  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          {role === "admin" ? "Event Management" : "My Events"}
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          {role === "admin"
            ? "Manage and review all listed events"
            : "Create and manage your listed events"}
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="mb-[1.6rem] flex items-center justify-between gap-[1rem]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">All Events</h2>
          <button
            type="button"
            className="rounded-[1.2rem] bg-[var(--color-primary)] px-[1.4rem] py-[0.85rem] text-[1.25rem] font-semibold text-white"
          >
            Add Event
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Event</th>
                <th className="py-[1rem] font-semibold">Type</th>
                <th className="py-[1rem] font-semibold">City</th>
                <th className="py-[1rem] font-semibold">Date</th>
                <th className="py-[1rem] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.title} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                  <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                    {event.title}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {event.type}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {event.city}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {event.date}
                  </td>
                  <td className="py-[1.3rem]">
                    <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[var(--color-primary)]">
                      {event.status}
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

export default EventManagement;
