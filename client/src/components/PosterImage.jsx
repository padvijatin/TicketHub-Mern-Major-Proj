import { useState } from "react";
import { fallbackPosterImage } from "./posterImageUtils.js";

const PosterImage = ({ src = "", alt = "", className = "", fallbackSrc = fallbackPosterImage, onError, ...props }) => {
  const normalizedSrc = String(src || "").trim() || fallbackSrc;
  const [failedSource, setFailedSource] = useState("");
  const imageSrc = failedSource === normalizedSrc ? fallbackSrc : normalizedSrc;

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(eventObject) => {
        if (normalizedSrc !== fallbackSrc) {
          setFailedSource(normalizedSrc);
        }

        onError?.(eventObject);
      }}
    />
  );
};

export default PosterImage;
