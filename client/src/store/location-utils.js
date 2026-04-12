const cityAliasMap = {
  bangalore: "bengaluru",
  bombay: "mumbai",
  calcutta: "kolkata",
  majura: "surat",
};

export const normalizeCity = (value = "") => {
  const normalizedValue = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");

  return cityAliasMap[normalizedValue] || normalizedValue;
};

export const matchesLocationSearch = (city, query) => {
  const normalizedQuery = normalizeCity(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [city.name, city.state]
    .map((value) => normalizeCity(value))
    .filter(Boolean);

  return searchableValues.some((value) => value.includes(normalizedQuery));
};

export const filterItemsByLocation = (items = [], selectedLocation) => {
  if (!selectedLocation?.name || selectedLocation.name === "Select City") {
    return items;
  }

  const selectedCity = normalizeCity(selectedLocation.name);
  return items.filter((item) => {
    const cityValue = normalizeCity(item.city || "");
    return cityValue === selectedCity;
  });
};
