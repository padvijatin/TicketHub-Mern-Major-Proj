const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const allowedRoles = ["user", "organizer", "admin"];
const allowedStatuses = ["active", "blocked"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: allowedRoles,
      default: "user",
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: "active",
      trim: true,
      lowercase: true,
    },
    wishlist: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
          required: true,
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interestSignals: {
      categoryScores: {
        type: Map,
        of: Number,
        default: {},
      },
      cityScores: {
        type: Map,
        of: Number,
        default: {},
      },
      contentTypeScores: {
        type: Map,
        of: Number,
        default: {},
      },
      lastInteractedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function save() {
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getRole = function getRole() {
  if (allowedRoles.includes(this.role)) {
    return this.role;
  }

  return "user";
};

userSchema.methods.getStatus = function getStatus() {
  if (allowedStatuses.includes(this.status)) {
    return this.status;
  }

  return "active";
};

userSchema.methods.generateToken = function generateToken() {
  const role = this.getRole();
  const status = this.getStatus();

  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      role,
      status,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
