const hashValue = (value = "") =>
  Array.from(String(value)).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0
  );

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
  const basePrice = typeof event.price === "number" ? event.price : 999;

  return [
    {
      id: "premium",
      label: "Premium",
      price: Math.round(basePrice * 1.35),
      colorClass: "bg-[rgba(248,68,100,0.14)]",
      rows: ["A", "B"],
    },
    {
      id: "classic",
      label: "Classic",
      price: basePrice,
      colorClass: "bg-[rgba(123,63,228,0.14)]",
      rows: ["C", "D", "E"],
    },
    {
      id: "budget",
      label: "Saver",
      price: Math.max(199, Math.round(basePrice * 0.75)),
      colorClass: "bg-[rgba(34,197,94,0.16)]",
      rows: ["F", "G"],
    },
  ];
};

export const generateTheaterSeats = (event = {}) => {
  const categories = buildSeatCategories(event);
  const eventSeed = hashValue(event.id || event.title || "tickethub");
  const seats = [];

  categories.forEach((category, categoryIndex) => {
    category.rows.forEach((row, rowIndex) => {
      Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const seatSeed = eventSeed + categoryIndex * 31 + rowIndex * 17 + number * 13;
        const isBooked = seatSeed % 7 === 0 || seatSeed % 11 === 0;

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
  const basePrice = typeof event.price === "number" ? event.price : 1499;
  const eventSeed = hashValue(event.id || event.title || "sports");

  return [
    {
      id: "north-lower",
      label: "North Lower",
      section: "NL",
      price: Math.round(basePrice * 0.9),
      currency: "Rs ",
      totalSeats: 180,
      bookedSeats: clamp(70 + (eventSeed % 45), 50, 160),
      position: { top: "8%", left: "31%", width: "38%", height: "15%" },
    },
    {
      id: "east-stand",
      label: "East Stand",
      section: "E",
      price: Math.round(basePrice * 1.2),
      currency: "Rs ",
      totalSeats: 220,
      bookedSeats: clamp(90 + (eventSeed % 50), 60, 190),
      position: { top: "30%", right: "2%", width: "22%", height: "32%" },
    },
    {
      id: "south-lower",
      label: "South Lower",
      section: "SL",
      price: Math.round(basePrice * 0.95),
      currency: "Rs ",
      totalSeats: 180,
      bookedSeats: clamp(65 + (eventSeed % 40), 40, 150),
      position: { bottom: "8%", left: "31%", width: "38%", height: "15%" },
    },
    {
      id: "west-premium",
      label: "West Premium",
      section: "WP",
      price: Math.round(basePrice * 1.55),
      currency: "Rs ",
      totalSeats: 140,
      bookedSeats: clamp(55 + (eventSeed % 35), 30, 120),
      position: { top: "30%", left: "2%", width: "22%", height: "32%" },
    },
  ];
};

export const generateExperienceZones = (event = {}) => {
  const basePrice = typeof event.price === "number" ? event.price : 1299;
  const eventSeed = hashValue(event.id || event.title || "event");

  return [
    {
      id: "fan-pit",
      label: "Fan Pit",
      description: "Closest to the stage with the most energetic crowd.",
      price: Math.round(basePrice * 1.5),
      currency: "Rs ",
      totalTickets: 160,
      soldTickets: clamp(80 + (eventSeed % 55), 40, 145),
      colorClass: "bg-[linear-gradient(135deg,#f84464_0%,#ff8f6c_100%)]",
      perks: ["Closest entry", "Fast-lane access"],
    },
    {
      id: "gold-circle",
      label: "Gold Circle",
      description: "Balanced view with premium access and smoother entry.",
      price: Math.round(basePrice * 1.2),
      currency: "Rs ",
      totalTickets: 220,
      soldTickets: clamp(95 + (eventSeed % 50), 55, 200),
      colorClass: "bg-[linear-gradient(135deg,#f59e0b_0%,#facc15_100%)]",
      perks: ["Premium zone", "Priority support"],
    },
    {
      id: "regular",
      label: "Regular",
      description: "Best everyday pick for group bookings and casual plans.",
      price: basePrice,
      currency: "Rs ",
      totalTickets: 260,
      soldTickets: clamp(100 + (eventSeed % 60), 70, 230),
      colorClass: "bg-[linear-gradient(135deg,#7b3fe4_0%,#4f46e5_100%)]",
      perks: ["General entry", "Open access"],
    },
  ];
};
