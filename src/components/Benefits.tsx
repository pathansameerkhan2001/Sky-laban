"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, Sparkles, Heart, Milk } from "lucide-react";
import { BENEFITS_STRIP_DATA } from "@/data/brandData";

const iconMap = {
  Leaf: Leaf,
  Sparkles: Sparkles,
  Milk: Milk,
  Heart: Heart,
};

export default function Benefits() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full py-12 sm:py-16 bg-gradient-to-b from-[#DDF5FF]/40 via-white to-white border-y border-[#DDF5FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Four Brand Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {BENEFITS_STRIP_DATA.map((benefit, idx) => {
            const Icon = iconMap[benefit.iconName as keyof typeof iconMap] || Sparkles;

            return (
              <motion.div
                key={benefit.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="group relative p-6 rounded-2xl bg-white/80 hover:bg-white border border-[#DDF5FF] hover:border-[#43B8F2]/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Icon Container with subtle blue background */}
                <div className="w-12 h-12 rounded-xl bg-[#DDF5FF] group-hover:bg-[#0754C9] text-[#0754C9] group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#063B91] mb-2 tracking-tight">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Subtle bottom accent line */}
                <div className="w-8 h-0.5 bg-[#43B8F2]/30 group-hover:bg-[#0754C9] group-hover:w-14 rounded-full mt-4 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
