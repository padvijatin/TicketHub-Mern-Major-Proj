const Event = require("../models/event-model");

const moviePattern = /(movie|film|cinema|screen|premiere)/i;
const sportsPattern = /(sport|cricket|football|match|league|ipl|cup|tournament|stadium)/i;

const routeByType = {
  movie: "/movies",
  sports: "/sports",
  event: "/events",
};

const normalizeType = (value = "") => {
  const normalizedValue = value.trim().toLowerCase();

  if (["movie", "movies"].includes(normalizedValue)) {
    return "movie";
  }

  if (["sport", "sports"].includes(normalizedValue)) {
    return "sports";
  }

  if (["event", "events"].includes(normalizedValue)) {
    return "event";
  }

  return "";
};

const detectContentType = (category = "") => {
  if (moviePattern.test(category)) {
    return "movie";
  }

  if (sportsPattern.test(category)) {
    return "sports";
  }

  return "event";
};

const toTitleCase = (value = "") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const buildTypeQuery = (type) => {
  if (type === "movie") {
    return { category: moviePattern };
  }

  if (type === "sports") {
    return { category: sportsPattern };
  }

  if (type === "event") {
    return {
      category: {
        $not: {
          $regex: /(movie|film|cinema|screen|premiere|sport|cricket|football|match|league|ipl|cup|tournament|stadium)/i,
        },
      },
    };
  }

  return {};
};

const serializeEvent = (event) => {
  const contentType = detectContentType(event.category);

  return {
    id: event._id.toString(),
    title: event.title,
    subtitle: event.description || `${toTitleCase(event.category)} in ${event.city}`,
    category: toTitleCase(event.category),
    contentType,
    date: event.date instanceof Date ? event.date.toISOString() : event.date,
    city: event.city,
    venue: event.venue,
    price: event.price,
    poster: event.poster,
    cta: contentType === "movie" ? "Book Movie" : contentType === "sports" ? "Get Sports Tickets" : "Book Event",
    to: routeByType[contentType],
    isActive: event.isActive,
    totalSeats: event.totalSeats,
    availableSeats: event.availableSeats,
  };
};

const getEvents = async (req, res) => {
  try {
    const type = normalizeType(req.query.type);
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedSkip = Number.parseInt(req.query.skip, 10);

    const query = {
      isActive: true,
      status: "approved",
      ...buildTypeQuery(type),
    };

    const eventQuery = Event.find(query).sort({ date: 1, createdAt: -1, title: 1 });

    if (Number.isInteger(parsedSkip) && parsedSkip > 0) {
      eventQuery.skip(parsedSkip);
    }

    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      eventQuery.limit(parsedLimit);
    }

    const events = await eventQuery.lean();

    return res.status(200).json({
      events: events.map(serializeEvent),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load events right now",
    });
  }
};

module.exports = {
  getEvents,
};
