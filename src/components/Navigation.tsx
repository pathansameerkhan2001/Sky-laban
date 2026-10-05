"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Store, Send, Menu, X, Sparkles, Phone, ShieldCheck, Lock } from "lucide-react";
import { NAVIGATION_DATA } from "@/data/brandData";
import { getMediaUrl } from "@/lib/media";

interface NavigationProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Navigation({ onOpenConnectModal, onOpenFranchiseModal }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  return (
    <nav className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Floating Rounded Island Navbar matching Header Mockup Reference */}
        <div className="relative w-full rounded-2xl md:rounded-full bg-[#eef8fe]/95 backdrop-blur-md border border-white/80 shadow-[0_10px_35px_rgba(7,84,201,0.08)] py-2 sm:py-2.5 px-3.5 sm:px-6">
          
          {/* ================= DESKTOP VIEW (hidden md:flex) ================= */}
          <div className="hidden md:flex items-center justify-between">
            {/* Desktop Left: Sky Laban Exact Logo aligned left */}
            <div className="flex items-center shrink-0 mr-4 lg:mr-8">
              <Link
                href="/"
                className="group relative flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Sky Laban Home"
                onClick={() => setActiveLink("Home")}
              >
                <Image
                  src="/images/sky_laban_logo_transparent.png"
                  alt="Sky Laban"
                  width={160}
                  height={56}
                  priority
                  className="h-10 md:h-11 lg:h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(7,84,201,0.2)]"
                />
              </Link>
            </div>

            {/* Desktop Center: Navigation Links */}
            <div className="flex items-center space-x-7 lg:space-x-10">
              {/* Home */}
              <div className="relative">
                <a
                  href="#home"
                  onClick={() => setActiveLink("Home")}
                  className={`relative font-semibold text-sm lg:text-[15px] transition-colors py-1 block ${
                    activeLink === "Home" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  Home
                  {activeLink === "Home" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>
              </div>

              {/* Our Story */}
              <div className="relative">
                <a
                  href="#our-story"
                  onClick={() => setActiveLink("Our Story")}
                  className={`relative font-semibold text-sm lg:text-[15px] transition-colors py-1 block ${
                    activeLink === "Our Story" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  Our Story
                  {activeLink === "Our Story" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>
              </div>

              {/* Categories */}
              <div className="relative">
                <a
                  href="#categories"
                  onClick={() => setActiveLink("Categories")}
                  className={`relative font-semibold text-sm lg:text-[15px] transition-colors py-1 block ${
                    activeLink === "Categories" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  Categories
                  {activeLink === "Categories" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>
              </div>

              {/* Products with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <a
                  href="#products"
                  onClick={() => setActiveLink("Products")}
                  className={`flex items-center gap-1 font-semibold text-sm lg:text-[15px] transition-colors py-1 ${
                    activeLink === "Products" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      productsDropdownOpen ? "rotate-180 text-[#0754C9]" : "text-[#1c3f68]"
                    }`}
                  />
                  {activeLink === "Products" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {productsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-lg border border-[#DDF5FF] shadow-[0_15px_35px_rgba(7,84,201,0.12)] p-2 z-50 overflow-hidden"
                    >
                      <div className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 text-[#0754C9] flex items-center gap-1 border-b border-[#DDF5FF]">
                        <Sparkles className="w-3 h-3 text-[#43B8F2]" />
                        <span>Artisanal Desserts</span>
                      </div>
                      <div className="pt-1 space-y-0.5">
                        {[
                          "Salankatia",
                          "Gulstha",
                          "Koushiri",
                          "Ruh Hayati",
                          "Lou'a",
                          "Hiba Cake",
                          "Kunafa & Pastry",
                          "Traditional Desserts",
                          "Special",
                        ].map((cat) => (
                          <a
                            key={cat}
                            href="#products"
                            onClick={() => {
                              setProductsDropdownOpen(false);
                              setActiveLink("Products");
                            }}
                            className="block px-3 py-1.5 text-xs text-slate-700 hover:text-[#0754C9] hover:bg-[#DDF5FF]/50 rounded-xl transition-all font-semibold"
                          >
                            {cat}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>



              {/* Founders */}
              <div className="relative">
                <a
                  href="#founders"
                  onClick={() => setActiveLink("Founders")}
                  className={`relative font-semibold text-sm lg:text-[15px] transition-colors py-1 block ${
                    activeLink === "Founders" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  Founders
                  {activeLink === "Founders" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>
              </div>

              {/* Outlets */}
              <div className="relative">
                <a
                  href="#our-outlets"
                  onClick={() => setActiveLink("Outlets")}
                  className={`relative font-semibold text-sm lg:text-[15px] transition-colors py-1 block ${
                    activeLink === "Outlets" ? "text-[#0754C9]" : "text-[#1c3f68] hover:text-[#0754C9]"
                  }`}
                >
                  Outlets
                  {activeLink === "Outlets" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5" />
                  )}
                </a>
              </div>
            </div>

            {/* Desktop Right: Franchise and Let Connect buttons matching Reference */}
            <div className="flex items-center space-x-3">
              {/* Franchise Button (Pill outline style) */}
              <a
                href={NAVIGATION_DATA.cta.franchise.href}
                onClick={(e) => {
                  if (onOpenFranchiseModal) {
                    e.preventDefault();
                    onOpenFranchiseModal();
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full border-1.5 border-[#0754C9] text-[#0754C9] bg-white hover:bg-[#0754C9]/5 font-bold text-xs lg:text-sm transition-all shadow-xs hover:shadow-sm"
              >
                <Store className="w-4 h-4 text-[#0754C9]" />
                <span>Franchise</span>
              </a>

              {/* Let Connect Button (Solid Blue Pill) */}
              <button
                onClick={() => {
                  if (onOpenConnectModal) {
                    onOpenConnectModal();
                  } else {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-bold text-xs lg:text-sm shadow-md shadow-[#0754C9]/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Let Connect</span>
              </button>

              {/* Subtle Discreet Admin Portal Icon */}
              <Link
                href="/admin/login"
                className="p-2 rounded-full text-[#1c3f68]/40 hover:text-[#0754C9] hover:bg-white/80 transition-colors"
                title="Admin Portal"
                aria-label="Admin Portal"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ================= MOBILE VIEW (flex md:hidden) ================= */}
          {/* Strictly balanced 3-column layout: Left menu icon, Center logo, Right action icons */}
          <div className="flex md:hidden items-center justify-between w-full h-11">
            {/* Left: Mobile Menu Icon */}
            <div className="w-18 flex justify-start items-center shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl text-[#0754C9] hover:bg-white/80 active:bg-white focus:outline-none transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.2]" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
              </button>
            </div>

            {/* Center: Perfectly Centered Sky Laban Logo */}
            <div className="flex-1 flex justify-center items-center">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center shrink-0"
                aria-label="Sky Laban Mobile Home"
              >
                <Image
                  src="/images/sky_laban_logo_transparent.png"
                  alt="Sky Laban"
                  width={130}
                  height={46}
                  priority
                  className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_2px_6px_rgba(7,84,201,0.2)]"
                />
              </Link>
            </div>

            {/* Right: Action Icon (Let Connect) */}
            <div className="w-10 flex items-center justify-end shrink-0">
              <button
                onClick={() => {
                  if (onOpenConnectModal) {
                    onOpenConnectModal();
                  } else {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-8 h-8 rounded-full bg-[#0754C9] text-white flex items-center justify-center shadow-sm hover:bg-[#0645B8] active:scale-95 transition-all"
                aria-label="Contact Sky Laban"
                title="Let Connect"
              >
                <Send className="w-3.5 h-3.5 text-white translate-x-0.2" />
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DDF5FF] shadow-xl p-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-bold text-[#0754C9] bg-[#EBF5FE]/70 rounded-xl"
                >
                  Home
                </a>
                <a
                  href="#categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Categories
                </a>
                <a
                  href="#products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Products &amp; Desserts
                </a>

                <a
                  href="#our-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Our Story
                </a>
                <a
                  href="#founders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Founders
                </a>
                <a
                  href="#reels"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Moments of Delight
                </a>
                <a
                  href="#our-outlets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0754C9] hover:bg-[#EBF5FE]/40 rounded-xl transition-colors"
                >
                  Find Outlet
                </a>

                <div className="pt-2 border-t border-[#DDF5FF] flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenFranchiseModal) onOpenFranchiseModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border-1.5 border-[#0754C9] text-[#0754C9] font-bold text-xs"
                  >
                    <Store className="w-4 h-4" />
                    <span>Franchise Opportunities</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenConnectModal) onOpenConnectModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#0754C9] text-white font-bold text-xs shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Let Connect</span>
                  </button>

                  <div className="pt-2 flex justify-center">
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#0754C9] transition-colors py-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}
