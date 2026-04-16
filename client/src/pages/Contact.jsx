import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/apiError.js";
import {
  getValidatedFieldClassName,
  hasValidationErrors,
  validateEmail,
  validateMessage,
  validateRequiredText,
} from "../utils/formValidation.js";

const authApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
const apiBaseUrl = authApiUrl.replace(/\/auth\/?$/, "");

const initialFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const initialTouchedState = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

const initialErrorState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const validateContactState = (formData) => ({
  name: validateRequiredText(formData.name, "Name"),
  email: validateEmail(formData.email),
  subject: validateRequiredText(formData.subject, "Subject"),
  message: validateMessage(formData.message, { minLength: 10 }),
});

export const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState(initialErrorState);
  const [touchedFields, setTouchedFields] = useState(initialTouchedState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...formData, [name]: value };
    setFormData(nextState);

    if (touchedFields[name]) {
      setFieldErrors(validateContactState(nextState));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouchedFields((current) => ({ ...current, [name]: true }));
    setFieldErrors(validateContactState(formData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateContactState(formData);

    setTouchedFields({
      name: true,
      email: true,
      subject: true,
      message: true,
    });
    setFieldErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/contact`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      toast.success(response.data.message || "Message sent successfully");
      setFormData(initialFormState);
      setFieldErrors(initialErrorState);
      setTouchedFields(initialTouchedState);
    } catch (error) {
      toast.error(getApiErrorMessage(error, { fallbackMessage: "Unable to send your message" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.4rem] py-[1.2rem] text-[1.45rem] outline-none transition-colors focus:border-[rgba(248,68,100,0.5)]";

  return (
    <section className="min-h-[calc(100vh-15rem)] bg-[radial-gradient(circle_at_top_left,_rgba(248,68,100,0.1),_transparent_26%),linear-gradient(180deg,_#fff8fa_0%,_#f5f5f5_100%)] py-[5rem]">
      <div className="mx-auto w-[min(72rem,calc(100%_-_3.2rem))]">
        <div className="rounded-[2.4rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2.4rem] shadow-[0_24px_60px_rgba(28,28,28,0.08)]">
          <h2 className="text-[2.4rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
            Send us a message
          </h2>
          <p className="mt-[0.7rem] text-[1.45rem] text-[var(--color-text-secondary)]">
            We usually reply within one business day.
          </p>

          <form className="mt-[2rem] grid gap-[1.4rem]" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-[1.4rem] sm:grid-cols-2">
              <div className="grid gap-[0.7rem]">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your name"
                  className={getValidatedFieldClassName(inputClassName, touchedFields.name && Boolean(fieldErrors.name))}
                  aria-invalid={touchedFields.name && Boolean(fieldErrors.name)}
                  required
                />
                {touchedFields.name && fieldErrors.name ? (
                  <p className="text-[1.15rem] font-medium text-[var(--color-error)]">{fieldErrors.name}</p>
                ) : null}
              </div>

              <div className="grid gap-[0.7rem]">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your email"
                  className={getValidatedFieldClassName(inputClassName, touchedFields.email && Boolean(fieldErrors.email))}
                  aria-invalid={touchedFields.email && Boolean(fieldErrors.email)}
                  required
                />
                {touchedFields.email && fieldErrors.email ? (
                  <p className="text-[1.15rem] font-medium text-[var(--color-error)]">{fieldErrors.email}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-[0.7rem]">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Subject"
                className={getValidatedFieldClassName(inputClassName, touchedFields.subject && Boolean(fieldErrors.subject))}
                aria-invalid={touchedFields.subject && Boolean(fieldErrors.subject)}
                required
              />
              {touchedFields.subject && fieldErrors.subject ? (
                <p className="text-[1.15rem] font-medium text-[var(--color-error)]">{fieldErrors.subject}</p>
              ) : null}
            </div>

            <div className="grid gap-[0.7rem]">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell us how we can help"
                rows={7}
                className={getValidatedFieldClassName(inputClassName, touchedFields.message && Boolean(fieldErrors.message))}
                aria-invalid={touchedFields.message && Boolean(fieldErrors.message)}
                required
              />
              {touchedFields.message && fieldErrors.message ? (
                <p className="text-[1.15rem] font-medium text-[var(--color-error)]">{fieldErrors.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] py-[1.2rem] text-[1.45rem] font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
