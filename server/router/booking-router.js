const express = require("express");
const { z } = require("zod");
const bookingController = require("../controllers/booking-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const validate = require("../middlewares/validate-middleware");

const router = express.Router();

const bookingSchema = z.object({
  eventId: z.string().trim().min(1, "Event id is required"),
  seats: z.array(z.string().trim().min(1, "Seat id is required")).min(1, "Please select at least one seat"),
  couponCode: z.string().trim().optional().default(""),
  paymentMethod: z.string().trim().optional().default("upi"),
  paymentDetails: z.record(z.string(), z.any()).optional().default({}),
  bookingMeta: z.record(z.string(), z.any()).optional().default({}),
});

router.post("/", authMiddleware, validate(bookingSchema), bookingController.createBooking);
router.get("/me", authMiddleware, bookingController.listUserBookings);
router.get("/admin/recent", authMiddleware, bookingController.listRecentBookings);
router.get("/:bookingId", bookingController.getBookingTicketByBookingId);

module.exports = router;

