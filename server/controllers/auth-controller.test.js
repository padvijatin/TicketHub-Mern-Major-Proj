const User = require("../models/user-model");
const authController = require("./auth-controller");

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

describe("auth controller status codes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 409 when registration email already exists", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue({ _id: "existing-user-id" });
    const req = {
      body: {
        username: "Test User",
        email: "test@example.com",
        phone: "9876543210",
        password: "Password@123",
      },
    };
    const res = createResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
  });

  it("returns 401 for invalid login credentials", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue(null);
    const req = {
      body: {
        email: "missing@example.com",
        password: "Password@123",
      },
    };
    const res = createResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("returns 409 when a Google-only account tries password login", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue({
      password: null,
      status: "active",
    });
    const req = {
      body: {
        email: "google@example.com",
        password: "Password@123",
      },
    };
    const res = createResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "This account uses Google sign-in. Please continue with Google.",
    });
  });
});
