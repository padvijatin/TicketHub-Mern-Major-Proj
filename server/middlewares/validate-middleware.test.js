const { z } = require("zod");
const validate = require("./validate-middleware");

describe("validate middleware", () => {
  it("returns 400 when request validation fails", () => {
    const middleware = validate(
      z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
      })
    );

    const req = { body: { name: "Hi" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: ["Name must be at least 3 characters"],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
