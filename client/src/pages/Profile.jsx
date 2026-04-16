import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronRight, KeyRound, LockKeyhole, LogOut, Mail, Phone, Ticket, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { ProfileAvatar } from "../components/ProfileAvatar.jsx";
import { useAuth } from "../store/auth-context.jsx";
import { getApiErrorMessage } from "../utils/apiError.js";
import {
  getValidatedFieldClassName,
  hasValidationErrors,
  validatePassword,
  validatePhone,
  validateUsername,
} from "../utils/formValidation.js";

const initialFormState = {
  username: "",
  phone: "",
};

const initialPasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialTouchedState = {
  username: false,
  phone: false,
};

const initialPasswordTouchedState = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export const Profile = () => {
  const { isLoading: isAuthLoading, isLoggedIn, updateUserPassword, updateUserProfile, user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [passwordData, setPasswordData] = useState(initialPasswordState);
  const [formErrors, setFormErrors] = useState(initialFormState);
  const [passwordErrors, setPasswordErrors] = useState(initialPasswordState);
  const [touchedFields, setTouchedFields] = useState(initialTouchedState);
  const [touchedPasswordFields, setTouchedPasswordFields] = useState(initialPasswordTouchedState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      username: user.username || "",
      phone: user.phone || "",
    });
  }, [user]);

  const hasPhone = Boolean(String(user?.phone || "").trim());
  const isGoogleUser = useMemo(
    () => Array.isArray(user?.authProviders) && user.authProviders.includes("google"),
    [user?.authProviders]
  );
  const hasLocalPassword = useMemo(
    () => Array.isArray(user?.authProviders) && user.authProviders.includes("local"),
    [user?.authProviders]
  );
  const profileProviders = Array.isArray(user?.authProviders) ? user.authProviders : [];
  const displayName = useMemo(
    () => String(user?.username || "").trim() || "TicketHub User",
    [user?.username]
  );

  if (!isAuthLoading && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const validateProfileState = (nextFormData) => ({
    username: validateUsername(nextFormData.username),
    phone: validatePhone(nextFormData.phone),
  });

  const validatePasswordState = (nextPasswordData) => ({
    currentPassword: hasLocalPassword ? validatePassword(nextPasswordData.currentPassword, { label: "Current password" }) : "",
    newPassword: validatePassword(nextPasswordData.newPassword, { label: "New password" }),
    confirmPassword: !String(nextPasswordData.confirmPassword || "")
      ? "Confirm password is required."
      : nextPasswordData.confirmPassword === nextPasswordData.newPassword
        ? ""
        : "Passwords do not match.",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    const nextState = { ...formData, [name]: value };
    setFormData(nextState);

    if (touchedFields[name]) {
      setFormErrors(validateProfileState(nextState));
    }
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;
    const nextState = { ...passwordData, [name]: value };
    setPasswordData(nextState);

    if (touchedPasswordFields[name] || (name === "newPassword" && touchedPasswordFields.confirmPassword)) {
      setPasswordErrors(validatePasswordState(nextState));
    }
  };

  const handleProfileBlur = (event) => {
    const { name } = event.target;
    setTouchedFields((current) => ({ ...current, [name]: true }));
    setFormErrors(validateProfileState(formData));
  };

  const handlePasswordBlur = (event) => {
    const { name } = event.target;
    setTouchedPasswordFields((current) => ({ ...current, [name]: true }));
    setPasswordErrors(validatePasswordState(passwordData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProfileState(formData);

    setTouchedFields({
      username: true,
      phone: true,
    });
    setFormErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateUserProfile({
        username: formData.username.trim(),
        phone: formData.phone.trim(),
      });
      toast.success(response.message || "Profile updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, { fallbackMessage: "Unable to update profile" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validatePasswordState(passwordData);

    setTouchedPasswordFields({
      currentPassword: hasLocalPassword,
      newPassword: true,
      confirmPassword: true,
    });
    setPasswordErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsPasswordSubmitting(true);

    try {
      const response = await updateUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      toast.success(response.message || "Password updated successfully");
      setPasswordData(initialPasswordState);
      setPasswordErrors(initialPasswordState);
      setTouchedPasswordFields(initialPasswordTouchedState);
    } catch (error) {
      toast.error(getApiErrorMessage(error, { fallbackMessage: "Unable to update password" }));
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <main className="bg-[var(--color-bg-main)] py-[3rem]">
      <section className="mx-auto w-[min(118rem,calc(100%_-_3.2rem))]">
        <div className="grid gap-[2.2rem] xl:grid-cols-[26rem_1fr]">
          <aside className="rounded-[2.6rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1.6rem] shadow-[var(--shadow-soft)]">
            <div className="rounded-[2rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.7rem] py-[1.7rem]">
              <p className="text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                My Account
              </p>
              <p className="mt-[0.7rem] text-[2.5rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
                {displayName}
              </p>
              <p className="mt-[0.5rem] text-[1.3rem] leading-[1.6] text-[var(--color-text-secondary)]">
                Personal info and bookings.
              </p>
            </div>

            <div className="mt-[1.2rem] grid gap-[0.8rem]">
              <div className="flex min-h-[5rem] items-center justify-between rounded-[1.6rem] border border-[rgba(248,68,100,0.18)] bg-[rgba(248,68,100,0.07)] px-[1.3rem] text-[1.45rem] font-bold text-[var(--color-primary)]">
                <span className="flex items-center gap-[0.9rem]">
                  <UserRound className="h-[1.8rem] w-[1.8rem]" />
                  Profile
                </span>
                <ChevronRight className="h-[1.6rem] w-[1.6rem]" />
              </div>

              <Link
                to="/bookings"
                className="flex min-h-[5rem] items-center justify-between rounded-[1.6rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.3rem] text-[1.45rem] font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
              >
                <span className="flex items-center gap-[0.9rem]">
                  <Ticket className="h-[1.7rem] w-[1.7rem]" />
                  Bookings
                </span>
                <ChevronRight className="h-[1.6rem] w-[1.6rem]" />
              </Link>

              <Link
                to="/logout"
                className="flex min-h-[5rem] items-center justify-between rounded-[1.6rem] border border-[rgba(28,28,28,0.06)] bg-white px-[1.3rem] text-[1.45rem] font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:border-[rgba(248,68,100,0.18)] hover:text-[var(--color-primary)]"
              >
                <span className="flex items-center gap-[0.9rem]">
                  <LogOut className="h-[1.7rem] w-[1.7rem]" />
                  Sign out
                </span>
                <ChevronRight className="h-[1.6rem] w-[1.6rem]" />
              </Link>
            </div>
          </aside>

          <section className="overflow-hidden rounded-[2.6rem] border border-[rgba(28,28,28,0.08)] bg-white shadow-[var(--shadow-soft)]">
            <div className="border-b border-[rgba(28,28,28,0.06)] bg-white px-[2.2rem] py-[2.2rem] md:px-[2.7rem] md:py-[2.4rem]">
              <div className="flex flex-wrap items-center gap-[1.6rem]">
                <ProfileAvatar
                  avatar={user?.avatar}
                  userName={displayName}
                  email={user?.email}
                  className="flex h-[10.2rem] w-[10.2rem] items-center justify-center overflow-hidden rounded-full border-[0.45rem] border-white bg-[rgba(248,68,100,0.12)] shadow-[0_14px_28px_rgba(28,28,28,0.12)]"
                  imageClassName="h-full w-full object-cover"
                  fallbackClassName="text-[3.6rem] font-extrabold text-[var(--color-primary)]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-[0.9rem]">
                    {profileProviders.map((provider) => (
                      <span
                        key={provider}
                        className="inline-flex rounded-full border border-[rgba(248,68,100,0.16)] bg-white/80 px-[0.9rem] py-[0.45rem] text-[1rem] font-bold capitalize text-[var(--color-primary)]"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                  <h1 className="mt-[0.9rem] text-[clamp(3.2rem,4.6vw,4.6rem)] font-extrabold tracking-[-0.05em] text-[var(--color-text-primary)]">
                    {displayName}
                  </h1>
                  <p className="mt-[0.6rem] max-w-[56rem] text-[1.4rem] leading-[1.65] text-[var(--color-text-secondary)]">
                    Manage your account details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-[2.1rem] px-[2.2rem] py-[2.2rem] md:px-[2.7rem] md:py-[2.6rem]">
              <section>
                <div className="flex flex-wrap items-start justify-between gap-[1.2rem]">
                  <div>
                    <h2 className="text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
                      Personal details
                    </h2>
                  </div>

                  {isGoogleUser && !hasPhone ? (
                    <div className="max-w-[30rem] rounded-[1.6rem] border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.06)] px-[1.2rem] py-[1rem] text-[1.25rem] leading-[1.6] text-[#1d4ed8]">
                      Add your mobile number to complete your profile.
                    </div>
                  ) : null}
                </div>

                <form className="mt-[1.2rem] grid gap-[1.4rem]" onSubmit={handleSubmit}>
                  <div className="grid gap-[1.4rem] md:grid-cols-2">
                    <label className="grid gap-[0.8rem] md:col-span-2" htmlFor="username">
                      <span className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <UserRound className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        Username
                      </span>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInput}
                        onBlur={handleProfileBlur}
                        className={getValidatedFieldClassName("w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.5)] focus:shadow-[0_0_0_0.35rem_rgba(248,68,100,0.1)]", touchedFields.username && Boolean(formErrors.username))}
                        aria-invalid={touchedFields.username && Boolean(formErrors.username)}
                        placeholder="Enter your username"
                        required
                      />
                      {touchedFields.username && formErrors.username ? (
                        <span className="text-[1.12rem] font-medium text-[var(--color-error)]">{formErrors.username}</span>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-[1.4rem] md:grid-cols-2">
                    <label className="grid gap-[0.8rem]" htmlFor="phone">
                      <span className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <Phone className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        Mobile number
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInput}
                        onBlur={handleProfileBlur}
                        className={getValidatedFieldClassName("w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.5)] focus:shadow-[0_0_0_0.35rem_rgba(248,68,100,0.1)]", touchedFields.phone && Boolean(formErrors.phone))}
                        aria-invalid={touchedFields.phone && Boolean(formErrors.phone)}
                        placeholder="+91 6354074492"
                      />
                      {touchedFields.phone && formErrors.phone ? (
                        <span className="text-[1.12rem] font-medium text-[var(--color-error)]">{formErrors.phone}</span>
                      ) : null}
                    </label>

                    <div className="grid gap-[0.8rem]">
                      <div className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <Mail className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        Email address
                      </div>
                      <div className="flex min-h-[4.6rem] items-center rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-secondary)]">
                        <span className="break-all">{user?.email || "No email available"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-[1rem] pt-[0.2rem]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-[4.6rem] items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] px-[2rem] text-[1.45rem] font-bold text-[var(--color-text-light)] transition-[transform,box-shadow,background] duration-200 hover:bg-[var(--color-primary-hover)] enabled:hover:-translate-y-px enabled:hover:shadow-[0_14px_24px_rgba(248,68,100,0.22)] disabled:cursor-wait disabled:opacity-80"
                    >
                      {isSubmitting ? "Saving changes..." : "Save changes"}
                    </button>
                  </div>
                </form>
              </section>

              <section>
                <div className="flex flex-wrap items-start justify-between gap-[1.2rem]">
                  <div>
                    <h2 className="text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)]">
                      {hasLocalPassword ? "Change password" : "Set password"}
                    </h2>
                  </div>

                  {!hasLocalPassword && isGoogleUser ? (
                    <div className="max-w-[30rem] rounded-[1.6rem] border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.06)] px-[1.2rem] py-[1rem] text-[1.25rem] leading-[1.6] text-[#1d4ed8]">
                      Add a password if you want to sign in with email and password as well as Google.
                    </div>
                  ) : null}
                </div>

                <form className="mt-[1.2rem] grid gap-[1.4rem]" onSubmit={handlePasswordSubmit}>
                  {hasLocalPassword ? (
                    <label className="grid gap-[0.8rem]" htmlFor="currentPassword">
                      <span className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <KeyRound className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        Current password
                      </span>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInput}
                        onBlur={handlePasswordBlur}
                        className={getValidatedFieldClassName("w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.5)] focus:shadow-[0_0_0_0.35rem_rgba(248,68,100,0.1)]", touchedPasswordFields.currentPassword && Boolean(passwordErrors.currentPassword))}
                        aria-invalid={touchedPasswordFields.currentPassword && Boolean(passwordErrors.currentPassword)}
                        placeholder="Enter your current password"
                        required
                      />
                      {touchedPasswordFields.currentPassword && passwordErrors.currentPassword ? (
                        <span className="text-[1.12rem] font-medium text-[var(--color-error)]">{passwordErrors.currentPassword}</span>
                      ) : null}
                    </label>
                  ) : null}

                  <div className="grid gap-[1.4rem] md:grid-cols-2">
                    <label className="grid gap-[0.8rem]" htmlFor="newPassword">
                      <span className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <LockKeyhole className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        New password
                      </span>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInput}
                        onBlur={handlePasswordBlur}
                        className={getValidatedFieldClassName("w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.5)] focus:shadow-[0_0_0_0.35rem_rgba(248,68,100,0.1)]", touchedPasswordFields.newPassword && Boolean(passwordErrors.newPassword))}
                        aria-invalid={touchedPasswordFields.newPassword && Boolean(passwordErrors.newPassword)}
                        placeholder="Enter your new password"
                        required
                      />
                      {touchedPasswordFields.newPassword && passwordErrors.newPassword ? (
                        <span className="text-[1.12rem] font-medium text-[var(--color-error)]">{passwordErrors.newPassword}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-[0.8rem]" htmlFor="confirmPassword">
                      <span className="flex items-center gap-[0.7rem] text-[1.4rem] font-bold text-[var(--color-text-primary)]">
                        <LockKeyhole className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                        Confirm password
                      </span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInput}
                        onBlur={handlePasswordBlur}
                        className={getValidatedFieldClassName("w-full rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-[rgba(248,248,249,0.9)] px-[1.3rem] py-[1.2rem] text-[1.45rem] text-[var(--color-text-primary)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] focus:border-[rgba(248,68,100,0.5)] focus:shadow-[0_0_0_0.35rem_rgba(248,68,100,0.1)]", touchedPasswordFields.confirmPassword && Boolean(passwordErrors.confirmPassword))}
                        aria-invalid={touchedPasswordFields.confirmPassword && Boolean(passwordErrors.confirmPassword)}
                        placeholder="Re-enter your new password"
                        required
                      />
                      {touchedPasswordFields.confirmPassword && passwordErrors.confirmPassword ? (
                        <span className="text-[1.12rem] font-medium text-[var(--color-error)]">{passwordErrors.confirmPassword}</span>
                      ) : null}
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-[1rem] pt-[0.2rem]">
                    <button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="inline-flex min-h-[4.6rem] items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] px-[2rem] text-[1.45rem] font-bold text-[var(--color-text-light)] transition-[transform,box-shadow,background] duration-200 hover:bg-[var(--color-primary-hover)] enabled:hover:-translate-y-px enabled:hover:shadow-[0_14px_24px_rgba(248,68,100,0.22)] disabled:cursor-wait disabled:opacity-80"
                    >
                      {isPasswordSubmitting
                        ? hasLocalPassword
                          ? "Updating password..."
                          : "Setting password..."
                        : hasLocalPassword
                          ? "Update password"
                          : "Set password"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};
