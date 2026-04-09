const User = require("../models/user-model");

const sanitizeSignalKey = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "_")
    .replace(/\$/g, "_");

const incrementUserInterestSignals = async ({
  userId,
  category = "",
  city = "",
  contentType = "",
  weight = 1,
} = {}) => {
  if (!userId) {
    return;
  }

  const safeWeight = Math.max(1, Number(weight) || 1);
  const categoryKey = sanitizeSignalKey(category);
  const cityKey = sanitizeSignalKey(city);
  const contentTypeKey = sanitizeSignalKey(contentType);
  const incUpdate = {};

  if (categoryKey) {
    incUpdate[`interestSignals.categoryScores.${categoryKey}`] = safeWeight;
  }
  if (cityKey) {
    incUpdate[`interestSignals.cityScores.${cityKey}`] = safeWeight;
  }
  if (contentTypeKey) {
    incUpdate[`interestSignals.contentTypeScores.${contentTypeKey}`] = safeWeight;
  }

  if (!Object.keys(incUpdate).length) {
    return;
  }

  await User.updateOne(
    { _id: userId },
    {
      $inc: incUpdate,
      $set: {
        "interestSignals.lastInteractedAt": new Date(),
      },
    }
  );
};

const getTopSignalKeys = (scoreMap = {}, limit = 5) => {
  if (!scoreMap || typeof scoreMap !== "object") {
    return [];
  }

  return Object.entries(scoreMap)
    .filter(([, score]) => Number(score) > 0)
    .sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0))
    .slice(0, Math.max(1, limit))
    .map(([key]) => String(key || "").trim())
    .filter(Boolean);
};

module.exports = {
  getTopSignalKeys,
  incrementUserInterestSignals,
  sanitizeSignalKey,
};
