const User = require("../models/user-model");

const normalizeRole = (value = "") => {
  const normalizedValue = String(value || "")
    .trim()
    .toLowerCase();

  if (["user", "organizer", "admin"].includes(normalizedValue)) {
    return normalizedValue;
  }

  return "user";
};

const serializeUser = (user) => {
  const role = typeof user.getRole === "function" ? user.getRole() : normalizeRole(user.role);

  return {
    username: user.username,
    email: user.email,
    phone: user.phone,
    role,
  };
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userCreated = await User.create({
      username,
      email,
      phone,
      password,
      role: "user",
    });

    return res.status(201).json({
      message: "Registration successful",
      token: userCreated.generateToken(),
      userId: userCreated._id.toString(),
      user: serializeUser(userCreated),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: userExist.generateToken(),
      userId: userExist._id.toString(),
      user: serializeUser(userExist),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const user = async (req, res) => {
  return res.status(200).json({ user: serializeUser(req.user) });
};

const logout = async (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  user,
  logout,
};
