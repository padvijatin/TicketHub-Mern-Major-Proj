const users = [
  {
    name: "Aarav Mehta",
    email: "aarav@tickethub.com",
    role: "User",
    status: "Active",
  },
  {
    name: "Riya Kapoor",
    email: "riya@tickethub.com",
    role: "Organizer",
    status: "Active",
  },
  {
    name: "Kabir Sharma",
    email: "kabir@tickethub.com",
    role: "User",
    status: "Blocked",
  },
];

const UserManagement = () => {
  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">
          User Management
        </h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          Manage roles and monitor account activity
        </p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Name</th>
                <th className="py-[1rem] font-semibold">Email</th>
                <th className="py-[1rem] font-semibold">Role</th>
                <th className="py-[1rem] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                  <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">
                    {user.name}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {user.email}
                  </td>
                  <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">
                    {user.role}
                  </td>
                  <td className="py-[1.3rem]">
                    <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[var(--color-primary)]">
                      {user.status}
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

export default UserManagement;
