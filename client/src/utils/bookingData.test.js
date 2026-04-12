import { getBookingType, getEventSeatZones } from "./bookingData.js";

describe("bookingData helpers", () => {
  it("maps content type to the correct booking type", () => {
    expect(getBookingType({ contentType: "movie" })).toBe("theater");
    expect(getBookingType({ contentType: "sports" })).toBe("stadium");
    expect(getBookingType({ contentType: "event" })).toBe("experience");
  });

  it("builds normalized seat zone data from an event", () => {
    const zones = getEventSeatZones({
      contentType: "event",
      seatZones: [
        {
          name: "Fan Pit",
          sectionGroup: "Stage",
          price: 2499,
          rows: ["A", "B"],
          seatsPerRow: 2,
        },
      ],
      bookedSeats: ["A1"],
    });

    expect(zones).toHaveLength(1);
    expect(zones[0].label).toBe("Fan Pit");
    expect(zones[0].totalSeats).toBe(4);
    expect(zones[0].availableSeats).toBe(3);
  });
});
