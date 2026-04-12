const express = require("express");
const request = require("supertest");
const authRouter = require("./auth-router");

describe("auth router validation", () => {
  it("rejects invalid register payloads before controller logic runs", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);

    const response = await request(app).post("/api/auth/register").send({
      username: "ab",
      email: "invalid-email",
      phone: "123",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it("rejects invalid login payloads before controller logic runs", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);

    const response = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});
