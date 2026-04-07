const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },
    seats: {
      type: [String],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INR",
    },
    gateway: {
      type: String,
      trim: true,
      lowercase: true,
      default: "razorpay",
    },
    paymentMethod: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    orderId: {
      type: String,
      trim: true,
      default: "",
    },
    paymentId: {
      type: String,
      trim: true,
      default: "",
    },
    signature: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "payments",
    timestamps: true,
    versionKey: false,
  }
);

paymentSchema.index({ orderId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ paymentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Payment", paymentSchema);
