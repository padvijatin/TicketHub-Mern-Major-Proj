const mongoose = require("mongoose");

const tokenBlocklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      default: "logout",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenBlocklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlocklist =
  mongoose.models.TokenBlocklist || mongoose.model("TokenBlocklist", tokenBlocklistSchema);

module.exports = TokenBlocklist;
