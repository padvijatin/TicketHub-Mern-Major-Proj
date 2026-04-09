import axios from "axios";

const authApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
const apiBaseUrl = authApiUrl.replace(/\/auth\/?$/, "");
const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
const bookingsApiUrl = `${apiBaseUrl}/bookings`;
const eventsApiUrl = `${apiBaseUrl}/events`;
const paymentApiUrl = `${apiBaseUrl}/payment`;

const normalizePosterUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${serverBaseUrl}${value}`;
  }

  return value;
};

const normalizeEvent = (event) => {
  if (!event) return null;

  return {
    ...event,
    poster: normalizePosterUrl(event.poster || ""),
  };
};

const normalizeParams = (params = {}) =>
  Object.entries(params).reduce((result, [key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) {
        result[key] = value.join(",");
      }

      return result;
    }

    if (value !== undefined && value !== null && value !== "") {
      result[key] = value;
    }

    return result;
  }, {});

const buildAuthConfig = (authorizationToken = "") => ({
  headers: authorizationToken
    ? {
        Authorization: authorizationToken,
      }
    : undefined,
});

export const getEvents = async (params = {}) => {
  const response = await axios.get(eventsApiUrl, { params: normalizeParams(params) });
  return (response.data.events || []).map(normalizeEvent);
};

export const getDiscoverFeed = async (authorizationToken = "") => {
  const response = await axios.get(`${eventsApiUrl}/discover/feed`, buildAuthConfig(authorizationToken));
  const normalizeRail = (items = []) => items.map(normalizeEvent).filter(Boolean);

  return {
    recommended: {
      movies: normalizeRail(response.data?.recommended?.movies || []),
      events: normalizeRail(response.data?.recommended?.events || []),
      sports: normalizeRail(response.data?.recommended?.sports || []),
    },
    popular: {
      movies: normalizeRail(response.data?.popular?.movies || []),
      events: normalizeRail(response.data?.popular?.events || []),
      sports: normalizeRail(response.data?.popular?.sports || []),
    },
    trending: {
      movies: normalizeRail(response.data?.trending?.movies || []),
      events: normalizeRail(response.data?.trending?.events || []),
      sports: normalizeRail(response.data?.trending?.sports || []),
    },
  };
};

export const getEventById = async (eventId, authorizationToken = "") => {
  const response = await axios.get(`${eventsApiUrl}/${eventId}`, buildAuthConfig(authorizationToken));
  return normalizeEvent(response.data.event || null);
};

export const createPaymentOrder = async ({
  eventId,
  seats,
  couponCode = "",
  amount,
  bookingMeta = {},
  authorizationToken = "",
}) => {
  const response = await axios.post(
    `${paymentApiUrl}/create-order`,
    {
      eventId,
      seats,
      couponCode,
      amount,
      bookingMeta,
    },
    buildAuthConfig(authorizationToken)
  );

  return response.data;
};

export const verifyPayment = async ({
  eventId,
  seats,
  couponCode = "",
  amount,
  bookingMeta = {},
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  authorizationToken = "",
}) => {
  const response = await axios.post(
    `${paymentApiUrl}/verify`,
    {
      eventId,
      seats,
      couponCode,
      amount,
      bookingMeta,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    buildAuthConfig(authorizationToken)
  );

  return {
    ...response.data,
    event: normalizeEvent(response.data.event || null),
  };
};

export const getMyBookings = async (authorizationToken) => {
  const response = await axios.get(`${bookingsApiUrl}/me`, buildAuthConfig(authorizationToken));

  return (response.data.bookings || []).map((booking) => ({
    ...booking,
    event: normalizeEvent(booking.event || null),
  }));
};

export const getBookingTicket = async (bookingId) => {
  const response = await axios.get(`${bookingsApiUrl}/${bookingId}`);
  return {
    booking: response.data.booking || null,
    event: normalizeEvent(response.data.event || null),
  };
};

export const deliverBookingTicket = async ({ bookingId, authorizationToken = "" }) => {
  const response = await axios.post(
    `${bookingsApiUrl}/${bookingId}/deliver`,
    {},
    buildAuthConfig(authorizationToken)
  );

  return {
    ...response.data,
    booking: response.data.booking || null,
  };
};

export const rateEvent = async ({ eventId, value, authorizationToken }) => {
  const response = await axios.post(
    `${eventsApiUrl}/${eventId}/rate`,
    { value },
    {
      headers: {
        Authorization: authorizationToken,
      },
    }
  );

  return response.data;
};
