const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    seats: {
      type: [String],
      default: [],
    },
    summary: {
      type: [
        {
          label: { type: String, trim: true, default: "" },
          count: { type: Number, default: 0, min: 0 },
          price: { type: Number, default: 0, min: 0 },
          currency: { type: String, trim: true, default: "Rs " },
        },
      ],
      default: [],
    },
    bookingMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    originalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    paymentMethod: {
      type: String,
      trim: true,
      lowercase: true,
      default: "razorpay",
    },
    paymentGateway: {
      type: String,
      trim: true,
      lowercase: true,
      default: "razorpay",
    },
    paymentReference: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    orderId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    paymentId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    paymentCapturedAt: {
      type: Date,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    qrPayload: {
      type: String,
      trim: true,
      default: "",
    },
    qrCodeDataUrl: {
      type: String,
      trim: true,
      default: "",
    },
    ticketImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    ticketEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    ticketEmailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "bookings",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
