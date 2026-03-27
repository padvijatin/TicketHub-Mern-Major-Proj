const hashValue = (value = "") =>
  Array.from(String(value)).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0
  );

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const defaultZoneMetaByType = {
  movie: [
    {
      key: "premium",
      colorClass: "bg-[rgba(248,68,100,0.14)]",
      description: "Best view with the strongest screen alignment.",
      perks: ["Prime view", "Fast entry"],
      section: "PR",
    },
    {
      key: "classic",
      colorClass: "bg-[rgba(123,63,228,0.14)]",
      description: "Balanced choice for most movie plans.",
      perks: ["Balanced view", "Popular pick"],
      section: "CL",
    },
    {
      key: "saver",
      colorClass: "bg-[rgba(34,197,94,0.16)]",
      description: "Budget-friendly seats without missing the experience.",
      perks: ["Best value", "Group friendly"],
      section: "SV",
    },
  ],
  sports: [
    {
      key: "north-lower",
      colorClass: "bg-[rgba(248,68,100,0.14)]",
      description: "Closer angle with strong sightlines near the action.",
      perks: ["Closer action", "Popular stand"],
      section: "NL",
    },
    {
      key: "east-stand",
      colorClass: "bg-[rgba(245,158,11,0.16)]",
      description: "Wide stadium view with a lively match-day atmosphere.",
      perks: ["Wide view", "Lively crowd"],
      section: "ES",
    },
    {
      key: "south-lower",
      colorClass: "bg-[rgba(34,197,94,0.16)]",
      description: "Comfortable lower-tier seating for regular fans.",
      perks: ["Comfortable zone", "Easy access"],
      section: "SL",
    },
    {
      key: "west-premium",
      colorClass: "bg-[rgba(123,63,228,0.18)]",
      description: "Premium stand with one of the strongest views in the house.",
      perks: ["Premium view", "Priority access"],
      section: "WP",
    },
  ],
  event: [
    {
      key: "fan-pit",
      colorClass: "bg-[linear-gradient(135deg,#f84464_0%,#ff8f6c_100%)]",
      description: "Closest to the stage with the most energetic crowd.",
      perks: ["Closest entry", "Fast-lane access"],
      section: "FP",
    },
    {
      key: "gold-circle",
      colorClass: "bg-[linear-gradient(135deg,#f59e0b_0%,#facc15_100%)]",
      description: "Balanced view with premium access and smoother entry.",
      perks: ["Premium zone", "Priority support"],
      section: "GC",
    },
    {
      key: "regular",
      colorClass: "bg-[linear-gradient(135deg,#7b3fe4_0%,#4f46e5_100%)]",
      description: "Best everyday pick for group bookings and casual plans.",
      perks: ["General entry", "Open access"],
      section: "RG",
    },
  ],
};

const theaterRowSets = [
  ["A", "B"],
  ["C", "D", "E"],
  ["F", "G"],
  ["H", "I"],
];

const stadiumPositions = [
  { top: "8%", left: "31%", width: "38%", height: "15%" },
  { top: "30%", right: "2%", width: "22%", height: "32%" },
  { bottom: "8%", left: "31%", width: "38%", height: "15%" },
  { top: "30%", left: "2%", width: "22%", height: "32%" },
];

const getZoneMeta = (event, zone, index) => {
  const contentType = event?.contentType === "event" ? "event" : event?.contentType || "event";
  const defaults = defaultZoneMetaByType[contentType] || defaultZoneMetaByType.event;
  const match = defaults.find((item) => item.key === slugify(zone.name)) || defaults[index % defaults.length];
  return match;
};

export const getEventSeatZones = (event = {}) => {
  const zones = Array.isArray(event.seatZones) ? event.seatZones : [];

  if (zones.length) {
    return zones.map((zone, index) => {
      const meta = getZoneMeta(event, zone, index);
      return {
        id: slugify(zone.name) || `${event.contentType || "zone"}-${index + 1}`,
        label: zone.name,
        sectionGroup: zone.sectionGroup || "Tickets",
        price: Number(zone.price) || 0,
        availableSeats: Math.max(0, Number(zone.availableSeats) || 0),
        currency: "Rs ",
        colorClass: meta.colorClass,
        description: meta.description,
        perks: meta.perks,
        section: meta.section,
      };
    });
  }

  return [];
};

export const getBookingType = (event = {}) => {
  if (event.contentType === "movie") {
    return "theater";
  }

  if (event.contentType === "sports") {
    return "stadium";
  }

  return "experience";
};

export const buildSeatCategories = (event = {}) => {
  return getEventSeatZones(event).map((zone, index) => ({
    id: zone.id,
    label: zone.label,
    price: zone.price,
    availableSeats: zone.availableSeats,
    colorClass: zone.colorClass,
    rows: theaterRowSets[index] || theaterRowSets[theaterRowSets.length - 1],
  }));
};

export const generateTheaterSeats = (event = {}) => {
  const categories = buildSeatCategories(event);
  const eventSeed = hashValue(event.id || event.title || "tickethub");
  const seats = [];

  categories.forEach((category, categoryIndex) => {
    const totalSeats = category.rows.length * 12;
    const availableSeats = clamp(category.availableSeats || totalSeats, 0, totalSeats);
    const bookedTarget = Math.max(0, totalSeats - availableSeats);
    let bookedCount = 0;

    category.rows.forEach((row, rowIndex) => {
      Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const seatSeed = eventSeed + categoryIndex * 31 + rowIndex * 17 + number * 13;
        const shouldBook = bookedCount < bookedTarget && (seatSeed % 7 === 0 || seatSeed % 11 === 0);
        const isBooked = shouldBook || bookedTarget - bookedCount >= totalSeats - (rowIndex * 12 + index + 1);

        if (isBooked && bookedCount < bookedTarget) {
          bookedCount += 1;
        }

        seats.push({
          id: `${row}${number}`,
          row,
          number,
          category: category.id,
          price: category.price,
          status: isBooked ? "booked" : "available",
        });
      });
    });
  });

  return seats;
};

export const generateStadiumZones = (event = {}) => {
  return getEventSeatZones(event).map((zone, index) => {
    const totalSeats = Math.max(zone.availableSeats + 80, 120);
    return {
      id: zone.id,
      label: zone.label,
      section: zone.section,
      price: zone.price,
      currency: zone.currency,
      totalSeats,
      bookedSeats: Math.max(0, totalSeats - zone.availableSeats),
      position: stadiumPositions[index] || stadiumPositions[stadiumPositions.length - 1],
    };
  });
};

export const generateExperienceZones = (event = {}) => {
  return getEventSeatZones(event).map((zone) => {
    const totalTickets = Math.max(zone.availableSeats + 40, 80);
    return {
      id: zone.id,
      label: zone.label,
      description: zone.description,
      price: zone.price,
      currency: zone.currency,
      totalTickets,
      soldTickets: Math.max(0, totalTickets - zone.availableSeats),
      colorClass: zone.colorClass,
      perks: zone.perks,
    };
  });
};
