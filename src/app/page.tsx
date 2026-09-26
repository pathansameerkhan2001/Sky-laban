"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import FranchiseNetwork from "@/components/FranchiseNetwork";
import InstagramReels from "@/components/InstagramReels";
import Benefits from "@/components/Benefits";
import OurStory from "@/components/OurStory";
import Franchise from "@/components/Franchise";
import Footer from "@/components/Footer";
import FranchiseModal from "@/components/FranchiseModal";
import LetConnectModal from "@/components/LetConnectModal";

export default function Home() {
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Approved Header with Top Bar and Floating Navigation */}
      <Header
        onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* 2. Hero Section: Pure Product Visual Showcase */}
      <Hero />

      {/* 3. Products Showcase Section */}
      <Products />

      {/* 4. Franchise Network Section (Andhra Pradesh & Telangana) */}
      <FranchiseNetwork />

      {/* 5. Instagram Reels Section (Trending Reel-Train Carousel) */}
      <InstagramReels />

      {/* 6. Brand Benefits & Values */}
      <Benefits />

      {/* 7. Our Story Narrative Section */}
      <OurStory />

      {/* 8. Franchise Partner / Business Opportunity */}
      <Franchise onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)} />

      {/* 9. Footer */}
      <Footer
        onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Interactive Modals */}
      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
      />

      <LetConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </main>
  );
}
