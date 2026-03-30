const buildCheckoutPricing = ({ cartAmount = 0, discountAmount = 0 }) => {
  const safeCartAmount = Math.max(0, Math.round(Number(cartAmount) || 0));
  const safeDiscountAmount = Math.min(safeCartAmount, Math.max(0, Math.round(Number(discountAmount) || 0)));
  const discountedSubtotal = Math.max(0, safeCartAmount - safeDiscountAmount);
  const convenienceFee = Math.round(safeCartAmount * 0.02);
  const gstAmount = Math.round(discountedSubtotal * 0.18 * 0.02);

  return {
    cartAmount: safeCartAmount,
    discountAmount: safeDiscountAmount,
    convenienceFee,
    gstAmount,
    finalAmount: discountedSubtotal + convenienceFee + gstAmount,
  };
};

module.exports = {
  buildCheckoutPricing,
};
