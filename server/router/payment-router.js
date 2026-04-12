const express = require("express");
const { z } = require("zod");
const paymentController = require("../controllers/payment-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");
const { buildRateLimiter } = require("../middlewares/rate-limit");

const router = express.Router();
const paymentLimiter = buildRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: "Too many payment requests. Please wait and try again.",
});

const createOrderSchema = z.object({
  eventId: z.string().trim().min(1, "Event id is required"),
  seats: z.array(z.string().trim().min(1, "Seat id is required")).min(1, "Please select at least one seat"),
  couponCode: z.string().trim().optional().default(""),
  amount: z.coerce.number().min(1, "Amount is required"),
  bookingMeta: z.record(z.string(), z.any()).optional().default({}),
});

const verifyPaymentSchema = z.object({
  eventId: z.string().trim().min(1, "Event id is required"),
  seats: z.array(z.string().trim().min(1, "Seat id is required")).min(1, "Please select at least one seat"),
  couponCode: z.string().trim().optional().default(""),
  amount: z.coerce.number().min(1, "Amount is required"),
  bookingMeta: z.record(z.string(), z.any()).optional().default({}),
  razorpay_order_id: z.string().trim().min(1, "Order id is required"),
  razorpay_payment_id: z.string().trim().min(1, "Payment id is required"),
  razorpay_signature: z.string().trim().min(1, "Signature is required"),
});

router.post("/create-order", paymentLimiter, authMiddleware, validate(createOrderSchema), paymentController.createOrder);
router.post("/verify", paymentLimiter, authMiddleware, validate(verifyPaymentSchema), paymentController.verifyPayment);

module.exports = router;
