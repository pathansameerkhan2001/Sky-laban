"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, CheckCircle, Send, Sparkles } from "lucide-react";

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FranchiseModal({ isOpen, onClose }: FranchiseModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetCity: "",
    experience: "",
    notes: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#DDF5FF] text-[#0754C9] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0754C9]" />
              </div>
              <h3 className="text-2xl font-bold text-[#063B91] mb-2">
                Thank You for Your Interest!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Our global franchise development team has received your inquiry for{" "}
                <span className="font-semibold text-[#0754C9]">{formData.targetCity || "your city"}</span>. We will review your profile and reach out within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-[#0754C9] text-white text-sm font-semibold hover:bg-[#0645B8]"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0754C9] uppercase tracking-wider mb-1">
                <Store className="w-4 h-4" />
                <span>Franchise Partnership</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#063B91] mb-2">
                Expand With Sky Laban
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Please provide your contact details and target territory to receive our comprehensive brand brochure and partnership prospectus.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                      placeholder="e.g. partner@example.com"
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
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad, Vijayawada, Warangal"
                      value={formData.targetCity}
                      onChange={(e) => setFormData({ ...formData, targetCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Food & Beverage Experience (Optional)
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9] text-slate-700"
                  >
                    <option value="">Select experience level</option>
                    <option value="none">First-time entrepreneur</option>
                    <option value="retail">Retail / Hospitality experience</option>
                    <option value="multi-unit">Existing multi-unit F&B operator</option>
                    <option value="investment">Institutional investor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Message or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your proposed timeline or vision..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9] focus:ring-1 focus:ring-[#0754C9]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Franchise Inquiry</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
