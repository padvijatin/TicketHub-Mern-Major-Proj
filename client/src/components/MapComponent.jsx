import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const toNumber = (value) => Number(value);

const isValidCoordinate = (latitude, longitude) => {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
};

const buildGoogleMapsUrl = ({ latitude, longitude, venueName, address, city }) => {
  if (isValidCoordinate(latitude, longitude)) {
    return `https://www.google.com/maps?q=${toNumber(latitude)},${toNumber(longitude)}`;
  }

  const query = [venueName, address, city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const MapComponent = ({
  latitude,
  longitude,
  venueName,
  address = "",
  city = "",
  heightClassName = "h-[34rem] sm:h-[38rem]",
}) => {
  const [resolvedCoordinates, setResolvedCoordinates] = useState(() =>
    isValidCoordinate(latitude, longitude)
      ? { latitude: toNumber(latitude), longitude: toNumber(longitude), source: "event" }
      : null
  );
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);

  useEffect(() => {
    if (isValidCoordinate(latitude, longitude)) {
      setResolvedCoordinates({
        latitude: toNumber(latitude),
        longitude: toNumber(longitude),
        source: "event",
      });
      setIsResolvingLocation(false);
      return;
    }

    const query = [venueName, address, city].filter(Boolean).join(", ").trim();

    if (!query) {
      setResolvedCoordinates(null);
      setIsResolvingLocation(false);
      return;
    }

    const controller = new AbortController();

    const resolveLocation = async () => {
      try {
        setIsResolvingLocation(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to geocode venue");
        }

        const results = await response.json();
        const firstResult = Array.isArray(results) ? results[0] : null;
        const nextLatitude = Number(firstResult?.lat);
        const nextLongitude = Number(firstResult?.lon);

        if (isValidCoordinate(nextLatitude, nextLongitude)) {
          setResolvedCoordinates({
            latitude: nextLatitude,
            longitude: nextLongitude,
            source: "geocoded",
          });
          return;
        }

        setResolvedCoordinates(null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResolvedCoordinates(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingLocation(false);
        }
      }
    };

    setResolvedCoordinates(null);
    void resolveLocation();

    return () => controller.abort();
  }, [address, city, latitude, longitude, venueName]);

  const hasValidCoordinates = Boolean(resolvedCoordinates);
  const position = hasValidCoordinates
    ? [resolvedCoordinates.latitude, resolvedCoordinates.longitude]
    : null;
  const mapsUrl = buildGoogleMapsUrl({
    latitude: resolvedCoordinates?.latitude ?? latitude,
    longitude: resolvedCoordinates?.longitude ?? longitude,
    venueName,
    address,
    city,
  });
  const fullAddress = [address, city].filter(Boolean).join(", ");

  return (
    <div className="space-y-[1.4rem]">
      <div
        className={`overflow-hidden rounded-[2rem] border border-[rgba(28,28,28,0.08)] bg-[linear-gradient(180deg,#f7f9fc_0%,#eef2f7_100%)] shadow-[0_16px_38px_rgba(28,28,28,0.08)] ${heightClassName}`}
      >
        {hasValidCoordinates ? (
          <MapContainer
            center={position}
            zoom={15}
            zoomControl={false}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            <Marker position={position}>
              <Popup>
                <div className="min-w-[18rem]">
                  <p className="text-[1.4rem] font-bold text-[var(--color-text-primary)]">{venueName}</p>
                  {fullAddress ? (
                    <p className="mt-[0.4rem] text-[1.25rem] leading-[1.5] text-[var(--color-text-secondary)]">
                      {fullAddress}
                    </p>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-[2rem] text-center">
            <span className="flex h-[5.6rem] w-[5.6rem] items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[0_12px_30px_rgba(28,28,28,0.08)]">
              <MapPin className="h-[2.4rem] w-[2.4rem]" />
            </span>
            <p className="mt-[1.4rem] text-[1.75rem] font-bold text-[var(--color-text-primary)]">
              {isResolvingLocation ? "Finding venue on map" : "Venue map unavailable"}
            </p>
            <p className="mt-[0.7rem] max-w-[34rem] text-[1.4rem] leading-[1.7] text-[var(--color-text-secondary)]">
              {isResolvingLocation
                ? "We are matching the venue address to a real location so the map can load correctly."
                : "We could not load map coordinates for this event yet. You can still open the venue directly in Google Maps."}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-[1.2rem] rounded-[1.8rem] border border-[rgba(28,28,28,0.06)] bg-[rgba(28,28,28,0.02)] px-[1.5rem] py-[1.4rem]">
        <div className="min-w-0">
          <p className="text-[1.55rem] font-bold text-[var(--color-text-primary)]">{venueName || "Venue"}</p>
          <p className="mt-[0.35rem] text-[1.35rem] leading-[1.6] text-[var(--color-text-secondary)]">
            {fullAddress || city || "Address will be updated soon"}
          </p>
          {hasValidCoordinates ? (
            <p className="mt-[0.45rem] text-[1.2rem] text-[var(--color-text-secondary)]">
              Lat: {resolvedCoordinates.latitude.toFixed(6)} | Lng: {resolvedCoordinates.longitude.toFixed(6)}
              {resolvedCoordinates.source === "geocoded" ? " | Auto-detected from venue address" : ""}
            </p>
          ) : null}
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-[4.4rem] shrink-0 items-center justify-center gap-[0.7rem] rounded-[1.4rem] bg-[var(--color-primary)] px-[1.5rem] text-[1.35rem] font-bold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
        >
          Open in Google Maps
          <ExternalLink className="h-[1.6rem] w-[1.6rem]" />
        </a>
      </div>
    </div>
  );
};
