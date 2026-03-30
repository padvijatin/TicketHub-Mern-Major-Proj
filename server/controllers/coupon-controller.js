const { getActiveCoupons, serializeCoupon, validateCouponForAmount } = require("../services/coupon-service");

const getCoupons = async (req, res) => {
  try {
    const cartAmount = Math.max(0, Number(req.query.cartAmount) || 0);
    const coupons = await getActiveCoupons();

    const responseCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        if (!cartAmount) {
          return serializeCoupon(coupon);
        }

        const validation = await validateCouponForAmount({ code: coupon.code, cartAmount });

        return serializeCoupon(coupon, {
          isEligible: validation.valid,
          eligibilityMessage: validation.valid ? "Applicable" : validation.message,
          potentialDiscountAmount: validation.valid ? validation.pricing.discountAmount : 0,
        });
      })
    );

    return res.status(200).json({ coupons: responseCoupons });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load coupons right now" });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const validation = await validateCouponForAmount({
      code: req.body.code,
      cartAmount: req.body.cartAmount,
    });

    return res.status(validation.valid ? 200 : 400).json({
      valid: validation.valid,
      message: validation.message,
      discountAmount: validation.pricing.discountAmount,
      finalAmount: validation.pricing.finalAmount,
      cartAmount: validation.pricing.cartAmount,
      convenienceFee: validation.pricing.convenienceFee,
      gstAmount: validation.pricing.gstAmount,
      coupon: validation.valid ? validation.serializedCoupon : validation.coupon,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to validate coupon right now" });
  }
};

module.exports = {
  getCoupons,
  validateCoupon,
};
