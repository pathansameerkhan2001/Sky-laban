"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle } from "lucide-react";

interface LetConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LetConnectModal({ isOpen, onClose }: LetConnectModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Hyderabad",
    subject: "Dessert Catering & Events",
    message: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          type: "contact",
          message: `Subject: ${formData.subject}. Message: ${formData.message}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }
      setSubmitted(true);
    } catch {
      setErrorMsg("Failed to send message. Please try again or call our hotline.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#063B91]/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden z-10 my-8 p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#DDF5FF] text-[#0754C9] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0754C9]" />
              </div>
              <h3 className="text-2xl font-bold text-[#063B91] mb-2">
                Message Sent!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Thank you for reaching out to Sky Laban. Our concierge team has received your message and will respond shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-[#0754C9] text-white text-sm font-semibold hover:bg-[#0645B8] cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0754C9] uppercase tracking-wider mb-1">
                <Send className="w-3.5 h-3.5" />
                <span>Get in Touch</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#063B91] mb-2">
                Let&apos;s Connect
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5">
                Have a question about our creamy desserts, wholesale orders, or private catering? We’d love to hear from you.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9] text-slate-700"
                    >
                      <option value="Dessert Catering & Events">Dessert Catering &amp; Events</option>
                      <option value="Product Inquiries & Feedback">Product Inquiries &amp; Feedback</option>
                      <option value="Wholesale & Bulk Supply">Wholesale &amp; Bulk Supply</option>
                      <option value="Press & Media">Press &amp; Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we bring creamy happiness to your table?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
