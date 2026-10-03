"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Compass, ShieldCheck, Quote } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

export interface FounderData {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  quote?: string;
  order: number;
  isActive?: boolean;
}

const DEFAULT_FOUNDERS: FounderData[] = [
  {
    id: "founder-akram",
    name: "B. Akram Ali Khan",
    title: "Founder & Chief Visionary",
    image: "/images/Founder1(1).png",
    description:
      "B. Akram Ali Khan is the Founder and Chief Visionary of Sky Laban, helping shape the brand’s vision and its journey in bringing distinctive dessert experiences to more communities. With a deep passion for premium desserts and quality craftsmanship, he guides Sky Laban’s growth from our first outlet in Shaikpet to 15 outlets across Hyderabad and beyond.",
    quote: "Turning a simple dream into a shared happiness across the city.",
    order: 1,
    isActive: true,
  },
  {
    id: "founder-aslam",
    name: "B. Aslam Ali Khan",
    title: "Co-Founder & Operations Leader",
    image: "/images/Founder2(1).png",
    description:
      "B. Aslam Ali Khan is the Co-Founder and Operations Leader of Sky Laban, contributing to the brand’s operations, consistency, and customer experience as it continues to grow. His dedication, hands-on approach, and strong focus on people and processes ensure excellence at every outlet.",
    quote: "Building quality, consistency and a brighter tomorrow.",
    order: 2,
    isActive: true,
  },
];

export default function Founders() {
  const [founders, setFounders] = useState<FounderData[]>(DEFAULT_FOUNDERS);

  useEffect(() => {
    let isMounted = true;
    async function loadFounders() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.founders) && data.founders.length > 0) {
            const active = data.founders
              .filter((f: any) => f.isActive !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            if (isMounted && active.length > 0) {
              setFounders(active);
            }
          }
        }
      } catch (err) {
        console.warn("Using default founders data:", err);
      }
    }
    loadFounders();
    return () => {
      isMounted = false;
    };
  }, []);

  const akram = founders[0] || DEFAULT_FOUNDERS[0];
  const aslam = founders[1] || DEFAULT_FOUNDERS[1];

  return (
    <section
      id="founders"
      aria-label="Our Founders"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#eef8fe] via-white to-[#f4faff] relative overflow-hidden scroll-mt-12"
    >
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0754C9]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Background Decorative Script Flourishes */}
      <div className="hidden lg:block absolute left-8 bottom-32 select-none pointer-events-none opacity-10">
        <span className="font-serif italic text-8xl text-[#0754C9]">Passion</span>
      </div>
      <div className="hidden lg:block absolute right-8 bottom-12 select-none pointer-events-none opacity-10">
        <span className="font-serif italic text-8xl text-[#0754C9]">Growth</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDF5FF] shadow-xs mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#0754C9]">
              Our Founders
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#063B91] tracking-tight leading-tight">
            The Vision Behind Sky Laban
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-normal max-w-2xl mx-auto">
            Two brothers. One dream. A shared passion for bringing creamy happiness to every community.
          </p>
        </div>

        {/* ================= FOUNDER 1: B. AKRAM ALI KHAN (Image Left, Text Right) ================= */}
        <div className="mb-14 sm:mb-20 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#DDF5FF] shadow-[0_15px_45px_rgba(7,84,201,0.08)] relative overflow-hidden">
          {/* Subtle Top Gradient Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#43B8F2] via-[#0754C9] to-[#063B91]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Akram Image Container */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-[#DDF5FF] bg-gradient-to-br from-[#EBF5FE] to-[#D8EFFF] group">
                <Image
                  src={getMediaUrl(akram.image)}
                  alt={akram.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#063B91]/40 via-transparent to-transparent pointer-events-none" />

                {/* Corner Role Badge Icon */}
                <div className="absolute bottom-4 right-4 w-11 h-11 rounded-2xl bg-[#0754C9] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Akram Editorial Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#EBF5FE] text-[#0754C9] text-xs font-black tracking-widest uppercase border border-[#DDF5FF]">
                {akram.title}
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#063B91] tracking-tight">
                {akram.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {akram.description}
              </p>

              {/* Quote Block */}
              {akram.quote && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0F8FF] to-[#F8FCFF] border border-[#DDF5FF] flex items-start gap-3 sm:gap-4 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0754C9] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#063B91] italic leading-relaxed">
                    &ldquo;{akram.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Leadership Pill */}
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#43B8F2]" />
                <span>Founder &amp; Chief Visionary • Sky Laban</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOUNDER 2: B. ASLAM ALI KHAN (Text Left, Image Right - Alternating!) ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#DDF5FF] shadow-[0_15px_45px_rgba(7,84,201,0.08)] relative overflow-hidden">
          {/* Subtle Top Gradient Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#063B91] via-[#0754C9] to-[#43B8F2]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Aslam Editorial Content (Left side on desktop, stacked below on mobile) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 order-2 lg:order-1">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#EBF5FE] text-[#0754C9] text-xs font-black tracking-widest uppercase border border-[#DDF5FF]">
                {aslam.title}
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#063B91] tracking-tight">
                {aslam.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {aslam.description}
              </p>

              {/* Quote Block */}
              {aslam.quote && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0F8FF] to-[#F8FCFF] border border-[#DDF5FF] flex items-start gap-3 sm:gap-4 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0754C9] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#063B91] italic leading-relaxed">
                    &ldquo;{aslam.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Leadership Pill */}
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#43B8F2]" />
                <span>Co-Founder &amp; Operations Leader • Sky Laban</span>
              </div>
            </div>

            {/* Aslam Image Container (Right side on desktop, top on mobile) */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-[#DDF5FF] bg-gradient-to-br from-[#EBF5FE] to-[#D8EFFF] group">
                <Image
                  src={getMediaUrl(aslam.image)}
                  alt={aslam.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#063B91]/40 via-transparent to-transparent pointer-events-none" />

                {/* Corner Role Badge Icon */}
                <div className="absolute bottom-4 right-4 w-11 h-11 rounded-2xl bg-[#0754C9] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
