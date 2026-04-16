const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const TokenBlocklist = require("../models/token-blocklist-model");
const { getJwtSecretOrThrow } = require("../utils/runtime-config");

const resolveAuthContext = async (req) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const decoded = jwt.verify(token, getJwtSecretOrThrow());
  const blockedToken = await TokenBlocklist.findOne({ token }).select("_id").lean();

  if (blockedToken) {
    const error = new Error("Token has been revoked");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  if (String(user.status || "active").toLowerCase() !== "active") {
    const error = new Error("Your account is blocked. Please contact support.");
    error.statusCode = 403;
    throw error;
  }

  return {
    token,
    user,
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    const context = await resolveAuthContext(req);
    if (!context) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = context.user;
    req.token = context.token;
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({ message: error.message || "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
module.exports.resolveAuthContext = resolveAuthContext;
