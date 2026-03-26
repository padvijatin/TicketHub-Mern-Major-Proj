import axios from "axios";

const authApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
const apiBaseUrl = authApiUrl.replace(/\/auth\/?$/, "");
const eventsApiUrl = `${apiBaseUrl}/events`;

export const getEvents = async (params = {}) => {
  const response = await axios.get(eventsApiUrl, { params });
  return response.data.events || [];
};

export const getEventById = async (eventId) => {
  const events = await getEvents({ limit: 200 });
  return events.find((event) => event.id === eventId) || null;
};
