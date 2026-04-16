import { useMemo, useState } from "react";

const buildProfileInitial = (userName = "", email = "") => {
  const seed = String(userName || email || "U").trim();
  return seed ? seed.charAt(0).toUpperCase() : "U";
};

export const ProfileAvatar = ({
  avatar = "",
  userName = "",
  email = "",
  className = "",
  imageClassName = "",
  fallbackClassName = "",
}) => {
  const [failedAvatar, setFailedAvatar] = useState("");
  const resolvedAvatar = String(avatar || "").trim();
  const profileInitial = useMemo(() => buildProfileInitial(userName, email), [email, userName]);
  const shouldShowImage = Boolean(resolvedAvatar) && failedAvatar !== resolvedAvatar;

  return (
    <span className={className}>
      {shouldShowImage ? (
        <img
          src={resolvedAvatar}
          alt={userName || "Profile"}
          className={imageClassName}
          referrerPolicy="no-referrer"
          onError={() => setFailedAvatar(resolvedAvatar)}
        />
      ) : (
        <span className={fallbackClassName}>{profileInitial}</span>
      )}
    </span>
  );
};
