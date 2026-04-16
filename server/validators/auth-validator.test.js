const { loginSchema, registerSchema, updateProfileSchema } = require("./auth-validator");

describe("auth validator", () => {
  it("accepts profile updates with a blank phone number", () => {
    const result = updateProfileSchema.safeParse({
      username: "Padvi Jatin",
      phone: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid profile phone numbers", () => {
    const result = updateProfileSchema.safeParse({
      username: "Padvi Jatin",
      phone: "abc",
    });

    expect(result.success).toBe(false);
  });

  it("keeps register and login validation available", () => {
    expect(
      registerSchema.safeParse({
        username: "Padvi Jatin",
        email: "padvi@example.com",
        phone: "9876543210",
        password: "secret12",
      }).success
    ).toBe(true);

    expect(
      loginSchema.safeParse({
        email: "padvi@example.com",
        password: "secret12",
      }).success
    ).toBe(true);
  });
});
