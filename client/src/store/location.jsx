import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getEvents } from "../utils/eventApi.js";

const STORAGE_KEY = "tickethub_location";

const popularCities = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Delhi", state: "Delhi" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Surat", state: "Gujarat" },
];

const otherCities = [
  { name: "Agartala", state: "Tripura" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Ahmednagar", state: "Maharashtra" },
  { name: "Ajmer", state: "Rajasthan" },
  { name: "Akola", state: "Maharashtra" },
  { name: "Aligarh", state: "Uttar Pradesh" },
  { name: "Allahabad", state: "Uttar Pradesh" },
  { name: "Alwar", state: "Rajasthan" },
  { name: "Amravati", state: "Maharashtra" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Anand", state: "Gujarat" },
  { name: "Asansol", state: "West Bengal" },
  { name: "Aurangabad", state: "Maharashtra" },
  { name: "Bareilly", state: "Uttar Pradesh" },
  { name: "Belgaum", state: "Karnataka" },
  { name: "Bhavnagar", state: "Gujarat" },
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Bhuj", state: "Gujarat" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Bikaner", state: "Rajasthan" },
  { name: "Bilaspur", state: "Chhattisgarh" },
  { name: "Calicut", state: "Kerala" },
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Dhanbad", state: "Jharkhand" },
  { name: "Faridabad", state: "Haryana" },
  { name: "Gandhinagar", state: "Gujarat" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Goa", state: "Goa" },
  { name: "Guntur", state: "Andhra Pradesh" },
  { name: "Gurgaon", state: "Haryana" },
  { name: "Guwahati", state: "Assam" },
  { name: "Gwalior", state: "Madhya Pradesh" },
  { name: "Hubli", state: "Karnataka" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jalandhar", state: "Punjab" },
  { name: "Jamnagar", state: "Gujarat" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Kochi", state: "Kerala" },
  { name: "Kolhapur", state: "Maharashtra" },
  { name: "Kota", state: "Rajasthan" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Mangalore", state: "Karnataka" },
  { name: "Meerut", state: "Uttar Pradesh" },
  { name: "Mysore", state: "Karnataka" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Patna", state: "Bihar" },
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Salem", state: "Tamil Nadu" },
  { name: "Siliguri", state: "West Bengal" },
  { name: "Surat", state: "Gujarat" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Thiruvananthapuram", state: "Kerala" },
  { name: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Warangal", state: "Telangana" },
];

const cityAliases = {
  mumbai: ["bombay", "navi mumbai", "greater mumbai", "mumbai suburban"],
  bangalore: ["bengaluru", "bangalore urban", "bengaluru urban"],
  delhi: ["new delhi", "delhi ncr", "national capital territory of delhi"],
  hyderabad: ["hyderabad district"],
  ahmedabad: ["ahmadabad"],
  chennai: ["madras"],
  kolkata: ["calcutta"],
  surat: ["surat city"],
  pune: ["poona", "pimpri chinchwad", "pimpri-chinchwad"],
  gurgaon: ["gurugram"],
  mysore: ["mysuru"],
  kochi: ["cochin", "ernakulam"],
  calicut: ["kozhikode"],
  thiruvananthapuram: ["trivandrum"],
  vadodara: ["baroda"],
  prayagraj: ["allahabad"],
  visakhapatnam: ["vizag", "visakhapatnam district"],
  noida: ["gautam buddha nagar"],
  goa: ["panaji", "panaji", "north goa", "south goa", "margao", "madgaon"],
};

const normalizeCity = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");

const buildCanonicalCityMap = (cities = []) => {
  const canonicalMap = new Map();

  cities.forEach((city) => {
    const normalizedName = normalizeCity(city.name);

    if (!normalizedName) {
      return;
    }

    canonicalMap.set(normalizedName, city.name);

    (cityAliases[normalizedName] || []).forEach((alias) => {
      canonicalMap.set(normalizeCity(alias), city.name);
    });
  });

  Object.entries(cityAliases).forEach(([canonicalName, aliases]) => {
    if (!canonicalMap.has(canonicalName)) {
      canonicalMap.set(canonicalName, canonicalName);
    }

    aliases.forEach((alias) => {
      canonicalMap.set(normalizeCity(alias), canonicalMap.get(canonicalName) || canonicalName);
    });
  });

  return canonicalMap;
};

const getCanonicalCityName = (value, canonicalMap) => canonicalMap.get(normalizeCity(value)) || "";

const buildLocationSearchTokens = (cityName, canonicalMap) => {
  const canonicalName = getCanonicalCityName(cityName, canonicalMap) || cityName;
  const normalizedCanonicalName = normalizeCity(canonicalName);
  const aliasTokens = cityAliases[normalizedCanonicalName] || [];

  return [...new Set([canonicalName, ...aliasTokens].map((token) => normalizeCity(token)).filter(Boolean))];
};

export const matchesLocationSearch = (city, query, availableCities = []) => {
  const normalizedQuery = normalizeCity(query);

  if (!normalizedQuery) {
    return true;
  }

  const canonicalMap = buildCanonicalCityMap(availableCities.length ? availableCities : [...popularCities, ...otherCities]);
  const searchableValues = [
    city.name,
    city.state,
    ...buildLocationSearchTokens(city.name, canonicalMap),
  ]
    .map((value) => normalizeCity(value))
    .filter(Boolean);

  return searchableValues.some((value) => value.includes(normalizedQuery));
};

const readStoredLocation = () => {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
};

const persistLocation = (location) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
};

const reverseGeocode = async (latitude, longitude) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to reverse geocode location");
  }

  const data = await response.json();
  const address = data.address || {};
  const city = address.city || address.town || address.county || address.state_district || address.village;
  const state = address.state || address.region || "";

  if (!city) {
    throw new Error("Unable to determine city");
  }

  return { name: city, state, latitude, longitude, source: "auto" };
};

const detectLocationByIp = async () => {
  const response = await fetch("https://ipapi.co/json/");

  if (!response.ok) {
    throw new Error("Unable to detect IP location");
  }

  const data = await response.json();

  if (!data.city) {
    throw new Error("No IP city found");
  }

  return {
    name: data.city,
    state: data.region || data.region_code || "",
    latitude: Number(data.latitude) || null,
    longitude: Number(data.longitude) || null,
    source: "auto",
  };
};

const mapCityToKnownOption = (city = {}, allCities = []) => {
  const canonicalMap = buildCanonicalCityMap(allCities);
  const normalizedName = getCanonicalCityName(city.name, canonicalMap) || normalizeCity(city.name);
  const knownCity = allCities.find((option) => normalizeCity(option.name) === normalizedName);

  return knownCity
    ? {
        ...knownCity,
        latitude: city.latitude ?? knownCity.latitude ?? null,
        longitude: city.longitude ?? knownCity.longitude ?? null,
        source: city.source || knownCity.source || "manual",
      }
    : city;
};

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(readStoredLocation());
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const initialDetectionAttemptedRef = useRef(false);

  const allCities = useMemo(() => {
    const merged = [...popularCities, ...otherCities, ...availableCities];
    const seen = new Set();

    return merged.filter((city) => {
      const normalizedName = normalizeCity(city.name);

      if (!normalizedName || seen.has(normalizedName)) {
        return false;
      }

      seen.add(normalizedName);
      return true;
    });
  }, [availableCities]);

  const chooseCity = useCallback(
    (city, options = {}) => {
      const nextLocation = mapCityToKnownOption(
        {
          ...city,
          source: options.source || city.source || "manual",
        },
        allCities.length ? allCities : [...popularCities, ...otherCities]
      );

      setSelectedLocation(nextLocation);
      persistLocation(nextLocation);

      if (!options.silent) {
        toast.success(`${nextLocation.name} selected`);
      }

      return nextLocation;
    },
    [allCities]
  );

  const detectCurrentLocation = useCallback(async () => {
    setIsDetectingLocation(true);

    try {
      let detectedLocation = null;

      if (navigator.geolocation) {
        try {
          detectedLocation = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const city = await reverseGeocode(position.coords.latitude, position.coords.longitude);
                  resolve(city);
                } catch (error) {
                  reject(error);
                }
              },
              (error) => reject(error),
              {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 300000,
              }
            );
          });
        } catch {
          detectedLocation = null;
        }
      }

      if (!detectedLocation) {
        detectedLocation = await detectLocationByIp();
      }

      return chooseCity(detectedLocation, { source: "auto" });
    } catch {
      toast.error("Location detection failed. Please select your city manually.");
      return null;
    } finally {
      setIsDetectingLocation(false);
    }
  }, [chooseCity]);

  useEffect(() => {
    let ignore = false;

    const loadAvailableCities = async () => {
      try {
        const events = await getEvents({ limit: 300 });
        const seenCities = new Set();
        const cityOptions = [];

        events.forEach((event) => {
          const normalizedName = normalizeCity(event.city || "");

          if (!normalizedName || seenCities.has(normalizedName)) {
            return;
          }

          seenCities.add(normalizedName);
          cityOptions.push({
            name: event.city,
            state: event.state || "",
          });
        });

        if (!ignore) {
          setAvailableCities(cityOptions);
        }
      } catch {
        if (!ignore) {
          setAvailableCities([]);
        }
      }
    };

    loadAvailableCities();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (initialDetectionAttemptedRef.current || selectedLocation) {
      return;
    }

    initialDetectionAttemptedRef.current = true;

    const runInitialSelection = async () => {
      const detectedLocation = await detectCurrentLocation();

      if (!detectedLocation) {
        chooseCity(allCities[0] || popularCities[0], { silent: true, source: "fallback" });
      }
    };

    runInitialSelection();
  }, [allCities, chooseCity, detectCurrentLocation, selectedLocation]);

  const value = useMemo(
    () => ({
      allCities,
      chooseCity,
      detectCurrentLocation,
      isDetectingLocation,
      popularCities,
      selectedLocation: selectedLocation || { name: "Select City", state: "Choose location", source: "fallback" },
    }),
    [allCities, chooseCity, detectCurrentLocation, isDetectingLocation, selectedLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationStore = () => useContext(LocationContext);

export const filterItemsByLocation = (items = [], selectedLocation) => {
  if (!selectedLocation?.name || selectedLocation.name === "Select City") {
    return items;
  }

  const itemCities = items
    .map((item) => ({
      name: item.city || "",
      state: item.state || "",
    }))
    .filter((city) => city.name);
  const canonicalMap = buildCanonicalCityMap([...popularCities, ...otherCities, ...itemCities]);
  const selectedCity = getCanonicalCityName(selectedLocation.name, canonicalMap) || normalizeCity(selectedLocation.name);
  const selectedTokens = buildLocationSearchTokens(selectedLocation.name, canonicalMap);
  const matchingItems = items.filter((item) => {
    const cityValue = getCanonicalCityName(item.city || "", canonicalMap) || normalizeCity(item.city || "");

    if (cityValue && cityValue === selectedCity) {
      return true;
    }

    const searchableFields = [item.location, item.venue, item.address, item.city]
      .map((value) => normalizeCity(value || ""))
      .filter(Boolean);

    return selectedTokens.some((token) =>
      searchableFields.some((field) => field === token || field.includes(token))
    );
  });

  return matchingItems.length ? matchingItems : items;
};
