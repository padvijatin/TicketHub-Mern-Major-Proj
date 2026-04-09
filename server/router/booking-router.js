const express = require("express");
const { z } = require("zod");
const bookingController = require("../controllers/booking-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/", authMiddleware, bookingController.createBooking);
router.post("/:bookingId/deliver", authMiddleware, bookingController.deliverBookingTicket);
router.get("/me", authMiddleware, bookingController.listUserBookings);
router.get("/admin/recent", authMiddleware, bookingController.listRecentBookings);
router.get("/:bookingId", bookingController.getBookingTicketByBookingId);

module.exports = router;
