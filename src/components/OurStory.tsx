"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, MapPin, Store, Heart, CheckCircle2 } from "lucide-react";

export default function OurStory() {
  const [content, setContent] = useState({
    headline: "Our Journey & Passion for Desserts",
    lead: "Alhamdulillah, from our first store in Shaikpet in April 2026, Sky Laban has grown into a family of 15 outlets. Every location reflects our commitment to quality, consistency, and sharing moments of pure delight with our customers.",
    subtext: "At Sky Laban, every creation is rooted in an unwavering devotion to dairy purity, slow-churned velvet textures, and genuine Middle Eastern hospitality. We craft desserts that elevate gatherings and turn everyday moments into celebrations.",
    firstStore: "April 2026 – First Store in Shaikpet",
    currentPresence: "15 Outlets Across Hyderabad & Beyond",
    brandMessage: "Alhamdulillah",
    imageUrl: "/images/outlet_shaikpet_store.jpg",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadStory() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (data?.content && isMounted) {
            setContent((prev) => ({
              ...prev,
              headline: data.content.ourStoryLead || prev.headline,
              lead: data.content.ourStoryJourney || prev.lead,
              firstStore: data.content.firstStoreInfo || prev.firstStore,
              currentPresence: data.content.outletsCountInfo || prev.currentPresence,
            }));
          }
        }
      } catch (err) {
        console.warn("Using default story content:", err);
      }
    }
    loadStory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="our-story" className="relative py-16 sm:py-24 bg-white overflow-hidden scroll-mt-12">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#DDF5FF]/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Visual Side: Actual Sky Laban Shaikpet Outlet Store Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(7,84,201,0.14)] border border-[#DDF5FF] group aspect-[3/4] max-w-md mx-auto bg-slate-900">
              <Image
                src={content.imageUrl}
                alt="Sky Laban Shaikpet First Outlet Store"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063B91]/80 via-transparent to-black/20 pointer-events-none" />

              {/* Outlet Storefront Overlay Label */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DDF5FF]">
                    Where It All Began
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                    April 2026 – First Store in Shaikpet
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0754C9] text-white flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Side: Brand Storytelling Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5FE] text-[#0754C9] text-xs font-bold tracking-widest uppercase border border-[#DDF5FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
              <span>Our Story &amp; Heritage</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#063B91] tracking-tight leading-tight">
              Our Story — A Journey of Creamy Happiness
            </h2>

            {/* Journey Blockquote */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#EBF5FE] to-[#F5FAFF] border-l-4 border-[#0754C9] shadow-xs">
              <p className="text-sm sm:text-base font-semibold text-[#063B91] leading-relaxed italic">
                &ldquo;{content.lead}&rdquo;
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {content.subtext}
            </p>

            {/* Clear Business Milestone & Growth Highlights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#DDF5FF] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] text-[#0754C9] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Milestone</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#063B91] leading-tight">{content.firstStore}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DDF5FF] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FE] text-[#0754C9] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Presence</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#063B91] leading-tight">{content.currentPresence}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DDF5FF] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand Message</span>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-700 leading-tight">{content.brandMessage}</p>
                </div>
              </div>
            </div>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#063B91]">
                <CheckCircle2 className="w-4 h-4 text-[#0754C9] shrink-0" />
                <span>100% Farm Fresh Cream</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#063B91]">
                <CheckCircle2 className="w-4 h-4 text-[#0754C9] shrink-0" />
                <span>Bronte Pistachio Puree</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#063B91]">
                <CheckCircle2 className="w-4 h-4 text-[#0754C9] shrink-0" />
                <span>Authentic Hospitality</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
