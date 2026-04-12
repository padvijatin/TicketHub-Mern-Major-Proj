import { buildZoneSeatIds, getZoneBookedSeatIds } from "./seatLayout.js";

describe("seatLayout helpers", () => {
  it("builds row-based seat ids when rows and seats per row are provided", () => {
    const seatIds = buildZoneSeatIds({
      name: "Balcony",
      rows: ["A", "B"],
      seatsPerRow: 2,
    });

    expect(seatIds).toEqual(["A1", "A2", "B1", "B2"]);
  });

  it("builds sequential seat ids when only total seats are provided", () => {
    const seatIds = buildZoneSeatIds({
      name: "Main Zone",
      totalSeats: 3,
    });

    expect(seatIds).toEqual(["MZ-1", "MZ-2", "MZ-3"]);
  });

  it("filters booked seats to only those in the zone", () => {
    const booked = getZoneBookedSeatIds(
      { name: "Stage", totalSeats: 2 },
      ["S-1", "S-3"]
    );

    expect(booked).toEqual(["S-1"]);
  });
});
