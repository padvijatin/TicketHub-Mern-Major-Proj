export const fallbackPosterImage = "/fallback.jpg";

export const resolvePosterSource = (value = "") => String(value || "").trim() || fallbackPosterImage;
