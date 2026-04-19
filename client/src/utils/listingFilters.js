export const listingFilterConfigs = {
  movie: {
    title: "Browse Movies",
    quickOptions: [
      { key: "language", value: "Tamil" },
      { key: "language", value: "Malayalam" },
      { key: "date", value: "Upcoming" },
      { key: "format", value: "3D" },
    ],
    groups: [
      {
        key: "language",
        label: "Languages",
        selectionMode: "multiple",
        options: ["Hindi", "English", "Telugu", "Tamil", "Malayalam", "Marathi", "Gujarati"],
      },
      {
        key: "genres",
        label: "Genres",
        selectionMode: "multiple",
        options: ["Action", "Comedy", "Drama", "Thriller", "Romance", "Sci-Fi", "Adventure"],
      },
      {
        key: "format",
        label: "Format",
        selectionMode: "multiple",
        options: ["2D", "3D", "IMAX", "4DX"],
      },
      {
        key: "price",
        label: "Price",
        selectionMode: "single",
        options: ["Under Rs 500", "Rs 500 - 999", "Rs 1000 - 1999"],
      },
      {
        key: "date",
        label: "Dates",
        selectionMode: "single",
        options: ["Today", "This Weekend", "This Month", "Upcoming"],
      },
    ],
  },
  sports: {
    title: "Browse Sports",
    quickOptions: [
      { key: "tags", value: "IPL" },
      { key: "tags", value: "T20" },
      { key: "date", value: "This Weekend" },
      { key: "price", value: "Rs 1000 - 1999" },
    ],
    groups: [
      {
        key: "tags",
        label: "Tags",
        selectionMode: "multiple",
        options: ["IPL", "T20", "ODI", "International"],
      },
      {
        key: "price",
        label: "Price",
        selectionMode: "single",
        options: ["Under Rs 500", "Rs 500 - 999", "Rs 1000 - 1999"],
      },
      {
        key: "date",
        label: "Dates",
        selectionMode: "single",
        options: ["Today", "This Weekend", "This Month", "Upcoming"],
      },
    ],
  },
  event: {
    title: "Browse Events",
    quickOptions: [
      { key: "category", value: "Comedy" },
      { key: "category", value: "Concert" },
      { key: "date", value: "This Weekend" },
      { key: "price", value: "Under Rs 500" },
    ],
    groups: [
      {
        key: "category",
        label: "Categories",
        selectionMode: "single",
        options: ["Comedy", "Workshop", "Concert", "Music", "Festival"],
      },
      {
        key: "price",
        label: "Price",
        selectionMode: "single",
        options: ["Under Rs 500", "Rs 500 - 999", "Rs 1000 - 1999"],
      },
      {
        key: "date",
        label: "Dates",
        selectionMode: "single",
        options: ["Today", "This Weekend", "This Month", "Upcoming"],
      },
    ],
  },
};

const priceParamMap = {
  "Under Rs 500": "under500",
  "Rs 500 - 999": "500-999",
  "Rs 1000 - 1999": "1000-1999",
};

const dateParamMap = {
  Today: "today",
  "This Weekend": "weekend",
  "This Month": "month",
  Upcoming: "upcoming",
};

export const buildEventFilterParams = (pageType, activeFilters = {}) => {
  const params = {
    type: pageType,
  };

  if (pageType === "movie") {
    if (activeFilters.language?.length) {
      params.language = activeFilters.language;
    }

    if (activeFilters.genres?.length) {
      params.genres = activeFilters.genres;
    }

    if (activeFilters.format?.length) {
      params.format = activeFilters.format;
    }
  }

  if (pageType === "sports" && activeFilters.tags?.length) {
    params.tags = activeFilters.tags;
  }

  if (pageType === "event" && activeFilters.category?.length) {
    params.category = activeFilters.category[0];
  }

  if (activeFilters.price?.length) {
    params.price = priceParamMap[activeFilters.price[0]] || "";
  }

  if (activeFilters.date?.length) {
    params.date = dateParamMap[activeFilters.date[0]] || "";
  }

  return params;
};

export const toggleListingFilterValue = (filterConfig, currentFilters, key, value) => {
  const group = filterConfig?.groups?.find((item) => item.key === key);
  const currentValues = currentFilters[key] || [];
  const isSelected = currentValues.includes(value);

  if (group?.selectionMode === "single") {
    return {
      ...currentFilters,
      [key]: isSelected ? [] : [value],
    };
  }

  return {
    ...currentFilters,
    [key]: isSelected
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value],
  };
};
