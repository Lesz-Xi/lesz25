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
    <section id="contact" className="py-20 md:py-32" style={{ backgroundColor: "#070707" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-6 block">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            <span className="opacity-60">Let's Get in </span>
            <span>Touch</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-general-sans">
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
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white shadow-sm">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">
                    {contact.label}
                  </h3>
                  {contact.link ? (
                    <a
                      href={contact.link}
                      onMouseEnter={playHoverSound}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-white/60">{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Contact Form */}
          {/* Right Side - Contact Form */}
          <div className="bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* Decorative background accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#DBD5B5]/5 rounded-full blur-3xl group-hover:bg-[#DBD5B5]/10 transition-colors duration-700" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10" ref={formRef}>
              {/* Name Field */}
              <div className="group/input">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-display uppercase tracking-[0.1em] text-xs placeholder:text-white/20 focus:outline-none focus:border-[#DBD5B5]/30 focus:bg-white/[0.05] transition-all duration-300"
                />
              </div>

              {/* Email Field */}
              <div className="group/input">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-display uppercase tracking-[0.1em] text-xs placeholder:text-white/20 focus:outline-none focus:border-[#DBD5B5]/30 focus:bg-white/[0.05] transition-all duration-300"
                />
              </div>

              {/* Message Field */}
              <div className="group/input">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-display uppercase tracking-[0.1em] text-xs placeholder:text-white/20 focus:outline-none focus:border-[#DBD5B5]/30 focus:bg-white/[0.05] transition-all duration-300 resize-none"
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
                      ? "text-[#DBD5B5]"
                      : "text-red-400/60"
                  } text-[10px] font-pixel uppercase tracking-[0.2em]`}
                >
                  {status}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={playHoverSound}
                className="w-full py-5 px-8 rounded-2xl relative overflow-hidden group/btn transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {/* Button Background & Border */}
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl group-hover/btn:bg-[#DBD5B5]/[0.08] group-hover/btn:border-[#DBD5B5]/30 transition-all duration-500" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
                
                {/* Button Text */}
                <span className="relative z-10 text-[11px] font-display uppercase tracking-[0.3em] text-white/80 group-hover/btn:text-white transition-colors duration-300">
                  {loading ? "Transmitting..." : "Send Message"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
