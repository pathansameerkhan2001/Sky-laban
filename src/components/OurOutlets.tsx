"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Store,
  Heart,
  Users,
  ArrowRight,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface OutletItem {
  id: string;
  name: string;
  city: string;
  state: "Telangana" | "Andhra Pradesh" | "Tamil Nadu" | "Goa" | "Karnataka" | "Kerala";
  address: string;
  status: "existing" | "upcoming";
  mapsUrl?: string;
}

const OUTLETS_DIRECTORY: OutletItem[] = [
  // Existing Outlets (12 Outlets from Map Reference)
  {
    id: "kondapur",
    name: "Kondapur Branch",
    city: "Kondapur",
    state: "Telangana",
    address: "Kothaguda X Road, Kondapur, Hyderabad, Telangana",
    status: "existing",
    mapsUrl: "https://maps.app.goo.gl/85jeEQsNrGLm9HQF6?g_st=ic",
  },
  {
    id: "shaikpet",
    name: "Shaikpet Branch",
    city: "Shaikpet",
    state: "Telangana",
    address: "Tolichowki - Gachibowli Main Rd, Shaikpet, Hyderabad, Telangana",
    status: "existing",
    mapsUrl: "https://maps.app.goo.gl/WrbnJdxuH2L8dWk39?g_st=ic",
  },
  {
    id: "raghavendra-colony",
    name: "Raghavendra Colony Branch",
    city: "Raghavendra Colony",
    state: "Telangana",
    address: "Raghavendra Colony, Main Commercial Hub, Telangana",
    status: "existing",
    mapsUrl: "https://maps.app.goo.gl/KE4uTSoGsLKtk9y59?g_st=ic",
  },
  {
    id: "santosh-nagar",
    name: "Santosh Nagar Branch",
    city: "Santosh Nagar",
    state: "Telangana",
    address: "Santosh Nagar Main Road, Hyderabad, Telangana",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Santosh+Nagar",
  },
  {
    id: "kompally",
    name: "Kompally (Bahadurpally)",
    city: "Kompally",
    state: "Telangana",
    address: "Medchal Highway, Kompally / Bahadurpally, Hyderabad, Telangana",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Kompally",
  },
  {
    id: "sangareddy",
    name: "Sangareddy Branch",
    city: "Sangareddy",
    state: "Telangana",
    address: "Main Commercial Center, Sangareddy, Telangana",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Sangareddy",
  },
  {
    id: "ongole",
    name: "Ongole Branch",
    city: "Ongole",
    state: "Andhra Pradesh",
    address: "Kurnool Road, Near Collectorate, Ongole, Andhra Pradesh",
    status: "existing",
    mapsUrl: "https://maps.app.goo.gl/a3xPigdU7u8j1xZq8?g_st=ic",
  },
  {
    id: "nandyal",
    name: "Nandyal Branch",
    city: "Nandyal",
    state: "Andhra Pradesh",
    address: "Sanjeeva Nagar Main Road, Nandyal, Andhra Pradesh",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Nandyal",
  },
  {
    id: "kadapa",
    name: "Kadapa Branch",
    city: "Kadapa",
    state: "Andhra Pradesh",
    address: "Main Road, Proddatur / Kadapa, Andhra Pradesh",
    status: "existing",
    mapsUrl: "https://maps.app.goo.gl/fKSo3cWBmCPqtsHa8?g_st=ic",
  },
  {
    id: "vellore",
    name: "Vellore Branch",
    city: "Vellore",
    state: "Tamil Nadu",
    address: "Katpadi Main Road, Vellore, Tamil Nadu",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Vellore",
  },
  {
    id: "goa",
    name: "Goa Outlet",
    city: "Goa",
    state: "Goa",
    address: "Panaji City Center, Goa",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Goa",
  },
  {
    id: "hyderabad-flagship",
    name: "Hyderabad Flagship",
    city: "Hyderabad",
    state: "Telangana",
    address: "Jubilee Hills / Banjara Hills Hub, Hyderabad, Telangana",
    status: "existing",
    mapsUrl: "https://maps.google.com/?q=Sky+Laban+Hyderabad",
  },
  // Upcoming Locations (15 Selected Highlights from Map Reference)
  {
    id: "warangal",
    name: "Warangal",
    city: "Warangal",
    state: "Telangana",
    address: "Upcoming Prime Location, Warangal",
    status: "upcoming",
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    address: "Upcoming Beach Road Hub, Visakhapatnam",
    status: "upcoming",
  },
  {
    id: "vijayawada",
    name: "Vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    address: "Upcoming MG Road Center, Vijayawada",
    status: "upcoming",
  },
  {
    id: "guntur",
    name: "Guntur",
    city: "Guntur",
    state: "Andhra Pradesh",
    address: "Upcoming Commercial Corridor, Guntur",
    status: "upcoming",
  },
  {
    id: "kurnool",
    name: "Kurnool",
    city: "Kurnool",
    state: "Andhra Pradesh",
    address: "Upcoming Highway Hub, Kurnool",
    status: "upcoming",
  },
  {
    id: "nellore",
    name: "Nellore",
    city: "Nellore",
    state: "Andhra Pradesh",
    address: "Upcoming Center, Nellore",
    status: "upcoming",
  },
  {
    id: "tirupati",
    name: "Tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    address: "Upcoming Temple Road Hub, Tirupati",
    status: "upcoming",
  },
  {
    id: "anantapur",
    name: "Anantapur",
    city: "Anantapur",
    state: "Andhra Pradesh",
    address: "Upcoming Market Center, Anantapur",
    status: "upcoming",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Upcoming Indiranagar / Koramangala Cafe, Bengaluru",
    status: "upcoming",
  },
  {
    id: "mysuru",
    name: "Mysuru",
    city: "Mysuru",
    state: "Karnataka",
    address: "Upcoming Palace Road, Mysuru",
    status: "upcoming",
  },
  {
    id: "mangalore",
    name: "Mangaluru",
    city: "Mangaluru",
    state: "Karnataka",
    address: "Upcoming Coastal Hub, Mangaluru",
    status: "upcoming",
  },
  {
    id: "hubballi",
    name: "Hubballi",
    city: "Hubballi",
    state: "Karnataka",
    address: "Upcoming Center, Hubballi",
    status: "upcoming",
  },
  {
    id: "chennai",
    name: "Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Upcoming Anna Nagar / T. Nagar Hub, Chennai",
    status: "upcoming",
  },
  {
    id: "puducherry",
    name: "Puducherry",
    city: "Puducherry",
    state: "Tamil Nadu",
    address: "Upcoming French Quarter Hub, Puducherry",
    status: "upcoming",
  },
  {
    id: "kochi",
    name: "Kochi",
    city: "Kochi",
    state: "Kerala",
    address: "Upcoming Panampilly Nagar Cafe, Kochi",
    status: "upcoming",
  },
];

