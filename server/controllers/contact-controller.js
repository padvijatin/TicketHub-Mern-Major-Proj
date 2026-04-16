const Contact = require("../models/contact-model");
const { getTransporter } = require("../utils/mailer");

const normalizeText = (value = "") => String(value || "").trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const transientMailerErrorCodes = new Set([
  "EAUTH",
  "ECONNECTION",
  "ESOCKET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EHOSTUNREACH",
  "ENOTFOUND",
]);

const getContactFailureStatusCode = (error) => {
  const code = String(error?.code || "").trim().toUpperCase();

  if (error?.message === "Mail server is not configured" || transientMailerErrorCodes.has(code)) {
    return 503;
  }

  return 500;
};

const submitContactForm = async (req, res) => {
  let contactRecord = null;

  try {
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email).toLowerCase();
    const subject = normalizeText(req.body.subject);
    const message = normalizeText(req.body.message);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all contact form fields",
      });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    contactRecord = await Contact.create({
      name,
      email,
      subject,
      message,
      status: "pending",
    });

    const transporter = getTransporter();
    const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!adminEmail || !fromEmail) {
      return res.status(503).json({
        message: "Contact email is not configured on the server",
      });
    }

    await transporter.verify();

    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `TicketHub Contact: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <h2 style="margin-bottom:16px;">New TicketHub Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-line;">${message}</p>
        </div>
      `,
    });

    await Contact.findByIdAndUpdate(contactRecord._id, {
      status: "sent",
      errorMessage: "",
      sentAt: new Date(),
    });

    return res.status(200).json({
      message: "Your message has been sent successfully",
      contactId: contactRecord._id.toString(),
    });
  } catch (error) {
    if (contactRecord?._id) {
      await Contact.findByIdAndUpdate(contactRecord._id, {
        status: "failed",
        errorMessage: normalizeText(error.message).slice(0, 500),
      });
    }

    console.error("Contact form submission failed:", error);

    return res.status(getContactFailureStatusCode(error)).json({
      message:
        error.message === "Mail server is not configured"
          ? "The contact email server is not configured"
          : "Unable to send your message right now",
    });
  }
};

module.exports = {
  submitContactForm,
};
