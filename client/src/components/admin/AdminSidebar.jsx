import {
  Calendar,
  LayoutDashboard,
  IndianRupee,
  LogOut,
  Tag,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Event Management", icon: Calendar },
  { id: "bookings", label: "Bookings", icon: IndianRupee },
  { id: "users", label: "User Management", icon: Users },
  { id: "coupons", label: "Coupons", icon: Tag },
];

const organizerTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "My Events", icon: Calendar },
  { id: "bookings", label: "Bookings", icon: IndianRupee },
  { id: "coupons", label: "Coupons", icon: Tag },
];

const AdminSidebar = ({ activeTab, onTabChange, role }) => {
  const navigate = useNavigate();
  const tabs = role === "admin" ? adminTabs : organizerTabs;

  return (
    <aside className="w-[26rem] min-h-[calc(100vh-3.2rem)] rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[0_18px_45px_rgba(28,28,28,0.08)] max-[980px]:min-h-fit max-[980px]:w-full">
      <div className="border-b border-[rgba(28,28,28,0.08)] p-[2.4rem]">
        <h2 className="text-[2.2rem] font-extrabold tracking-[-0.03em] text-[var(--color-primary)]">
          {role === "admin" ? "Admin Panel" : "Organizer Panel"}
        </h2>
        <p className="mt-[0.5rem] text-[1.25rem] text-[var(--color-text-secondary)]">
          TicketHub Management
        </p>
      </div>

      <nav className="flex-1 space-y-[0.4rem] p-[1.2rem]">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex w-full items-center gap-[1.1rem] rounded-[1.2rem] px-[1.4rem] py-[1.25rem] text-left text-[1.4rem] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[rgba(248,68,100,0.08)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Icon className="h-[1.7rem] w-[1.7rem]" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[rgba(28,28,28,0.08)] p-[1.2rem]">
        <button
          type="button"
          onClick={() => navigate("/logout")}
          className="flex w-full items-center gap-[1.1rem] rounded-[1.2rem] px-[1.4rem] py-[1.25rem] text-left text-[1.4rem] font-semibold text-[var(--color-error)] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
        >
          <LogOut className="h-[1.7rem] w-[1.7rem]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
