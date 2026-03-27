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

const createDefaultSeatZones = (contentType, basePrice, availableSeats) => {
  const safePrice = Number(basePrice) > 0 ? Number(basePrice) : 0;
  const safeSeats = Number(availableSeats) > 0 ? Number(availableSeats) : 0;

  if (contentType === "movie") {
    return [
      {
        sectionGroup: "Screening",
        name: "Premium",
        price: Math.max(safePrice + 120, safePrice || 471),
        availableSeats: Math.max(safeSeats - 12, 24),
      },
      {
        sectionGroup: "Screening",
        name: "Classic",
        price: Math.max(safePrice, 349),
        availableSeats: Math.max(safeSeats, 48),
      },
      {
        sectionGroup: "Screening",
        name: "Saver",
        price: Math.max(safePrice - 87, 262),
        availableSeats: Math.max(safeSeats + 8, 32),
      },
    ];
  }

  if (contentType === "sports") {
    return [
      {
        sectionGroup: "Pitch",
        name: "North Lower",
        price: Math.max(safePrice - 90, 1169),
        availableSeats: Math.max(safeSeats, 64),
      },
      {
        sectionGroup: "Pitch",
        name: "East Stand",
        price: Math.max(safePrice + 300, 1559),
        availableSeats: Math.max(safeSeats - 6, 58),
      },
      {
        sectionGroup: "Pitch",
        name: "South Lower",
        price: Math.max(safePrice - 25, 1234),
        availableSeats: Math.max(safeSeats - 12, 44),
      },
      {
        sectionGroup: "Pitch",
        name: "West Premium",
        price: Math.max(safePrice + 760, 2013),
        availableSeats: Math.max(safeSeats - 18, 28),
      },
    ];
  }

  return [
    {
      sectionGroup: "Stage",
      name: "Fan Pit",
      price: Math.max(safePrice + 1200, safePrice || 2499),
      availableSeats: Math.max(safeSeats - 16, 31),
    },
    {
      sectionGroup: "Stage",
      name: "Gold Circle",
      price: Math.max(safePrice + 500, 1799),
      availableSeats: Math.max(safeSeats, 111),
    },
    {
      sectionGroup: "Stage",
      name: "Regular",
      price: Math.max(safePrice, 999),
      availableSeats: Math.max(safeSeats + 12, 136),
    },
  ];
};

const normalizeSeatZones = (seatZones = [], contentType, basePrice, availableSeats) => {
  const normalizedZones = seatZones
    .map((zone) => ({
      sectionGroup: (zone.sectionGroup || "").trim(),
      name: (zone.name || "").trim(),
      price: Number(zone.price) || 0,
      availableSeats: Math.max(0, Number(zone.availableSeats) || 0),
    }))
    .filter((zone) => zone.name && zone.price > 0);

  if (normalizedZones.length) {
    return normalizedZones;
  }

  return createDefaultSeatZones(contentType, basePrice, availableSeats);
};

const getStartingPrice = (basePrice, seatZones = []) => {
  const prices = seatZones.map((zone) => Number(zone.price) || 0).filter((price) => price > 0);

  if (prices.length) {
    return Math.min(...prices);
  }

  return Number(basePrice) || 0;
};

const serializeEvent = (event) => {
  const contentType = detectContentType(event.category);
  const seatZones = normalizeSeatZones(event.seatZones, contentType, event.price, event.availableSeats);

  return {
    id: event._id.toString(),
    title: event.title,
    subtitle: event.description || `${toTitleCase(event.category)} in ${event.city}`,
    description: event.description || "",
    aboutThisEvent: event.aboutThisEvent || "",
    category: toTitleCase(event.category),
    contentType,
    date: event.date instanceof Date ? event.date.toISOString() : event.date,
    city: event.city,
    venue: event.venue,
    price: getStartingPrice(event.price, seatZones),
    seatZones,
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
  serializeEvent,
};
