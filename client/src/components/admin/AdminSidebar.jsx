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
      <div className="border-b border-[rgba(28,28,28,0.08)] p-[1.6rem] sm:p-[2rem] lg:p-[2.4rem]">
        <h2 className="text-[1.95rem] font-extrabold tracking-[-0.03em] text-[var(--color-primary)] sm:text-[2.2rem]">
          {role === "admin" ? "Admin Panel" : "Organizer Panel"}
        </h2>
        <p className="mt-[0.5rem] text-[1.25rem] text-[var(--color-text-secondary)]">
          TicketHub Management
        </p>
      </div>

      <nav className="flex-1 p-[0.9rem] sm:p-[1.1rem]">
        <div className="flex gap-[0.7rem] overflow-x-auto pb-[0.2rem] max-[980px]:snap-x max-[980px]:snap-mandatory max-[980px]:whitespace-nowrap min-[981px]:grid min-[981px]:gap-[0.4rem]">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex shrink-0 snap-start items-center gap-[0.9rem] rounded-[1.2rem] px-[1.2rem] py-[1rem] text-left text-[1.3rem] font-semibold transition-colors min-[981px]:w-full min-[981px]:gap-[1.1rem] min-[981px]:px-[1.4rem] min-[981px]:py-[1.25rem] min-[981px]:text-[1.4rem] ${
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
        </div>
      </nav>

      <div className="border-t border-[rgba(28,28,28,0.08)] p-[0.9rem] sm:p-[1.2rem]">
        <button
          type="button"
          onClick={() => navigate("/logout")}
          className="flex w-full items-center gap-[1rem] rounded-[1.2rem] px-[1.2rem] py-[1rem] text-left text-[1.3rem] font-semibold text-[var(--color-error)] transition-colors hover:bg-[rgba(239,68,68,0.08)] sm:gap-[1.1rem] sm:px-[1.4rem] sm:py-[1.25rem] sm:text-[1.4rem]"
        >
          <LogOut className="h-[1.7rem] w-[1.7rem]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
