"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getMediaUrl } from "@/lib/media";

export default function OpeningAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Only play once per browser session and respect reduced-motion
    try {
      const hasSeen = sessionStorage.getItem("sky_laban_opening_seen");
      if (hasSeen || shouldReduceMotion) {
        return;
      }
    } catch {
      // In case sessionStorage is blocked in privacy mode
    }

    setIsVisible(true);

    // Complete the animation in ~1.2s
    const timer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem("sky_laban_opening_seen", "true");
      } catch {}
    }, 1200);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="opening-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#F4FAFF] via-white to-[#EAF6FF] pointer-events-none select-none"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-[#43B8F2]/15 blur-3xl pointer-events-none" />

          {/* Centered Brand Logo & Refined Progress Effect */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            {/* Logo Reveal with Gentle Scale & Opacity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 sm:w-60 md:w-72 h-16 sm:h-20 md:h-24 drop-shadow-[0_8px_24px_rgba(7,84,201,0.18)]"
            >
              <Image
                src={getMediaUrl("/images/sky_laban_logo_transparent.png")}
                alt="Sky Laban"
                fill
                priority
                sizes="(max-width: 640px) 240px, 288px"
                className="object-contain"
              />
            </motion.div>

            {/* Subtle Brand Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
              className="mt-3.5 sm:mt-4 flex items-center gap-2 text-[#0754C9] text-[10px] sm:text-xs font-bold uppercase tracking-[0.26em]"
            >
              <span className="w-3.5 sm:w-5 h-px bg-[#43B8F2]" />
              <span>Authentic Egyptian Desserts</span>
              <span className="w-3.5 sm:w-5 h-px bg-[#43B8F2]" />
            </motion.div>

            {/* Refined Brand Progress Indicator Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 sm:mt-5 w-28 sm:w-36 h-[2.5px] rounded-full bg-[#0754C9]/15 overflow-hidden origin-left"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-[#0754C9] via-[#43B8F2] to-[#0754C9] rounded-full shadow-[0_0_8px_rgba(67,184,242,0.8)]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
