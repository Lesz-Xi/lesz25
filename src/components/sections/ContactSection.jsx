import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { playHoverSound } from "../../utils/soundUtils";

const ContactSection = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const showStatusMessage = (message) => {
    setStatus(message);
    setShowStatus(true);

    // Hide status after 5 seconds
    setTimeout(() => {
      setShowStatus(false);
      // Clear status text after fade out animation completes
      setTimeout(() => setStatus(""), 300);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowStatus(false);
    setStatus("");

    // Debug: Log environment variables
    console.log("Service ID:", import.meta.env.VITE_APP_EMAILJS_SERVICE_ID);
    console.log("Template ID:", import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID);
    console.log("Public Key:", import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);

    try {
      const result = await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      console.log("EmailJS Success:", result);
      setFormData({ name: "", email: "", message: "" });
      showStatusMessage("Message sent successfully!");
    } catch (error) {
      console.error("EMAILJS ERROR:", error);
      showStatusMessage("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.265a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "Email",
      value: "leszatt@gmail.com",
      link: "mailto:leszatt@gmail.com",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      label: "Phone",
      value: "+63 9650640046",
      link: "tel:+639650640046",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: "Location",
      value: "Davao City, Ph",
      link: null,
    },
  ];

  return (
    <section id="contact" className="bg-[#0a0a0a] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-neutral-800 rounded-full text-sm text-white mb-8">
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            Contact
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#929292]">Let's Get in </span>
            <span className="text-[#FFFCE1]">Touch</span>
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Ready to bring your next project to life? Let's discuss how we can
            work together
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="text-[#FFFCE1] font-medium text-lg mb-1">
                    {contact.label}
                  </h3>
                  {contact.link ? (
                    <a
                      href={contact.link}
                      onMouseEnter={playHoverSound}
                      className="text-neutral-400 hover:text-white transition-colors duration-200"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-neutral-400">{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-neutral-900 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-200"
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-200"
                />
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors duration-200 resize-none"
                />
              </div>

              {/* Status Message */}
              {status && (
                <div
                  className={`text-center py-2 transition-all duration-300 transform ${
                    showStatus
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  } ${
                    status.includes("successfully")
                      ? "text-[#FFFCE1]"
                      : "text-[#929292]"
                  } font-medium`}
                >
                  {status}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={playHoverSound}
                className="w-full py-4 px-6 bg-gradient-to-tr from-[#a8a8a8] to-[#FFFCE1]-300 text-white font-medium rounded-xl hover:from-[#FFFCE1] hover:to-[#FFFCE1]-300 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FFFCE1] focus:ring-offset-2 focus:ring-offset-neutral-900"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
