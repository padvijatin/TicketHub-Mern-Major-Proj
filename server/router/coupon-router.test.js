const express = require("express");
const request = require("supertest");
const couponRouter = require("./coupon-router");

describe("coupon router validation", () => {
  it("rejects invalid coupon validation payloads", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/coupons", couponRouter);

    const response = await request(app).post("/api/coupons/validate").send({
      code: "",
      cartAmount: -10,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});

