import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const authApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
const apiBaseUrl = authApiUrl.replace(/\/auth\/?$/, "");

const initialFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send your message");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form className="mt-[2rem] grid gap-[1.4rem]" onSubmit={handleSubmit}>
            <div className="grid gap-[1.4rem] sm:grid-cols-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.4rem] py-[1.2rem] text-[1.45rem] outline-none transition-colors focus:border-[rgba(248,68,100,0.5)]"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.4rem] py-[1.2rem] text-[1.45rem] outline-none transition-colors focus:border-[rgba(248,68,100,0.5)]"
                required
              />
            </div>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.4rem] py-[1.2rem] text-[1.45rem] outline-none transition-colors focus:border-[rgba(248,68,100,0.5)]"
              required
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help"
              rows={7}
              className="rounded-[1.4rem] border border-[rgba(28,28,28,0.12)] bg-white px-[1.4rem] py-[1.2rem] text-[1.45rem] outline-none transition-colors focus:border-[rgba(248,68,100,0.5)]"
              required
            />

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
