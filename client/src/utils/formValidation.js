const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s()-]{10,15}$/;
const couponCodePattern = /^[A-Z0-9_-]{3,20}$/;

export const getValidatedFieldClassName = (baseClassName, hasError) =>
  hasError
    ? `${baseClassName} border-[rgba(239,68,68,0.9)] bg-[rgba(254,242,242,0.96)] shadow-[0_0_0_0.24rem_rgba(239,68,68,0.16)] focus:border-[rgba(239,68,68,0.95)] focus:shadow-[0_0_0_0.38rem_rgba(239,68,68,0.18)]`
    : baseClassName;

export const hasValidationErrors = (errors = {}) => Object.values(errors).some(Boolean);

export const validateRequiredText = (value, label) =>
  String(value || "").trim() ? "" : `${label} is required.`;

export const validateEmail = (value) => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return "Email is required.";
  return emailPattern.test(normalizedValue) ? "" : "Enter a valid email address.";
};

export const validatePhone = (value, { required = false } = {}) => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return required ? "Phone number is required." : "";
  return phonePattern.test(normalizedValue) ? "" : "Enter a valid phone number.";
};

export const validatePassword = (value, { required = true, label = "Password" } = {}) => {
  const normalizedValue = String(value || "");
  if (!normalizedValue) return required ? `${label} is required.` : "";
  if (normalizedValue.length < 6) return `${label} must be at least 6 characters.`;
  return "";
};

export const validateUsername = (value, { minLength = 2, label = "Username" } = {}) => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return `${label} is required.`;
  if (normalizedValue.length < minLength) return `${label} must be at least ${minLength} characters.`;
  return "";
};

export const validateMessage = (value, { label = "Message", minLength = 10 } = {}) => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return `${label} is required.`;
  if (normalizedValue.length < minLength) return `${label} must be at least ${minLength} characters.`;
  return "";
};

export const validateCouponCode = (value) => {
  const normalizedValue = String(value || "").trim().toUpperCase();
  if (!normalizedValue) return "Coupon code is required.";
  return couponCodePattern.test(normalizedValue)
    ? ""
    : "Use 3-20 letters, numbers, hyphen, or underscore.";
};

export const validateDateValue = (value, label = "Date") => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return `${label} is required.`;
  return Number.isNaN(new Date(normalizedValue).getTime()) ? `Enter a valid ${label.toLowerCase()}.` : "";
};
