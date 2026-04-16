import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context.jsx";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../utils/adminApi.js";
import { getApiErrorMessage } from "../../utils/apiError.js";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { authorizationToken, user } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users", authorizationToken],
    queryFn: () => getAdminUsers(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, payload }) => updateAdminUser({ authorizationToken, userId, payload }),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, { fallbackMessage: "Unable to update user right now" }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteAdminUser({ authorizationToken, userId }),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, { fallbackMessage: "Unable to delete user right now" }));
    },
  });

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalizeText(searchValue);

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((item) => {
      const displayName = item.username || item.name || item.fullName;
      const phone = item.phone || item.mobile || item.phoneNumber;
      const searchableValues = [
        displayName,
        item.firstName,
        item.lastName,
        item.email,
        phone,
        item.role,
        item.status,
        item.id,
      ];

      return searchableValues.some((value) => normalizeText(value).includes(normalizedQuery));
    });
  }, [searchValue, users]);

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">User Management</h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">
          {filteredUsers.length} of {users.length} users
        </p>
      </div>

      <div className="max-w-[48rem]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-[1.4rem] top-1/2 h-[1.8rem] w-[1.8rem] -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by name, email, phone, role..."
            className="h-[4.8rem] w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white pl-[4.6rem] pr-[1.4rem] text-[1.4rem] text-[var(--color-text-primary)] outline-none shadow-[0_12px_30px_rgba(28,28,28,0.04)]"
          />
        </label>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[90rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Name</th>
                <th className="py-[1rem] font-semibold">Email</th>
                <th className="py-[1rem] font-semibold">Phone</th>
                <th className="py-[1rem] font-semibold">Bookings</th>
                <th className="py-[1rem] font-semibold">Role</th>
                <th className="py-[1rem] font-semibold">Status</th>
                <th className="py-[1rem] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Loading users...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Unable to load users right now.</td>
                </tr>
              ) : filteredUsers.length ? (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                    <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">{item.username}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{item.email}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{item.phone}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{Number(item.bookingCount || 0).toLocaleString("en-IN")}</td>
                    <td className="py-[1.3rem]">
                      <select
                        value={item.role}
                        onChange={(event) => updateMutation.mutate({ userId: item.id, payload: { role: event.target.value } })}
                        className="rounded-[1rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold capitalize text-[var(--color-text-primary)]"
                      >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-[1.3rem]">
                      <select
                        value={item.status || "active"}
                        onChange={(event) => updateMutation.mutate({ userId: item.id, payload: { status: event.target.value } })}
                        className="rounded-[1rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold capitalize text-[var(--color-text-primary)]"
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="py-[1.3rem]">
                      {item.id === user?.id ? (
                        <span className="text-[1.2rem] font-semibold text-[var(--color-text-secondary)]">Current admin</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="inline-flex items-center gap-[0.45rem] rounded-[1rem] border border-[rgba(239,68,68,0.16)] px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold text-[var(--color-error)]"
                        >
                          <Trash2 className="h-[1.4rem] w-[1.4rem]" /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">No users match this search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
