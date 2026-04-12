import { filterItemsByLocation, matchesLocationSearch, normalizeCity } from "./location-utils.js";

describe("location utils", () => {
  it("normalizes common city aliases", () => {
    expect(normalizeCity("Bombay")).toBe("mumbai");
    expect(normalizeCity("Bangalore")).toBe("bengaluru");
  });

  it("matches cities against search text", () => {
    expect(matchesLocationSearch({ name: "Mumbai", state: "Maharashtra" }, "bombay")).toBe(true);
    expect(matchesLocationSearch({ name: "Surat", state: "Gujarat" }, "delhi")).toBe(false);
  });

  it("filters items by selected city", () => {
    const items = [
      { id: 1, city: "Mumbai" },
      { id: 2, city: "Delhi" },
    ];

    expect(filterItemsByLocation(items, { name: "Bombay" })).toEqual([{ id: 1, city: "Mumbai" }]);
  });
});
