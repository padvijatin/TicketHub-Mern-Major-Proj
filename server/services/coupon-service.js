const Coupon = require("../models/coupon-model");
const { buildCheckoutPricing } = require("./pricing-service");

const isCouponExpired = (expiryDate) => {
  const timestamp = new Date(expiryDate).getTime();
  return Number.isFinite(timestamp) && timestamp < Date.now();
};

const formatCouponOffer = (coupon) => {
  if (coupon.discountType === "percentage") {
    return `${Number(coupon.discountValue) || 0}% OFF${coupon.maxDiscount ? ` up to Rs ${Number(coupon.maxDiscount).toLocaleString("en-IN")}` : ""}`;
  }

  return `Flat Rs ${Number(coupon.discountValue || 0).toLocaleString("en-IN")} OFF`;
};

const serializeCoupon = (coupon, extra = {}) => ({
  id: coupon._id.toString(),
  code: coupon.code,
  discountType: coupon.discountType,
  discountValue: Number(coupon.discountValue) || 0,
  maxDiscount: coupon.maxDiscount == null ? null : Number(coupon.maxDiscount) || 0,
  minOrderAmount: Number(coupon.minOrderAmount) || 0,
  expiryDate: coupon.expiryDate,
  usageLimit: coupon.usageLimit == null ? null : Number(coupon.usageLimit) || 0,
  usedCount: Number(coupon.usedCount) || 0,
  isActive: Boolean(coupon.isActive),
  offerLabel: formatCouponOffer(coupon),
  ...extra,
});

const calculateDiscountAmount = (coupon, cartAmount) => {
  const safeCartAmount = Math.max(0, Number(cartAmount) || 0);

  if (coupon.discountType === "percentage") {
    const rawDiscount = (safeCartAmount * (Number(coupon.discountValue) || 0)) / 100;
    const cap = Number(coupon.maxDiscount);

    if (Number.isFinite(cap) && cap > 0) {
      return Math.min(rawDiscount, cap);
    }

    return rawDiscount;
  }

  return Math.min(safeCartAmount, Math.max(0, Number(coupon.discountValue) || 0));
};

const getActiveCoupons = async () => {
  const coupons = await Coupon.find({
    isActive: true,
    expiryDate: { $gte: new Date() },
  }).sort({ expiryDate: 1, createdAt: -1, code: 1 });

  return coupons;
};

const validateCouponForAmount = async ({ code, cartAmount }) => {
  const normalizedCode = String(code || "").trim().toUpperCase();
  const safeCartAmount = Math.max(0, Number(cartAmount) || 0);

  if (!normalizedCode) {
    return {
      valid: false,
      message: "Please enter a coupon code",
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: null,
    };
  }

  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon) {
    return {
      valid: false,
      message: "Invalid coupon code",
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: null,
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      message: "This coupon is not active right now",
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: serializeCoupon(coupon),
    };
  }

  if (isCouponExpired(coupon.expiryDate)) {
    return {
      valid: false,
      message: "This coupon has expired",
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: serializeCoupon(coupon),
    };
  }

  if (coupon.usageLimit != null && Number(coupon.usedCount) >= Number(coupon.usageLimit)) {
    return {
      valid: false,
      message: "This coupon is no longer available",
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: serializeCoupon(coupon),
    };
  }

  if (safeCartAmount < Number(coupon.minOrderAmount || 0)) {
    const remainingAmount = Math.max(0, Number(coupon.minOrderAmount || 0) - safeCartAmount);
    return {
      valid: false,
      message: `Add Rs ${remainingAmount.toLocaleString("en-IN")} more to use this coupon`,
      pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount: 0 }),
      coupon: serializeCoupon(coupon),
    };
  }

  const discountAmount = Math.round(calculateDiscountAmount(coupon, safeCartAmount));

  return {
    valid: true,
    message: "Coupon applied successfully",
    pricing: buildCheckoutPricing({ cartAmount: safeCartAmount, discountAmount }),
    coupon,
    serializedCoupon: serializeCoupon(coupon),
  };
};

module.exports = {
  getActiveCoupons,
  serializeCoupon,
  validateCouponForAmount,
};
