const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "wishlist",
    versionKey: false,
  }
);

wishlistSchema.index({ user: 1, event: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
