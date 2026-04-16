const DEFAULT_STATUS_MESSAGES = {
  401: "Please log in with a valid account to continue.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource could not be found.",
  409: "This request conflicts with the current data. Please refresh and try again.",
  422: "Please correct the highlighted fields and try again.",
  429: "Too many requests were made. Please wait a moment and try again.",
  500: "Something went wrong on the server. Please try again.",
  503: "This service is temporarily unavailable right now. Please try again shortly.",
};

export const getApiErrorStatus = (error) => {
  const status = Number(error?.response?.status || error?.status || 0);
  return Number.isFinite(status) ? status : 0;
};

export const getApiErrorMessage = (
  error,
  {
    fallbackMessage = "Something went wrong. Please try again.",
    preferServerMessage = true,
    statusMessages = {},
  } = {}
) => {
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return String(validationErrors[0]);
  }

  const serverMessage = String(error?.response?.data?.message || "").trim();
  const status = getApiErrorStatus(error);

  if (preferServerMessage && serverMessage) {
    return serverMessage;
  }

  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  if (status && DEFAULT_STATUS_MESSAGES[status]) {
    return DEFAULT_STATUS_MESSAGES[status];
  }

  if (serverMessage) {
    return serverMessage;
  }

  if (error?.request) {
    return "Unable to reach the TicketHub server. Please check your connection and try again.";
  }

  return fallbackMessage;
};