export default function OurOutlets() {
  const shouldReduceMotion = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOutlets = OUTLETS_DIRECTORY.filter((item) => {
    const matchesState =
      filterState === "all"
        ? true
        : filterState === "existing"
        ? item.status === "existing"
        : filterState === "upcoming"
        ? item.status === "upcoming"
        : item.state.toLowerCase() === filterState.toLowerCase();

    const matchesSearch =
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesState && matchesSearch;
  });

  const handleScrollToMap = () => {
    const mapElement = document.getElementById("outlets-map-card");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="our-outlets"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#eaf6ff] via-[#dcf2fe]/65 to-[#eef8fe] overflow-hidden scroll-mt-20"
    >
      {/* Anchor for existing '#find-store' & '#outlets' navigation links */}
      <div id="find-store" className="absolute -top-24 left-0" />
      <div id="outlets" className="absolute -top-24 left-0" />

      {/* Atmospheric Ambient Clouds and Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-[#43B8F2]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-white/50 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Milk Cream Splash Curve in Background (Right Edge) */}
      <div className="hidden lg:block absolute -right-16 top-1/3 w-64 h-64 opacity-25 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-white">
          <path
            d="M40,160 C20,100 80,40 140,20 C180,5 190,70 170,120 C150,170 80,180 40,160 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-Column Responsive Layout (Mobile: Single Column in Strict Sequence, Desktop: 2-Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* LEFT SIDE: Narrative Content & Statistics */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col items-start"
          >
            {/* 1. Small Eyebrow: OUR OUTLETS */}
            <div className="inline-flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="w-6 sm:w-8 h-px bg-[#0754C9]/40" />
              <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.25em] text-[#0754C9]">
                OUR OUTLETS
              </span>
              <span className="w-6 sm:w-8 h-px bg-[#0754C9]/40" />
            </div>

            {/* 2. Large Heading: Growing Across South India */}
            <h2 className="mb-4 sm:mb-5">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-black text-[#063B91] tracking-tight leading-[1.12]">
                Growing Across
              </span>
              <span className="relative inline-block text-4xl sm:text-5xl lg:text-6xl text-[#0754C9] font-['Caveat'] font-bold tracking-normal leading-[1.08] mt-1">
                South India
                {/* Yellow Curved Brush Underline matching reference */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-2.5 sm:h-3.5 text-[#F7B928] overflow-visible"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C60 2.5 140 2.5 197 7.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </span>
            </h2>

            {/* 3. Supporting Headline: Sweet Moments, Now Closer to You */}
            <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-[#0c2340] mb-3 leading-snug">
              Sweet Moments, Now Closer to You
            </h3>

            {/* 4. Short Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 sm:mb-7 max-w-xl">
              Alhamdulillah, from our first store in Shaikpet in April 2026, Sky Laban has grown into a family of 15 outlets. Every location reflects our commitment to quality, consistency, and sharing moments of pure delight with our customers.
            </p>

            {/* 5. Two Statistics Cards (2-column on desktop and mobile) */}
            <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Card 1: 15 Outlets */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }}
                className="relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-[#DDF5FF] shadow-[0_8px_25px_rgba(7,84,201,0.06)] hover:shadow-[0_12px_32px_rgba(7,84,201,0.12)] transition-all flex items-center gap-3 sm:gap-4 overflow-hidden group"
              >
                {/* Soft blue mountain gradient background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#EBF6FF]/80 via-transparent to-transparent pointer-events-none" />

                {/* Dark Blue Pin Icon Badge with Sky Laban Logo Mark */}
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-2xl bg-gradient-to-br from-[#063B91] to-[#0754C9] flex items-center justify-center text-white shadow-md shadow-[#063B91]/30 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6 fill-white text-[#063B91]" />
                </div>

                <div className="relative z-10 flex flex-col">
                  <span className="text-3xl sm:text-4xl font-black text-[#063B91] leading-none tracking-tight">
                    15
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 mt-1 sm:mt-1.5 leading-tight">
                    Outlets Growing
                  </span>
                </div>
              </motion.div>

              {/* Card 2: 15 Upcoming Locations */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }}
                className="relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-[#DDF5FF] shadow-[0_8px_25px_rgba(7,84,201,0.06)] hover:shadow-[0_12px_32px_rgba(7,84,201,0.12)] transition-all flex items-center gap-3 sm:gap-4 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#EBF6FF]/80 via-transparent to-transparent pointer-events-none" />

                {/* Light Blue Pin Icon Badge */}
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-2xl bg-gradient-to-br from-[#43B8F2] to-[#0754C9] flex items-center justify-center text-white shadow-md shadow-[#43B8F2]/30 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6 fill-white text-[#43B8F2]" />
                </div>

                <div className="relative z-10 flex flex-col">
                  <span className="text-3xl sm:text-4xl font-black text-[#0754C9] leading-none tracking-tight">
                    15
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 mt-1 sm:mt-1.5 leading-tight">
                    Upcoming Locations
                  </span>
                </div>
              </motion.div>
            </div>

            {/* 6. Three Feature Points */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-3 mb-7 sm:mb-8">
              {/* Feature 1: More Cities */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 p-3 sm:p-2.5 rounded-xl bg-white/50 border border-white/60 sm:bg-transparent sm:border-none">
                <div className="w-9 h-9 rounded-full bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center shrink-0 shadow-xs border border-[#DDF5FF]">
                  <Store className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#063B91]">More Cities</div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Expanding our presence across South India
                  </div>
                </div>
              </div>

              {/* Feature 2: More Happiness */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 p-3 sm:p-2.5 rounded-xl bg-white/50 border border-white/60 sm:bg-transparent sm:border-none">
                <div className="w-9 h-9 rounded-full bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center shrink-0 shadow-xs border border-[#DDF5FF]">
                  <Heart className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#063B91]">More Happiness</div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Bringing sweet moments closer to you
                  </div>
                </div>
              </div>

              {/* Feature 3: More Communities */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 p-3 sm:p-2.5 rounded-xl bg-white/50 border border-white/60 sm:bg-transparent sm:border-none">
                <div className="w-9 h-9 rounded-full bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center shrink-0 shadow-xs border border-[#DDF5FF]">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#063B91]">More Communities</div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Serving families in every neighbourhood
                  </div>
                </div>
              </div>
            </div>

            {/* 7. CTA Button: Find the Nearest Outlet → */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => {
                  handleScrollToMap();
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0645B8] to-[#0754C9] hover:from-[#063B91] hover:to-[#0645B8] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(7,84,201,0.25)] hover:shadow-[0_12px_32px_rgba(7,84,201,0.35)] transition-all cursor-pointer"
                aria-label="Find the Nearest Sky Laban Outlet"
              >
                <MapPin className="w-4 h-4 fill-white text-white" />
                <span>Find the Nearest Outlet</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Subtle Signature Dessert Bowl Accent on Desktop Bottom-Left */}
            <div className="hidden lg:flex items-center gap-4 mt-8 pt-6 border-t border-[#0754C9]/10 w-full">
              <div className="relative w-20 h-14 shrink-0 rounded-xl overflow-hidden drop-shadow-sm">
                <Image
                  src={getMediaUrl("/images/outlets_bowl_clean.png")}
                  alt="Sky Laban Freshly Prepared Signature Dessert"
                  fill
                  sizes="80px"
                  className="object-cover object-left"
                />
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold text-[#063B91] block">Freshly Served Everyday</span>
                Authentic Salankatia, Koushiri &amp; specialty laban desserts at every location.
              </div>
            </div>

          </motion.div>

          {/* RIGHT SIDE — MAP CARD */}
          <div id="outlets-map-card" className="lg:col-span-6 xl:col-span-7 flex flex-col items-center w-full">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.008, transition: { duration: 0.3 } }}
              className="relative w-full max-w-2xl rounded-3xl bg-white/70 backdrop-blur-md border-2 border-white shadow-[0_20px_50px_rgba(7,84,201,0.14)] p-2 sm:p-3 overflow-hidden group"
            >
              {/* Subtle Ambient Halo */}
              <div className="absolute inset-0 bg-radial from-white/95 via-transparent to-transparent pointer-events-none" />

              {/* Map Image Container with Exact 575/588 Aspect Ratio */}
              <div className="relative w-full aspect-[575/588] rounded-2xl overflow-hidden bg-white/40">
                <Image
                  src={getMediaUrl("/images/south_india_outlets_map@2x.png")}
                  alt="Sky Laban South India Outlets Map showing 12 Existing Outlets and 15 Upcoming Locations"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Subtle Interactive Quick-Filter Strip under the Map */}
              <div className="mt-3 px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#DDF5FF]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-bold text-[#063B91]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#063B91] inline-block" />
                    <span>12 Existing Outlets</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#0754C9]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#43B8F2] inline-block" />
                    <span>15 Upcoming</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1 font-bold text-[#0754C9] hover:text-[#063B91] transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>View All Branch Locations &rarr;</span>
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Accessible Full Store Locator Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] z-10 overflow-hidden max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="store-modal-title"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#DDF5FF] bg-gradient-to-r from-[#eaf6ff] to-white flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0754C9]/10 text-[#0754C9] text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-[#0754C9]" />
                    <span>South India Network</span>
                  </div>
                  <h3 id="store-modal-title" className="text-xl sm:text-2xl font-black text-[#063B91]">
                    Sky Laban Outlets Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Locate our stores, view directions, and explore upcoming branches.
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close store locator modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filter Tabs */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city, branch or state (e.g. Kondapur, Ongole, Vellore)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] focus:ring-2 focus:ring-[#0754C9]/15 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: "all", label: "All Outlets" },
                    { id: "existing", label: "Existing (12)" },
                    { id: "upcoming", label: "Upcoming (15)" },
                    { id: "telangana", label: "Telangana" },
                    { id: "andhra pradesh", label: "Andhra Pradesh" },
                    { id: "tamil nadu", label: "Tamil Nadu" },
                    { id: "karnataka", label: "Karnataka" },
                    { id: "goa", label: "Goa" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterState(tab.id)}
                      className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        filterState === tab.id
                          ? "bg-[#0754C9] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outlet List Scrollable */}
              <div className="overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100 max-h-[50vh]">
                {filteredOutlets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No outlets match your search. Try typing a different city or filter.
                  </div>
                ) : (
                  filteredOutlets.map((outlet) => (
                    <div
                      key={outlet.id}
                      className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            outlet.status === "existing"
                              ? "bg-[#063B91] text-white"
                              : "bg-[#DDF5FF] text-[#0754C9]"
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0c2340] text-sm sm:text-base">
                              {outlet.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                outlet.status === "existing"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-sky-50 text-sky-700 border border-sky-200"
                              }`}
                            >
                              {outlet.status === "existing" ? "Open Now" : "Upcoming"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{outlet.address}</p>
                          <span className="text-[11px] font-medium text-slate-400">
                            {outlet.state}
                          </span>
                        </div>
                      </div>

                      {outlet.status === "existing" && outlet.mapsUrl ? (
                        <a
                          href={outlet.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0754C9]/10 hover:bg-[#0754C9] text-[#0754C9] hover:text-white font-semibold text-xs transition-colors shrink-0"
                        >
                          <span>Get Directions</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Opening Soon</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>12 Outlets Open &bull; 15 Locations Expanding</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="font-bold text-[#0754C9] hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
