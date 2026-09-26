"use client";

import React, { useState, useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navigation from "./Navigation";

interface HeaderProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Header({ onOpenConnectModal, onOpenFranchiseModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-12 opacity-100"
        }`}
      >
        <AnnouncementBar />
      </div>

      {/* Main Floating Navigation */}
      <Navigation
        onOpenConnectModal={onOpenConnectModal}
        onOpenFranchiseModal={onOpenFranchiseModal}
      />
    </header>
  );
}
