"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Store, MapPin, ExternalLink, Sparkles, Navigation as NavigationIcon } from "lucide-react";
import { FRANCHISE_LOCATIONS_DATA } from "@/data/brandData";

export default function FranchiseNetwork() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="franchise-network"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#eaf6ff] via-[#dcf2fe] to-[#eef8fe] overflow-hidden scroll-mt-16"
    >
      {/* Anchor for any existing '#find-store' navigation links */}
      <div id="find-store" className="absolute -top-24 left-0" />

      {/* Decorative Atmosphere Glows & Clouds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[30rem] h-[30rem] bg-[#43B8F2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid: Left Narrative + Right Interactive Map & Store Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Section Branding, Headings & Counter */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            {/* Top Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-sm border border-white/80 shadow-sm mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#0754C9]">
                OUR FRANCHISE NETWORK
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B91] leading-[1.18] tracking-tight mb-5">
              Growing Together
              <br />
              <span className="text-[#0754C9] font-serif italic">
                Across Andhra Pradesh &amp; Telangana
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8 max-w-md">
              Sky Laban is growing through multiple locations.
            </p>

            {/* 5 Franchises Counter Card (Matching Reference Badge) */}
            <div className="w-full sm:w-auto inline-flex items-center gap-5 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_10px_30px_rgba(7,84,201,0.08)] mb-8 transition-transform hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0754C9] to-[#43B8F2] flex items-center justify-center text-white shadow-md">
                <Store className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-[#0754C9] tracking-tight">
                  5
                </span>
                <div className="text-left">
                  <div className="text-sm font-extrabold text-[#063B91] tracking-wider uppercase">
                    FRANCHISES
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    ACROSS ANDHRA PRADESH &amp; TELANGANA
                  </div>
                </div>
              </div>
            </div>

            {/* Dessert Visual Accenting the Section */}
            <div className="hidden sm:flex items-center gap-4 p-3 rounded-2xl bg-white/60 border border-white/70 shadow-sm max-w-sm">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-xs">
                <Image
                  src="/images/sky_laban_salankatia_tub.png"
                  alt="Sky Laban Salankatia Signature Dessert"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-[#063B91] uppercase tracking-wide">
                  Signature Salankatia Duo
                </div>
                <div className="text-xs text-slate-600">
                  Served fresh daily at all 5 branch locations.
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: 3D Map + Store Location Cards */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* 3D Map Centerpiece */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full max-w-lg aspect-square mb-8 rounded-3xl overflow-hidden p-2 flex items-center justify-center"
            >
              {/* Background ambient halo behind map */}
              <div className="absolute inset-0 bg-radial from-white/90 via-transparent to-transparent rounded-full pointer-events-none" />

              <div className="relative w-full h-full max-h-[440px] drop-shadow-[0_20px_45px_rgba(7,84,201,0.22)]">
                <Image
                  src="/images/franchise_map_3d.jpg"
                  alt="Map of Sky Laban Franchises in Andhra Pradesh and Telangana"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* State Badges on Map */}
              <div className="absolute top-12 left-10 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#DDF5FF] text-[11px] font-bold text-[#0754C9]">
                <MapPin className="w-3.5 h-3.5 text-[#43B8F2]" />
                <span>Telangana (3 Outlets)</span>
              </div>

              <div className="absolute bottom-14 right-8 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#DDF5FF] text-[11px] font-bold text-[#0754C9]">
                <MapPin className="w-3.5 h-3.5 text-[#43B8F2]" />
                <span>Andhra Pradesh (2 Outlets)</span>
              </div>
            </motion.div>

            {/* 5 Real Location Cards Grid */}
            <div className="w-full">
              <div className="text-center sm:text-left mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select a location to get directions:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FRANCHISE_LOCATIONS_DATA.map((location, idx) => (
                  <motion.a
                    key={location.id}
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${location.branch} on Google Maps`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group relative bg-white/95 hover:bg-white rounded-2xl overflow-hidden border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-[0_6px_20px_rgba(7,84,201,0.06)] hover:shadow-[0_12px_30px_rgba(7,84,201,0.16)] transition-all duration-300 flex flex-col"
                  >
                    {/* Storefront Image */}
                    <div className="relative w-full h-32 overflow-hidden bg-slate-100">
                      <Image
                        src={location.image}
                        alt={`Sky Laban ${location.name} Branch Storefront`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* State Tag */}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#063B91]/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide">
                        {location.state}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col justify-between grow">
                      <div>
                        {/* Branch Name with Pin */}
                        <div className="flex items-center gap-1.5 text-[#0754C9] font-bold text-sm sm:text-base mb-1">
                          <MapPin className="w-4 h-4 shrink-0 text-[#0754C9] group-hover:animate-bounce" />
                          <span className="truncate">{location.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mb-3">
                          {location.branch}
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0754C9] group-hover:text-[#0645B8]">
                        <span className="flex items-center gap-1">
                          <NavigationIcon className="w-3.5 h-3.5" />
                          View Location
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
