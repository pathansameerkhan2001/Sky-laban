"use client";

import React, { useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navigation from "./Navigation";

interface HeaderProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Header({ onOpenConnectModal, onOpenFranchiseModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Efficient scroll detection: only update state when crossing threshold (no per-pixel re-renders)
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const shouldBeScrolled = latest > 20;
      setIsScrolled((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
    });
  }, [scrollY]);

  return (
    <>
      {/* 1. Top Announcement Bar (Normal document flow, scrolls away naturally) */}
      <AnnouncementBar />

      {/* 2. Main Navigation Header (Sticky at top: 0, attached to top of viewport) */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-[0_4px_20px_-4px_rgba(7,84,201,0.06)]"
            : "bg-white/90 sm:bg-white/80 backdrop-blur-xs border-b border-transparent"
        }`}
      >
        <Navigation
          isScrolled={isScrolled}
          onOpenConnectModal={onOpenConnectModal}
          onOpenFranchiseModal={onOpenFranchiseModal}
        />
      </header>
    </>
  );
}
