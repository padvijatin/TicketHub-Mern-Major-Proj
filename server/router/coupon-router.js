const express = require("express");
const { z } = require("zod");
const couponController = require("../controllers/coupon-controller");
const validate = require("../middlewares/validate-middleware");

const router = express.Router();

const validateCouponSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  cartAmount: z.coerce.number().min(0, "Cart amount must be valid"),
});

router.get("/", couponController.getCoupons);
router.post("/validate", validate(validateCouponSchema), couponController.validateCoupon);

module.exports = router;
