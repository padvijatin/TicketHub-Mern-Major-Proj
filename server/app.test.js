const request = require("supertest");
const { createApp } = require("./app");

describe("server app", () => {
  it("returns the health message on the root route", async () => {
    const { app } = createApp();
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "TicketHub server is running",
    });
  });
});
