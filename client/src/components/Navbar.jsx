import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Heart, LogOut, Search, Ticket, TicketPercent, UserRound } from "lucide-react";
import { CouponModal } from "./CouponModal.jsx";
import { LocationPicker } from "./LocationPicker.jsx";
import { SearchModal } from "./SearchModal.jsx";
import { BrandLogo } from "./BrandLogo.jsx";
import { ProfileAvatar } from "./ProfileAvatar.jsx";
import { useAuth } from "../store/auth-context.jsx";
import { useWishlist } from "../store/wishlist-context.jsx";

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

  const greeting = userName ? `Hi, ${userName}` : "Hi, User";
  const profileEmail = user?.email || "Signed in to TicketHub";
  const profilePhone = user?.phone?.trim() || "Add your mobile number from profile";
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

  const handleOpenProfile = () => {
    setProfileMenuState((current) => ({ ...current, isOpen: false }));
    navigate("/profile");
  };

  const handleLogout = () => {
    setProfileMenuState((current) => ({ ...current, isOpen: false }));
    navigate("/logout");
  };

  return (
    <>
      <header className="sticky top-0 z-[1100] border-b border-[rgba(28,28,28,0.08)] bg-[rgba(255,255,255,0.88)] shadow-[0_14px_30px_rgba(28,28,28,0.06)] backdrop-blur-[18px]">
        <div className="relative w-full px-[1.2rem] sm:px-[1.6rem] lg:px-[2rem]" ref={profilePanelRef}>
          <div className="grid min-h-[7.6rem] grid-cols-[auto_1fr_auto] items-center gap-[1.6rem] max-[980px]:flex max-[980px]:min-h-[6.8rem] max-[980px]:justify-between max-[980px]:gap-[0.9rem] max-[640px]:min-h-[6.2rem]">
            <div className="flex min-w-0 items-center gap-[0.8rem] sm:gap-[1.2rem]">
              <BrandLogo
                to="/"
                size="md"
                className="max-w-full shrink-0"
                onClick={() => setMobileMenuState((current) => ({ ...current, isOpen: false }))}
              />
              <div className="max-[1180px]:hidden">
                <LocationPicker />
              </div>
            </div>

            <nav className="flex min-w-0 flex-wrap items-center justify-center gap-[0.55rem] max-[980px]:hidden">
              {baseLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex min-w-0 items-center justify-end gap-[0.75rem] xl:gap-[1rem] max-[980px]:hidden">
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
                  <ProfileAvatar
                    avatar={user?.avatar}
                    userName={userName}
                    email={user?.email}
                    className="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
                    imageClassName="h-full w-full rounded-full object-cover"
                    fallbackClassName="text-[1.75rem] font-bold text-white"
                  />
                </button>
              ) : (
                authActionLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClassName}>
                    {link.label}
                  </NavLink>
                ))
              )}
            </div>

            <div className="ml-auto hidden items-center gap-[0.7rem] max-[980px]:flex">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`${iconButtonClassName} h-[4rem] w-[4rem] sm:h-[4.2rem] sm:w-[4.2rem]`}
                aria-label="Open search"
              >
                <Search className="h-[1.8rem] w-[1.8rem]" />
              </button>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuState((current) => ({
                      isOpen: !(current.isOpen && current.pathname === location.pathname),
                      pathname: location.pathname,
                    }))
                  }
                  className={`${profileButtonClassName} h-[4rem] w-[4rem] text-[1.55rem] sm:h-[4.4rem] sm:w-[4.4rem] sm:text-[1.7rem]`}
                  aria-label="Open profile"
                  aria-expanded={profileOpen}
                >
                  <ProfileAvatar
                    avatar={user?.avatar}
                    userName={userName}
                    email={user?.email}
                    className="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
                    imageClassName="h-full w-full rounded-full object-cover"
                    fallbackClassName="text-[1.75rem] font-bold text-white"
                  />
                </button>
              ) : null}

              <button
                type="button"
                className="inline-flex min-w-[8.6rem] cursor-pointer items-center justify-center rounded-full border border-[rgba(248,68,100,0.2)] bg-[var(--color-primary)] px-[1.2rem] py-[0.85rem] text-[1.25rem] font-bold text-[var(--color-text-light)] shadow-[0_12px_24px_rgba(248,68,100,0.18)] sm:min-w-[9.4rem] sm:px-[1.5rem] sm:py-[0.95rem] sm:text-[1.4rem]"
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
            <div className="absolute right-[0.8rem] top-[calc(100%+0.9rem)] z-[1200] w-[min(34rem,calc(100vw_-_1.6rem))] overflow-hidden rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[0_24px_54px_rgba(15,23,42,0.18)] animate-[profileSlide_220ms_ease-out] sm:right-[1.2rem] sm:top-[calc(100%+1.2rem)] sm:w-[min(34rem,calc(100vw_-_4rem))] sm:rounded-[2.4rem]">
              <div className="border-b border-[rgba(28,28,28,0.06)] bg-white/80 px-[1.8rem] py-[1.4rem] backdrop-blur-[8px]">
                <p className="text-[1.15rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                  Profile
                </p>
                <p className="mt-[0.65rem] truncate text-[1.7rem] font-bold text-[var(--color-text-primary)]" title={greeting}>
                  {greeting}
                </p>
              </div>

              <div className="px-[1.2rem] py-[1.2rem] sm:px-[1.8rem] sm:py-[1.8rem]">
                <div className="flex items-center gap-[1rem] rounded-[1.8rem] bg-[rgba(17,24,39,0.04)] p-[1.1rem] sm:gap-[1.4rem] sm:rounded-[2.2rem] sm:p-[1.4rem]">
                  <ProfileAvatar
                    avatar={user?.avatar}
                    userName={userName}
                    email={user?.email}
                    className="flex h-[5.2rem] w-[5.2rem] items-center justify-center overflow-hidden rounded-full bg-[rgba(248,68,100,0.12)] sm:h-[6.4rem] sm:w-[6.4rem]"
                    imageClassName="h-full w-full object-cover"
                    fallbackClassName="text-[2.2rem] font-extrabold text-[var(--color-primary)] sm:text-[3rem]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.7rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[2rem]">
                      {userName || "User"}
                    </p>
                    <p className="mt-[0.35rem] truncate text-[1.2rem] text-[var(--color-text-secondary)] sm:text-[1.35rem]">{profileEmail}</p>
                    <p className="mt-[0.2rem] truncate text-[1.1rem] text-[var(--color-text-secondary)] sm:text-[1.25rem]">{profilePhone}</p>
                  </div>
                </div>

                <div className="mt-[1.8rem] grid gap-[1rem]">
                  <button
                    type="button"
                    onClick={handleOpenProfile}
                    className="flex min-h-[5.4rem] items-center justify-between rounded-[1.8rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.4rem] text-left text-[1.5rem] font-semibold text-[var(--color-text-primary)] shadow-[0_12px_26px_rgba(15,23,42,0.06)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
                  >
                    <span className="flex items-center gap-[0.9rem]">
                      <UserRound className="h-[1.8rem] w-[1.8rem]" />
                      Personal information
                    </span>
                    <ChevronRight className="h-[1.8rem] w-[1.8rem]" />
                  </button>

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
            <nav className="grid max-h-[calc(100vh-8rem)] gap-[0.9rem] overflow-y-auto px-[1.2rem] py-[1.2rem] pb-[1.6rem] sm:max-h-[calc(100vh-8.8rem)] sm:px-[1.6rem] sm:py-[1.4rem] sm:pb-[2rem]">
              <LocationPicker mobile onSelect={() => setMobileMenuState((current) => ({ ...current, isOpen: false }))} />
              <button
                type="button"
                onClick={() => {
                  setCouponOpen(true);
                  setMobileMenuState((current) => ({ ...current, isOpen: false }));
                }}
                className="flex items-center gap-[0.8rem] rounded-[1.25rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.2rem] py-[1.05rem] text-[1.45rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] sm:rounded-[1.4rem] sm:px-[1.4rem] sm:py-[1.2rem] sm:text-[1.6rem]"
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
                className="flex items-center gap-[0.8rem] rounded-[1.25rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.2rem] py-[1.05rem] text-[1.45rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] sm:rounded-[1.4rem] sm:px-[1.4rem] sm:py-[1.2rem] sm:text-[1.6rem]"
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
                  className="flex items-center justify-between rounded-[1.25rem] border border-[rgba(28,28,28,0.08)] bg-[var(--color-bg-card)] px-[1.2rem] py-[1.05rem] text-[1.45rem] font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] sm:rounded-[1.4rem] sm:px-[1.4rem] sm:py-[1.2rem] sm:text-[1.6rem]"
                >
                  <span className="flex min-w-0 items-center gap-[0.8rem]">
                    <ProfileAvatar
                      avatar={user?.avatar}
                      userName={userName}
                      email={user?.email}
                      className="flex h-[3.4rem] w-[3.4rem] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)]"
                      imageClassName="h-full w-full object-cover"
                      fallbackClassName="text-[1.45rem] font-bold text-white"
                    />
                    <span className="truncate text-[1.35rem] sm:text-[1.5rem]" title={greeting}>{greeting}</span>
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
