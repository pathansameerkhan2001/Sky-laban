"use client";

import React from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navigation from "./Navigation";

interface HeaderProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Header({ onOpenConnectModal, onOpenFranchiseModal }: HeaderProps) {
  return (
    <header className="relative w-full z-40 bg-white">
      {/* 1. Top Information Announcement Bar (Normal document flow) */}
      <AnnouncementBar />

      {/* 2. Main Navigation Header Island (Normal document flow) */}
      <Navigation
        onOpenConnectModal={onOpenConnectModal}
        onOpenFranchiseModal={onOpenFranchiseModal}
      />
    </header>
  );
}
