const crypto = require("crypto");
const Razorpay = require("razorpay");
const Booking = require("../models/booking-model");
const Payment = require("../models/payment-model");
const { buildCheckoutPricing } = require("../services/pricing-service");
const { getSeatLockSnapshot } = require("../services/seat-lock-service");
const {
  deliverBookingTicketByBookingId,
  finalizeBooking,
  prepareBookingCheckout,
  serializeBooking,
} = require("./booking-controller");
const { serializeEvent, syncEventSeatState } = require("./event-controller");

let razorpayClient = null;

const normalizeSeatList = (seats = []) =>
  [...new Set((Array.isArray(seats) ? seats : []).map((seat) => String(seat || "").trim()).filter(Boolean))].sort();

const seatListsMatch = (left = [], right = []) => {
  const normalizedLeft = normalizeSeatList(left);
  const normalizedRight = normalizeSeatList(right);

  return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((seat, index) => seat === normalizedRight[index]);
};

const assertStoredPaymentOwnership = ({ paymentRecord, userId, eventId, seats }) => {
  if (!paymentRecord) {
    return;
  }

  const currentUserId = String(userId || "");
  const recordUserId = paymentRecord.user?.toString?.() || "";
  const recordEventId = paymentRecord.event?.toString?.() || "";

  if (recordUserId && recordUserId !== currentUserId) {
    const error = new Error("This payment does not belong to the current user");
    error.statusCode = 403;
    throw error;
  }

  if (recordEventId && eventId && recordEventId !== String(eventId)) {
    const error = new Error("Payment event mismatch");
    error.statusCode = 409;
    throw error;
  }

  if (paymentRecord.seats?.length && seats?.length && !seatListsMatch(paymentRecord.seats, seats)) {
    const error = new Error("Payment seats mismatch");
    error.statusCode = 409;
    throw error;
  }
};

const assertRazorpayOrderOwnership = ({ order, userId, eventId, seats }) => {
  if (!order) {
    return;
  }

  const notes = order.notes || {};
  const orderUserId = String(notes.userId || "").trim();
  const orderEventId = String(notes.eventId || "").trim();
  const orderSeats = String(notes.seats || "")
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean);

  if (orderUserId && orderUserId !== String(userId || "")) {
    const error = new Error("This Razorpay order does not belong to the current user");
    error.statusCode = 403;
    throw error;
  }

  if (orderEventId && eventId && orderEventId !== String(eventId)) {
    const error = new Error("Razorpay order event mismatch");
    error.statusCode = 409;
    throw error;
  }

  if (orderSeats.length && seats?.length && !seatListsMatch(orderSeats, seats)) {
    const error = new Error("Razorpay order seats mismatch");
    error.statusCode = 409;
    throw error;
  }
};

const triggerTicketDeliveryAsync = ({ bookingId, requestedBy }) => {
  if (!bookingId) {
    return;
  }

  setImmediate(async () => {
    try {
      await deliverBookingTicketByBookingId({
        bookingId,
        requestedBy: requestedBy || null,
      });
    } catch (ticketDeliveryError) {
      console.error("payment-ticket-delivery-async-failed", ticketDeliveryError);
    }
  });
};

