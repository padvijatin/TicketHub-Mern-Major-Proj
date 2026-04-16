const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const updateProfileSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^[0-9+\-\s()]{10,20}$/.test(value),
      "Please enter a valid phone number"
    ),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().optional().default(""),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Confirm password must match the new password",
      });
    }
  });

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
};
