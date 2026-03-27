const nodemailer = require("nodemailer");

let cachedTransporter = null;

const getMailerConfig = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
});

const createTransporter = () => {
  const config = getMailerConfig();

  if (!config.host || !config.user || !config.pass) {
    throw new Error("Mail server is not configured");
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter();
  }

  return cachedTransporter;
};

module.exports = {
  createTransporter,
  getTransporter,
};
