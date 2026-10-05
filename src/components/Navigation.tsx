"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Store, Send, Menu, X, Lock } from "lucide-react";

interface NavigationProps {
  isScrolled?: boolean;
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Our Story", href: "#our-story" },
  { label: "Products", href: "#products" },
  { label: "Outlets", href: "#our-outlets" },
  { label: "Franchise", href: "#franchise" },
  { label: "Instagram", href: "#reels" },
];

export default function Navigation({
  isScrolled = false,
  onOpenConnectModal,
  onOpenFranchiseModal,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const shouldReduceMotion = useReducedMotion();

  // Passive section observer to highlight active section on scroll
  useEffect(() => {
    const sectionIds = [
      { id: "home", label: "Home" },
      { id: "our-story", label: "Our Story" },
      { id: "products", label: "Products" },
      { id: "our-outlets", label: "Outlets" },
      { id: "reels", label: "Instagram" },
      { id: "instagram-reels", label: "Instagram" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sectionIds.find((s) => s.id === entry.target.id);
            if (match) setActiveLink(match.label);
          }
        });
      },
      { rootMargin: "-35% 0px -40% 0px" }
    );

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Keyboard accessibility: close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* DESKTOP HEADER (hidden md:flex) — Height ~74-78px         */}
      {/* ========================================================= */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] lg:h-[78px]">
        {/* LEFT: Sky Laban Logo */}
        <div className="flex items-center shrink-0 mr-6 lg:mr-8">
          <Link
            href="/"
            onClick={() => setActiveLink("Home")}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9] rounded-lg"
            aria-label="Sky Laban Home"
          >
            <Image
              src="/images/sky_laban_logo_transparent.png"
              alt="Sky Laban - Premium Artisanal Desserts"
              width={152}
              height={50}
              priority
              className="h-10 lg:h-11 w-auto object-contain drop-shadow-[0_2px_8px_rgba(7,84,201,0.16)]"
            />
          </Link>
        </div>

        {/* CENTER: Navigation Links (Home, Our Story, Products, Outlets, Franchise, Instagram) */}
        <nav
          className="flex items-center space-x-6 lg:space-x-8 xl:space-x-9"
          aria-label="Desktop Primary Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeLink === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.label === "Franchise" && onOpenFranchiseModal) {
                    e.preventDefault();
                    onOpenFranchiseModal();
                  } else {
                    setActiveLink(item.label);
                  }
                }}
                className={`relative py-1 font-semibold text-sm lg:text-[15px] transition-colors duration-200 select-none ${
                  isActive
                    ? "text-[#0754C9]"
                    : "text-[#1c3f68] hover:text-[#0754C9]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0754C9] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Actions (Franchise, Let Connect, Admin Access) */}
        <div className="flex items-center space-x-3 shrink-0 ml-6 lg:ml-8">
          {/* Franchise Pill Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenFranchiseModal) {
                onOpenFranchiseModal();
              } else {
                const el = document.getElementById("franchise");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 lg:px-4 lg:py-2 rounded-full border border-[#0754C9] text-[#0754C9] bg-white hover:bg-[#0754C9]/5 font-semibold text-xs lg:text-[13px] transition-colors duration-150 shadow-2xs hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
          >
            <Store className="w-3.5 h-3.5 text-[#0754C9]" />
            <span>Franchise</span>
          </button>

          {/* Let Connect Solid Blue Pill */}
          <button
            type="button"
            onClick={() => {
              if (onOpenConnectModal) {
                onOpenConnectModal();
              } else {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 lg:px-4.5 lg:py-2 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-xs lg:text-[13px] shadow-sm hover:shadow transition-colors duration-150 active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>Let Connect</span>
          </button>

          {/* Discreet Admin Lock */}
          <Link
            href="/admin/login"
            className="p-2 rounded-full text-slate-400 hover:text-[#0754C9] hover:bg-sky-50/60 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE HEADER (flex md:hidden) — Height ~66-68px          */}
      {/* ========================================================= */}
      <div className="relative w-full h-[66px] sm:h-[68px] flex md:hidden items-center justify-between px-3 sm:px-4">
        {/* LEFT: Menu button (min 44x44px touch target) */}
        <div className="flex items-center z-10">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-[#0754C9] hover:bg-sky-50 active:bg-sky-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* CENTER: Mathematically centered logo relative to full viewport */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveLink("Home");
            }}
            className="flex items-center justify-center focus:outline-none"
            aria-label="Sky Laban Home"
          >
            <Image
              src="/images/sky_laban_logo_transparent.png"
              alt="Sky Laban - Premium Artisanal Desserts"
              width={136}
              height={46}
              priority
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_2px_6px_rgba(7,84,201,0.18)]"
            />
          </Link>
        </div>

        {/* RIGHT: Primary action icon (min 44x44px touch target) */}
        <div className="flex items-center z-10">
          <button
            type="button"
            onClick={() => {
              if (onOpenConnectModal) {
                onOpenConnectModal();
              } else {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-full bg-[#0754C9] text-white shadow-sm hover:bg-[#0645B8] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
            aria-label="Contact Sky Laban"
            title="Let Connect"
          >
            <Send className="w-4 h-4 text-white translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER (Framer Motion slide-in)                     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Header with Logo & Close Button */}
                <div className="h-[66px] sm:h-[68px] px-4 flex items-center justify-between border-b border-sky-100/70">
                  <Link
                    href="/"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveLink("Home");
                    }}
                    className="flex items-center"
                    aria-label="Sky Laban Home"
                  >
                    <Image
                      src="/images/sky_laban_logo_transparent.png"
                      alt="Sky Laban"
                      width={124}
                      height={42}
                      className="h-8 w-auto object-contain"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav
                  className="p-4 flex flex-col space-y-1"
                  aria-label="Mobile Menu Navigation"
                >
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeLink === item.label;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          if (item.label === "Franchise" && onOpenFranchiseModal) {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            onOpenFranchiseModal();
                          } else {
                            setActiveLink(item.label);
                            setMobileMenuOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-[#0754C9] bg-[#EBF5FE] font-bold"
                            : "text-slate-700 hover:text-[#0754C9] hover:bg-sky-50/50"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0754C9]" />
                        )}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-sky-100/70 space-y-2.5 bg-slate-50/60">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenFranchiseModal) onOpenFranchiseModal();
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#0754C9] text-[#0754C9] bg-white font-bold text-xs shadow-2xs active:bg-sky-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
                >
                  <Store className="w-4 h-4" />
                  <span>Franchise Opportunities</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenConnectModal) {
                      onOpenConnectModal();
                    } else {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#0754C9] text-white font-bold text-xs shadow-md shadow-[#0754C9]/20 active:bg-[#0645B8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
                >
                  <Send className="w-4 h-4" />
                  <span>Let Connect</span>
                </button>

                <div className="pt-1 flex justify-center">
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#0754C9] transition-colors py-1.5 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
