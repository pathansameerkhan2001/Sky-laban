"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  FolderTree,
  Sliders,
  ShoppingBag,
  MapPin,
  Film,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

// Clean page metadata map for the top header
const PAGE_META: Record<string, { title: string; description: string }> = {
  "/admin": {
    title: "Dashboard",
    description: "Overview of Sky Laban website content and active media.",
  },
  "/admin/dashboard": {
    title: "Dashboard",
    description: "Overview of Sky Laban website content and active media.",
  },
  "/admin/hero": {
    title: "Hero Slides",
    description: "Manage the images and content displayed in the website hero section.",
  },
  "/admin/hero-slides": {
    title: "Hero Slides",
    description: "Manage the images and content displayed in the website hero section.",
  },
  "/admin/products": {
    title: "Products",
    description: "Manage Sky Laban products and their images.",
  },
  "/admin/categories": {
    title: "Categories",
    description: "Manage product categories and presentation order.",
  },
  "/admin/reels": {
    title: "Instagram Reels",
    description: "Manage the Instagram Reels displayed on the website.",
  },
  "/admin/outlets": {
    title: "Our Outlets",
    description: "Manage physical store locations, contact details, and status.",
  },
  "/admin/founders": {
    title: "Founders",
    description: "Manage founder profiles, roles, and images.",
  },
  "/admin/website-content": {
    title: "Site Content",
    description: "Manage core brand copy and messaging.",
  },
  "/admin/story": {
    title: "Site Content",
    description: "Manage core brand copy and messaging.",
  },
  "/admin/media": {
    title: "Media Library",
    description: "Browse, upload, and organize assets stored in sky-laban-media.",
  },
  "/admin/users": {
    title: "Admin Profile",
    description: "Manage authorized administrative access and security credentials.",
  },
  "/admin/settings": {
    title: "Settings",
    description: "Configure admin account and system preferences.",
  },
};

// Clean navigation sections matching the commercial CMS specification
const NAV_SECTIONS = [
  {
    heading: "",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/hero", label: "Hero Slides", icon: Sliders },
      { href: "/admin/products", label: "Products", icon: ShoppingBag },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/reels", label: "Instagram Reels", icon: Film },
      { href: "/admin/outlets", label: "Outlets", icon: MapPin },
      { href: "/admin/founders", label: "Founders", icon: User },
      { href: "/admin/website-content", label: "Site Content", icon: FileText },
    ],
  },
  {
    heading: "Media",
    items: [{ href: "/admin/media", label: "Media Library", icon: ImageIcon }],
  },
  {
    heading: "System",
    items: [
      { href: "/admin/users", label: "Admin Profile", icon: User },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication pages that bypass the admin dashboard shell
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Keyboard accessibility: close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Authenticate session
  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      router.push("/admin/login");
    }
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading Sky Laban CMS...</span>
        </div>
      </div>
    );
  }

  // Derive current page title & description
  const currentMeta = PAGE_META[pathname] || {
    title: "Admin Panel",
    description: "Manage Sky Laban website content and media assets.",
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR (hidden below lg) — Width: 256px       */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 shrink-0 h-screen sticky top-0 z-30 shadow-2xs">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/sky_laban_logo_transparent.png"
              alt="Sky Laban"
              width={130}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0754C9] border border-sky-100">
              CMS
            </span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin"
          aria-label="Admin Sidebar Navigation"
        >
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.heading && (
                <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  {section.heading}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 select-none ${
                      active
                        ? "bg-[#EBF5FE] text-[#0754C9] font-bold border-r-2 border-[#0754C9]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        active ? "text-[#0754C9]" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: Profile Info + Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
          {/* User info */}
          <div className="px-2 py-1.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0754C9] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 truncate leading-tight">
                {user?.email || "brandnix.in@gmail.com"}
              </p>
            </div>
          </div>

          {/* Quick External Link */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-[#0754C9] hover:bg-white transition-colors border border-transparent hover:border-slate-200"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View Website</span>
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (Desktop + Mobile)                   */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ========================================================= */}
        {/* MOBILE TOP HEADER (visible on screens < lg: 390-768px)    */}
        {/* ========================================================= */}
        <header className="lg:hidden relative w-full h-14 bg-white border-b border-slate-200 px-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* LEFT: Hamburger Menu Button (min 44x44px touch target) */}
          <div className="flex items-center z-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0754C9]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* CENTER: Mathematically Centered Sky Laban Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center focus:outline-none"
              aria-label="Sky Laban Admin Dashboard"
            >
              <Image
                src="/images/sky_laban_logo_transparent.png"
                alt="Sky Laban"
                width={128}
                height={40}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* RIGHT: Quick Profile/Logout Button (min 44x44px touch target) */}
          <div className="flex items-center z-10">
            <button
              type="button"
              onClick={handleLogout}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Logout"
              aria-label="Sign out of admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* DESKTOP TOP HEADER (visible on screens >= lg)             */}
        {/* ========================================================= */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 h-16 px-8 sticky top-0 z-20 shadow-2xs items-center justify-between gap-4">
          {/* Dynamic Page Title & Description */}
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              {currentMeta.title}
            </h1>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">
              {currentMeta.description}
            </p>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* View Live Website Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0754C9] hover:border-slate-300 text-xs font-semibold transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#0754C9] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="text-left">
                <span className="font-semibold text-slate-800 block leading-tight">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {user?.email || "brandnix.in@gmail.com"}
                </span>
              </div>
            </div>

            {/* Logout Icon */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN CONTENT VIEWPORT                                     */}
        {/* ========================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE NAVIGATION DRAWER (Framer Motion)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin Navigation Menu"
          >
            {/* Backdrop Overlay */}
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

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-[300px] bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src="/images/sky_laban_logo_transparent.png"
                      alt="Sky Laban"
                      width={120}
                      height={36}
                      className="h-7 w-auto object-contain"
                    />
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0754C9] border border-sky-100">
                      CMS
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="p-3 space-y-4">
                  {NAV_SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                      {section.heading && (
                        <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {section.heading}
                        </div>
                      )}
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isLinkActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                              active
                                ? "bg-[#EBF5FE] text-[#0754C9] font-bold border-r-2 border-[#0754C9]"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                active ? "text-[#0754C9]" : "text-slate-400"
                              }`}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user?.email || "brandnix.in@gmail.com"}
                  </p>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0754C9] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live Website</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
