"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Store, Send, Menu, X, Sparkles } from "lucide-react";
import { NAVIGATION_DATA } from "@/data/brandData";

interface NavigationProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Navigation({ onOpenConnectModal, onOpenFranchiseModal }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Floating Rounded Island Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`relative w-full rounded-2xl md:rounded-full border border-white/70 shadow-[0_10px_35px_rgba(7,84,201,0.09)] transition-all duration-300 ${
            scrolled
              ? "bg-[#eaf6ff]/90 backdrop-blur-md py-2 px-4 sm:px-6"
              : "bg-[#eef8fe]/80 backdrop-blur-sm py-2.5 sm:py-3 px-4 sm:px-7"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* LEFT: Sky Laban Exact Logo */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center"
            >
              <a
                href="#home"
                className="group relative flex items-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
                aria-label="Sky Laban Home"
                onClick={() => setActiveLink("Home")}
              >
                <div className="relative w-28 sm:w-36 md:w-40 h-10 sm:h-12 md:h-14">
                  <Image
                    src="/images/sky_laban_logo_transparent.png"
                    alt="Sky Laban Logo"
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
                    className="object-contain drop-shadow-[0_2px_8px_rgba(7,84,201,0.18)]"
                    priority
                    loading="eager"
                  />
                </div>
              </a>
            </motion.div>

            {/* CENTER: Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {NAVIGATION_DATA.links.map((link, idx) => {
                const isDropdown = Boolean(link.hasDropdown);
                const isActive = activeLink === link.label;

                if (isDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setProductsDropdownOpen(true)}
                      onMouseLeave={() => setProductsDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setActiveLink(link.label);
                          const el = document.getElementById("products");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`flex items-center gap-1.5 font-medium text-[15px] transition-colors py-1 ${
                          isActive
                            ? "text-[#0754C9] font-semibold"
                            : "text-[#1c3f68] hover:text-[#0754C9]"
                        }`}
                        aria-expanded={productsDropdownOpen}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            productsDropdownOpen ? "rotate-180 text-[#0754C9]" : "text-[#1c3f68]"
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {productsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-lg border border-[#DDF5FF] shadow-[0_15px_35px_rgba(7,84,201,0.12)] p-2 z-50 overflow-hidden"
                          >
                            <div className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 text-[#0754C9]/70 flex items-center gap-1 border-b border-[#DDF5FF]">
                              <Sparkles className="w-3 h-3 text-[#43B8F2]" />
                              <span>Featured Desserts</span>
                            </div>
                            <div className="pt-1">
                              {link.subItems?.map((item) => (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => {
                                    setProductsDropdownOpen(false);
                                    setActiveLink("Products");
                                  }}
                                  className="block px-3 py-2 text-sm text-[#0c2340] hover:text-[#0754C9] hover:bg-[#DDF5FF]/50 rounded-xl transition-all font-medium"
                                >
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                    className="relative"
                  >
                    <a
                      href={link.href}
                      onClick={() => setActiveLink(link.label)}
                      className={`relative font-medium text-[15px] transition-colors py-1 block ${
                        isActive
                          ? "text-[#0754C9] font-semibold"
                          : "text-[#1c3f68] hover:text-[#0754C9]"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0754C9] rounded-full mx-auto w-5"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* RIGHT: ONLY ONE Franchise Button + Let Connect Button */}
            <div className="hidden md:flex items-center space-x-3.5">
              {/* Franchise Button (Single, outlined pill style matching mockup) */}
              <motion.a
                whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(7,84,201,0.15)" }}
                whileTap={{ scale: 0.97 }}
                href={NAVIGATION_DATA.cta.franchise.href}
                onClick={(e) => {
                  if (onOpenFranchiseModal) {
                    e.preventDefault();
                    onOpenFranchiseModal();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-1.5 border-[#0754C9] text-[#0754C9] bg-white/70 hover:bg-[#0754C9]/5 font-semibold text-sm transition-all"
              >
                <Store className="w-4 h-4 text-[#0754C9]" />
                <span>{NAVIGATION_DATA.cta.franchise.label}</span>
              </motion.a>

              {/* Let Connect Button (Solid Blue Pill) */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 25px rgba(7,84,201,0.28)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (onOpenConnectModal) {
                    onOpenConnectModal();
                  } else {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{NAVIGATION_DATA.cta.letConnect.label}</span>
              </motion.button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#0754C9] hover:bg-white/60 focus:outline-none transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DDF5FF] shadow-xl p-5 overflow-hidden"
            >
              <div className="flex flex-col space-y-3.5">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-semibold text-[#0754C9] hover:bg-[#DDF5FF]/40 rounded-xl"
                >
                  Home
                </a>
                <a
                  href="#our-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1c3f68] hover:text-[#0754C9] hover:bg-[#DDF5FF]/40 rounded-xl"
                >
                  Our Story
                </a>
                <a
                  href="#products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-[#1c3f68] hover:text-[#0754C9] hover:bg-[#DDF5FF]/40 rounded-xl"
                >
                  Products
                </a>
                <a
                  href="#franchise"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (onOpenFranchiseModal) {
                      e.preventDefault();
                      onOpenFranchiseModal();
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-[#0754C9] hover:bg-[#DDF5FF]/40 rounded-xl"
                >
                  <Store className="w-4 h-4" />
                  <span>Franchise</span>
                </a>

                <div className="pt-2 border-t border-[#DDF5FF]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenConnectModal) {
                        onOpenConnectModal();
                      } else {
                        const el = document.getElementById("contact");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0754C9] text-white font-semibold text-sm shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Let Connect</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
