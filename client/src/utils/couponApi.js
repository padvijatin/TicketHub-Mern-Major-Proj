import axios from "axios";

const authApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
const apiBaseUrl = authApiUrl.replace(/\/auth\/?$/, "");
const couponsApiUrl = `${apiBaseUrl}/coupons`;

const buildHeaders = (authorizationToken) =>
  authorizationToken
    ? {
        Authorization: authorizationToken,
      }
    : undefined;

export const getCoupons = async ({ cartAmount, authorizationToken } = {}) => {
  const response = await axios.get(couponsApiUrl, {
    params: {
      cartAmount,
    },
    headers: buildHeaders(authorizationToken),
  });

  return response.data.coupons || [];
};

export const validateCoupon = async ({ code, cartAmount, authorizationToken }) => {
  const response = await axios.post(
    `${couponsApiUrl}/validate`,
    {
      code,
      cartAmount,
    },
    {
      headers: buildHeaders(authorizationToken),
    }
  );

  return response.data;
};
