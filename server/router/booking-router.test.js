const express = require("express");
const request = require("supertest");
const bookingRouter = require("./booking-router");

describe("booking router auth guard", () => {
  it("rejects unauthorized booking history access", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/bookings", bookingRouter);

    const response = await request(app).get("/api/bookings/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized access");
  });
});

