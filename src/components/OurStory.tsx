"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Check, Quote } from "lucide-react";
import { OUR_STORY_DATA } from "@/data/brandData";

export default function OurStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="our-story" className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#DDF5FF]/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Side: Large Premium Imagery */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            {/* Visual Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(7,84,201,0.14)] border border-[#DDF5FF] group aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/salankatia_scene_closeup.jpg"
                alt="Sky Laban Artisanal Creamy Desserts"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063B91]/40 via-transparent to-transparent pointer-events-none" />

              {/* Inset Label */}
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF5FF]">
                    Master Culinary Craft
                  </span>
                  <p className="text-sm font-semibold">Artisan Dairy Perfection</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Overlapping Floating Quote Card */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-6 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-xl border border-[#DDF5FF] sm:max-w-sm"
            >
              <Quote className="w-6 h-6 text-[#43B8F2] mb-2 fill-[#43B8F2]/20" />
              <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed mb-2">
                &ldquo;{OUR_STORY_DATA.quote.text}&rdquo;
              </p>
              <div className="text-[11px] font-bold text-[#0754C9] tracking-wider uppercase">
                {OUR_STORY_DATA.quote.author}
              </div>
            </motion.div>
          </motion.div>

          {/* Text Side: Brand Storytelling Content */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDF5FF] text-[#0754C9] text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
              <span>{OUR_STORY_DATA.eyebrow}</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063B91] tracking-tight leading-tight mb-5">
              {OUR_STORY_DATA.headline}
            </h2>

            {/* Lead */}
            <p className="text-base sm:text-lg text-[#0754C9] font-medium leading-relaxed mb-6">
              {OUR_STORY_DATA.lead}
            </p>

            {/* Paragraphs */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {OUR_STORY_DATA.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DDF5FF]">
              {OUR_STORY_DATA.pillars.map((pillar, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#DDF5FF]/30 border border-[#DDF5FF]/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0754C9] mb-1">
                    <Check className="w-3.5 h-3.5 text-[#0754C9]" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
