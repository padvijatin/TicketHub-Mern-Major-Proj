const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
      default: "",
      trim: true,
    },
    actorId: {
      type: String,
      default: "",
      trim: true,
    },
    actorRole: {
      type: String,
      default: "",
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;

