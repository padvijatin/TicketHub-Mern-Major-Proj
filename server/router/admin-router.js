const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const adminController = require("../controllers/admin-controller");
const { imageUpload } = require("../middlewares/upload-middleware");

const router = express.Router();

const ensureStaffAccess = (req, res, next) => {
  const role = typeof req.user?.getRole === "function" ? req.user.getRole() : String(req.user?.role || "user").trim().toLowerCase();

  if (!["admin", "organizer"].includes(role)) {
    return res.status(403).json({ message: "Admin or organizer access required" });
  }

  return next();
};

router.use(authMiddleware);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/events", adminController.listEvents);
router.post("/events", ensureStaffAccess, imageUpload.single("poster"), adminController.createEvent);
router.patch("/events/:id", ensureStaffAccess, imageUpload.single("poster"), adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);
router.get("/users", adminController.listUsers);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/coupons", adminController.listCoupons);
router.post("/coupons", adminController.createCoupon);
router.get("/bookings", adminController.listBookings);
router.patch("/bookings/:id", adminController.updateBooking);
router.delete("/bookings/:id", adminController.deleteBooking);

module.exports = router;