const getRazorpayClient = () => {
  if (razorpayClient) {
    return razorpayClient;
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayClient;
};

const buildSlimPaymentDetails = (payment = {}) => ({
  vpa: String(payment.vpa || "").trim().toLowerCase(),
  bank: String(payment.bank || "").trim(),
  wallet: String(payment.wallet || "").trim(),
  cardLast4: String(payment.card?.last4 || "").trim(),
});

const getStoredPaymentMethod = (payment = {}) => {
  const method = String(payment.method || "").trim().toLowerCase();

  if (method === "upi" && payment.vpa) {
    return "upi";
  }

  if (method === "card") {
    return "card";
  }

  if (method === "netbanking") {
    return "netbanking";
  }

  if (method === "wallet") {
    return "wallet";
  }

  return method || "razorpay";
};

const buildExistingBookingResponse = async ({ booking, userId }) => {
  const event = await Booking.populate(booking, { path: "event" }).then((result) => result.event);
  const normalizedEvent = syncEventSeatState(event);
  const pricing = buildCheckoutPricing({
    cartAmount: booking.originalAmount || 0,
    discountAmount: booking.discountAmount || 0,
  });
  const seatLocks = getSeatLockSnapshot(normalizedEvent._id.toString(), String(userId || ""));

  return {
    message: "Seats booked successfully",
    bookedSeats: booking.seats || [],
    totalSeats: normalizedEvent.totalSeats,
    availableSeats: normalizedEvent.availableSeats,
    event: serializeEvent(normalizedEvent.toObject ? normalizedEvent.toObject() : normalizedEvent, {}, {}, seatLocks),
    booking: serializeBooking(booking),
    pricing,
  };
};

const upsertPaymentRecord = async ({
  userId,
  eventId,
  bookingId = null,
  seats = [],
  totalAmount = 0,
  currency = "INR",
  paymentMethod = "",
  orderId = "",
  paymentId = "",
  signature = "",
  status = "created",
  paymentDetails = {},
  paidAt = null,
} = {}) => {
  const query = paymentId ? { paymentId } : { orderId };

  if (!query.paymentId && !query.orderId) {
    return null;
  }

  return Payment.findOneAndUpdate(
    query,
    {
      $set: {
        user: userId || null,
        event: eventId || null,
        booking: bookingId || null,
        seats,
        totalAmount,
        currency,
        gateway: "razorpay",
        paymentMethod,
        orderId,
        paymentId,
        signature,
        status,
        paymentDetails,
        paidAt,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );
};

const createOrder = async (req, res) => {
  try {
    const { eventId, seats = [], couponCode = "", amount } = req.body || {};
    const checkout = await prepareBookingCheckout({
      userId: req.user._id.toString(),
      eventId,
      seats,
      couponCode,
      expectedAmount: amount,
    });

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: checkout.pricing.finalAmount * 100,
      currency: "INR",
      receipt: `th_${Date.now().toString(36)}`,
      notes: {
        eventId: String(eventId || ""),
        userId: req.user._id.toString(),
        seats: checkout.requestedSeats.join(","),
      },
    });

    await upsertPaymentRecord({
      userId: req.user._id,
      eventId,
      seats: checkout.requestedSeats,
      totalAmount: checkout.pricing.finalAmount,
      currency: "INR",
      orderId: order.id,
      status: "created",
      paymentDetails: {},
    });

    return res.status(200).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
      pricing: checkout.pricing,
      amount: checkout.pricing.finalAmount,
      currency: "INR",
      seats: checkout.requestedSeats,
    });
  } catch (error) {
    console.error("payment-create-order-failed", error);

    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
        seats: error.seats || [],
        invalidSeats: error.invalidSeats || [],
        valid: error.valid,
        discountAmount: error.discountAmount,
        finalAmount: error.finalAmount,
      });
    }

    return res.status(500).json({ message: "Unable to create payment order right now" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      eventId,
      seats = [],
      couponCode = "",
      bookingMeta = {},
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification fields are required" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await upsertPaymentRecord({
        userId: req.user._id,
        eventId,
        seats,
        totalAmount: Math.max(0, Math.round(Number(amount) || 0)),
        currency: "INR",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "failed",
        paymentDetails: {},
      });

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const storedPaymentRecord = await Payment.findOne({
      $or: [{ paymentId: razorpay_payment_id }, { orderId: razorpay_order_id }],
    }).select("user event seats booking");

    assertStoredPaymentOwnership({
      paymentRecord: storedPaymentRecord,
      userId: req.user._id,
      eventId,
      seats,
    });

    const razorpay = getRazorpayClient();
    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ]);

    assertRazorpayOrderOwnership({
      order,
      userId: req.user._id,
      eventId,
      seats,
    });

    const existingBooking = await Booking.findOne({ paymentId: razorpay_payment_id }).populate("event");
    if (existingBooking) {
      const existingBookingUserId = existingBooking.user?._id?.toString?.() || existingBooking.user?.toString?.() || "";
      if (existingBookingUserId && existingBookingUserId !== req.user._id.toString()) {
        return res.status(403).json({ message: "This booking does not belong to the current user" });
      }

      if (!existingBooking.user && req.user?._id) {
        existingBooking.user = req.user._id;
        await existingBooking.save();
      }

      await upsertPaymentRecord({
        userId: req.user._id,
        eventId: existingBooking.event?._id || eventId,
        bookingId: existingBooking._id,
        seats: existingBooking.seats || seats,
        totalAmount: existingBooking.finalAmount || Math.max(0, Math.round(Number(amount) || 0)),
        currency: "INR",
        paymentMethod: existingBooking.paymentMethod || "",
        orderId: existingBooking.orderId || razorpay_order_id,
        paymentId: existingBooking.paymentId || razorpay_payment_id,
        signature: razorpay_signature,
        status: existingBooking.paymentStatus || "paid",
        paymentDetails: {},
        paidAt: existingBooking.paymentCapturedAt || existingBooking.createdAt || new Date(),
      });

      if (existingBooking.bookingId && existingBooking.ticketEmailStatus !== "sent") {
        triggerTicketDeliveryAsync({
          bookingId: existingBooking.bookingId,
          requestedBy: req.user,
        });
      }

      const existingResponse = await buildExistingBookingResponse({
        booking: existingBooking,
        userId: req.user._id,
      });
      return res.status(200).json(existingResponse);
    }

    if (!payment || !order || payment.order_id !== razorpay_order_id) {
      await upsertPaymentRecord({
        userId: req.user._id,
        eventId,
        seats,
        totalAmount: Math.max(0, Math.round(Number(amount) || 0)),
        currency: "INR",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "failed",
        paymentDetails: {},
      });

      return res.status(400).json({ message: "Payment verification failed" });
    }

    const paymentStatus = String(payment.status || "").toLowerCase();
    if (!["captured", "authorized"].includes(paymentStatus)) {
      await upsertPaymentRecord({
        userId: req.user._id,
        eventId,
        seats,
        totalAmount: Math.max(0, Math.round(Number(amount) || 0)),
        currency: String(payment.currency || "INR").toUpperCase(),
        paymentMethod: getStoredPaymentMethod(payment),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "failed",
        paymentDetails: buildSlimPaymentDetails(payment),
      });

      return res.status(400).json({ message: "Payment was not completed" });
    }

    const normalizedAmount = Math.max(0, Math.round(Number(amount) || 0));
    if (normalizedAmount && Number(payment.amount || 0) !== normalizedAmount * 100) {
      await upsertPaymentRecord({
        userId: req.user._id,
        eventId,
        seats,
        totalAmount: normalizedAmount,
        currency: String(payment.currency || "INR").toUpperCase(),
        paymentMethod: getStoredPaymentMethod(payment),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "failed",
        paymentDetails: buildSlimPaymentDetails(payment),
      });

      return res.status(400).json({ message: "Paid amount does not match order amount" });
    }

    const paymentMethod = getStoredPaymentMethod(payment);
    const finalized = await finalizeBooking({
      user: req.user,
      eventId,
      seats,
      couponCode,
      bookingMeta,
      paymentMethod,
      paymentGateway: "razorpay",
      paymentDetails: {},
      paymentReference: razorpay_payment_id,
      paymentCapturedAt: payment.captured_at ? new Date(payment.captured_at * 1000) : new Date(),
      paymentStatus: "paid",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      expectedAmount: amount,
    });

    await upsertPaymentRecord({
      userId: req.user._id,
      eventId,
      bookingId: finalized.booking?.id || null,
      seats: finalized.bookedSeats || seats,
      totalAmount: finalized.pricing?.finalAmount || normalizedAmount,
      currency: String(payment.currency || "INR").toUpperCase(),
      paymentMethod,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "paid",
      paymentDetails: buildSlimPaymentDetails(payment),
      paidAt: payment.captured_at ? new Date(payment.captured_at * 1000) : new Date(),
    });

    triggerTicketDeliveryAsync({
      bookingId: finalized?.booking?.bookingId,
      requestedBy: req.user,
    });

    return res.status(200).json(finalized);
  } catch (error) {
    console.error("payment-verify-failed", error);

    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
        seats: error.seats || [],
        invalidSeats: error.invalidSeats || [],
        valid: error.valid,
        discountAmount: error.discountAmount,
        finalAmount: error.finalAmount,
      });
    }

    return res.status(500).json({ message: "Unable to verify payment right now" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
