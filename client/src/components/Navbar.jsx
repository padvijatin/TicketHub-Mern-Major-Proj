import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Heart, LogOut, Search, Ticket, TicketPercent } from "lucide-react";
import { CouponModal } from "./CouponModal.jsx";
import { LocationPicker } from "./LocationPicker.jsx";
import { SearchModal } from "./SearchModal.jsx";
import { BrandLogo } from "./BrandLogo.jsx";
import { useAuth } from "../store/auth-context.jsx";
import { useWishlist } from "../store/wishlist-context.jsx";

const buildProfileInitial = (userName = "", email = "") => {
  const seed = String(userName || email || "U").trim();
  return seed ? seed.charAt(0).toUpperCase() : "U";
};

export const Navbar = () => {
  const [mobileMenuState, setMobileMenuState] = useState({ isOpen: false, pathname: "" });
  const [searchOpen, setSearchOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [profileMenuState, setProfileMenuState] = useState({ isOpen: false, pathname: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const profilePanelRef = useRef(null);
  const { isAdmin, isLoggedIn, isOrganizer, user, userName } = useAuth();
  const { wishlistCount } = useWishlist();

  const desktopLinkClassName = ({ isActive }) =>
    [
      "whitespace-nowrap rounded-full border border-transparent px-[1.25rem] py-[1rem] text-[1.38rem] font-semibold text-[var(--color-text-secondary)] transition-all duration-[250ms]",
      isActive
        ? "border-[rgba(248,68,100,0.18)] bg-[rgba(248,68,100,0.08)] text-[var(--color-primary)]"
        : "hover:border-[rgba(248,68,100,0.18)] hover:bg-[rgba(248,68,100,0.08)] hover:text-[var(--color-primary)]",
    ].join(" ");

  const mobileLinkClassName = ({ isActive }) =>
    [
      "rounded-[1.4rem] border border-transparent bg-[var(--color-bg-card)] px-[1.4rem] py-[1.2rem] text-[1.6rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] transition-all duration-[250ms]",
      isActive
        ? "border-[rgba(248,68,100,0.18)] bg-[rgba(248,68,100,0.08)] text-[var(--color-primary)]"
        : "hover:border-[rgba(248,68,100,0.18)] hover:bg-[rgba(248,68,100,0.08)] hover:text-[var(--color-primary)]",
    ].join(" ");

  const iconButtonClassName =
    "relative inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-full border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition-all duration-[250ms] hover:border-[rgba(248,68,100,0.18)] hover:bg-[rgba(248,68,100,0.08)] hover:text-[var(--color-primary)]";

  const profileButtonClassName =
    "inline-flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full border border-[rgba(17,24,39,0.08)] bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] text-[1.75rem] font-bold text-white shadow-[0_14px_30px_rgba(17,24,39,0.18)] transition-all duration-200 hover:-translate-y-[0.1rem] hover:shadow-[0_18px_34px_rgba(17,24,39,0.24)]";

  const baseLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/movies", label: "Movies" },
    { to: "/sports", label: "Sports" },
    { to: "/events", label: "Events" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    ...(isOrganizer ? [{ to: "/organizer", label: "Organizer" }] : []),
  ];

  const authActionLinks = isLoggedIn
    ? []
    : [
        { to: "/register", label: "Register" },
        { to: "/login", label: "Login" },
      ];

  const mobileLinks = [
    ...baseLinks,
    { to: "/wishlist", label: "Wishlist" },
    ...(isLoggedIn ? [{ to: "/bookings", label: "My Bookings" }] : []),
    ...authActionLinks,
  ];

  const profileInitial = useMemo(() => buildProfileInitial(userName, user?.email), [user?.email, userName]);
  const greeting = userName ? `Hi, ${userName}` : "Hi, User";
  const profileEmail = user?.email || "Signed in to TicketHub";
  const mobileOpen = mobileMenuState.isOpen && mobileMenuState.pathname === location.pathname;
  const profileOpen = profileMenuState.isOpen && profileMenuState.pathname === location.pathname;

  useEffect(() => {
    if (!profileOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
        if (!profilePanelRef.current?.contains(event.target)) {
        setProfileMenuState((current) => ({ ...current, isOpen: false }));
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [profileOpen]);

  const handleOpenBookings = () => {
    setProfileMenuState((current) => ({ ...current, isOpen: false }));
    navigate("/bookings");
  };

  const handleLogout = () => {
    setProfileMenuState((current) => ({ ...current, isOpen: false }));
    navigate("/logout");
  };

  return (
    <>
      <header className="sticky top-0 z-[1100] border-b border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.88)] shadow-[0_14px_30px_rgba(28,28,28,0.06)] backdrop-blur-[18px]">
        <div className="relative w-full px-[2rem]" ref={profilePanelRef}>
          <div className="grid min-h-[7.6rem] grid-cols-[auto_1fr_auto] items-center gap-[1.6rem] max-[980px]:flex max-[980px]:min-h-[7rem] max-[980px]:justify-between">
            <div className="flex min-w-0 items-center gap-[1.2rem]">
                    <BrandLogo to="/" size="md" className="shrink-0" onClick={() => setMobileMenuState((current) => ({ ...current, isOpen: false }))} />
              <div className="max-[980px]:hidden">
                <LocationPicker />
              </div>
            </div>

            <nav className="flex min-w-0 flex-wrap items-center justify-center gap-[0.8rem] max-[980px]:hidden">
              {baseLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex min-w-0 items-center justify-end gap-[1rem] max-[980px]:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={iconButtonClassName}
                aria-label="Open search"
              >
                <Search className="h-[1.9rem] w-[1.9rem]" />
              </button>

              <button
                type="button"
                onClick={() => setCouponOpen(true)}
                className={iconButtonClassName}
                aria-label="Open offers"
              >
                <TicketPercent className="h-[1.9rem] w-[1.9rem]" />
              </button>

              <NavLink to="/wishlist" className={iconButtonClassName} aria-label="Open wishlist">
                <Heart className={`h-[1.9rem] w-[1.9rem] ${wishlistCount ? "fill-current" : ""}`} />
                {wishlistCount ? (
                  <span className="absolute -right-[0.1rem] -top-[0.2rem] inline-flex min-w-[1.9rem] items-center justify-center rounded-full bg-[var(--color-primary)] px-[0.45rem] py-[0.2rem] text-[1rem] font-extrabold leading-none text-[var(--color-text-light)]">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                ) : null}
              </NavLink>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuState((current) => ({
                      isOpen: !(current.isOpen && current.pathname === location.pathname),
                      pathname: location.pathname,
                    }))
                  }
                  className={profileButtonClassName}
                  aria-label="Open profile"
                  aria-expanded={profileOpen}
                >
                  {profileInitial}
                </button>
              ) : (
                authActionLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClassName}>
                    {link.label}
                  </NavLink>
                ))
              )}
            </div>

            <div className="ml-auto hidden items-center gap-[1rem] max-[980px]:flex">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuState((current) => ({
                      isOpen: !(current.isOpen && current.pathname === location.pathname),
                      pathname: location.pathname,
                    }))
                  }
                  className={profileButtonClassName}
                  aria-label="Open profile"
                  aria-expanded={profileOpen}
                >
                  {profileInitial}
                </button>
              ) : null}

              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[rgba(248,68,100,0.2)] bg-[var(--color-primary)] px-[1.6rem] py-[0.95rem] text-[1.4rem] font-bold text-[var(--color-text-light)]"
                onClick={() =>
                  setMobileMenuState((current) => ({
                    isOpen: !(current.isOpen && current.pathname === location.pathname),
                    pathname: location.pathname,
                  }))
                }
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          {profileOpen && isLoggedIn ? (
            <div className="absolute right-0 top-[calc(100%+1.2rem)] z-[1200] w-[min(36rem,calc(100vw_-_3.2rem))] overflow-hidden rounded-[2.8rem] border border-[rgba(28,28,28,0.08)] bg-[linear-gradient(180deg,#fff7f8_0%,#ffffff_100%)] shadow-[0_24px_54px_rgba(15,23,42,0.18)] animate-[profileSlide_220ms_ease-out] max-[980px]:right-[0.4rem]">
              <div className="border-b border-[rgba(28,28,28,0.06)] bg-white/72 px-[1.8rem] py-[1.4rem] backdrop-blur-[8px]">
                <p className="text-[1.15rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Profile</p>
                <p className="mt-[0.65rem] truncate text-[1.7rem] font-bold text-[var(--color-text-primary)]" title={greeting}>{greeting}</p>
              </div>

              <div className="px-[1.8rem] py-[1.8rem]">
                <div className="flex items-center gap-[1.4rem] rounded-[2.2rem] bg-[rgba(17,24,39,0.04)] p-[1.4rem]">
                  <div className="flex h-[6.4rem] w-[6.4rem] items-center justify-center rounded-full bg-[rgba(248,68,100,0.12)] text-[3rem] font-extrabold text-[var(--color-primary)]">
                    {profileInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                      {userName || "User"}
                    </p>
                    <p className="mt-[0.45rem] truncate text-[1.35rem] text-[var(--color-text-secondary)]">{profileEmail}</p>
                  </div>
                </div>

                <div className="mt-[1.8rem] grid gap-[1rem]">
                  <button
                    type="button"
                    onClick={handleOpenBookings}
                    className="flex min-h-[5.4rem] items-center justify-between rounded-[1.8rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.4rem] text-left text-[1.5rem] font-semibold text-[var(--color-text-primary)] shadow-[0_12px_26px_rgba(15,23,42,0.06)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                  >
                    <span className="flex items-center gap-[0.9rem]">
                      <Ticket className="h-[1.8rem] w-[1.8rem]" />
                      View all bookings
                    </span>
                    <ChevronRight className="h-[1.8rem] w-[1.8rem]" />
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-[5.4rem] items-center gap-[0.9rem] rounded-[1.8rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.4rem] text-[1.5rem] font-semibold text-[var(--color-text-primary)] shadow-[0_12px_26px_rgba(15,23,42,0.06)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                  >
                    <LogOut className="h-[1.8rem] w-[1.8rem]" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {mobileOpen && (
          <div className="border-t border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.96)]">
            <nav className="grid gap-[1rem] px-[2rem] py-[1.6rem] pb-[2rem]">
              <LocationPicker mobile onSelect={() => setMobileMenuState((current) => ({ ...current, isOpen: false }))} />
              <button
                type="button"
                onClick={() => {
                  setCouponOpen(true);
                  setMobileMenuState((current) => ({ ...current, isOpen: false }));
                }}
                className="flex items-center gap-[0.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.4rem] py-[1.2rem] text-[1.6rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)]"
              >
                <TicketPercent className="h-[1.8rem] w-[1.8rem]" />
                Offers
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuState((current) => ({ ...current, isOpen: false }));
                }}
                className="flex items-center gap-[0.8rem] rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.4rem] py-[1.2rem] text-[1.6rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)]"
              >
                <Search className="h-[1.8rem] w-[1.8rem]" />
                Search
              </button>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuState({
                      isOpen: true,
                      pathname: location.pathname,
                    });
                    setMobileMenuState((current) => ({ ...current, isOpen: false }));
                  }}
                  className="flex items-center justify-between rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.4rem] py-[1.2rem] text-[1.6rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)]"
                >
                  <span className="flex min-w-0 items-center gap-[0.8rem]">
                    <span className="flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] text-[1.45rem] font-bold text-white">
                      {profileInitial}
                    </span>
                    <span className="truncate text-[1.5rem]" title={greeting}>{greeting}</span>
                  </span>
                  <ChevronRight className="h-[1.8rem] w-[1.8rem]" />
                </button>
              ) : null}
              {mobileLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileMenuState((current) => ({ ...current, isOpen: false }))}
                  className={mobileLinkClassName}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CouponModal isOpen={couponOpen} onClose={() => setCouponOpen(false)} />
    </>
  );
};
