"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Store, ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { FRANCHISE_DATA } from "@/data/brandData";

interface FranchiseProps {
  onOpenFranchiseModal?: () => void;
}

export default function Franchise({ onOpenFranchiseModal }: FranchiseProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="franchise" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background Soft Sky Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-[#DDF5FF]/40 via-white to-[#DDF5FF]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Box */}
        <div className="rounded-3xl bg-gradient-to-br from-[#063B91] via-[#0645B8] to-[#0754C9] p-8 sm:p-12 lg:p-16 text-white shadow-[0_20px_50px_rgba(6,59,145,0.25)] relative overflow-hidden">
          
          {/* Subtle Shimmer Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(67,184,242,0.25),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#DDF5FF] text-xs font-bold tracking-widest uppercase mb-6">
              <Store className="w-3.5 h-3.5 text-[#43B8F2]" />
              <span>BUSINESS OPPORTUNITIES</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              {FRANCHISE_DATA.headline}
            </h2>

            {/* Supporting Copy */}
            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8">
              {FRANCHISE_DATA.subheadline}
            </p>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
              {FRANCHISE_DATA.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#43B8F2] shrink-0" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onOpenFranchiseModal) {
                    onOpenFranchiseModal();
                  } else {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#063B91] hover:bg-[#DDF5FF] font-bold text-base shadow-lg transition-all cursor-pointer"
              >
                <span>Explore Franchise Opportunities</span>
                <ArrowRight className="w-4 h-4 text-[#0754C9]" />
              </motion.button>
            </div>

          </div>

          {/* Decorative Corner Watermark */}
          <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Store className="w-96 h-96 text-white" />
          </div>

        </div>

      </div>
    </section>
  );
}
