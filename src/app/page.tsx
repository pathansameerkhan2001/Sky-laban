"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeadlineTicker from "@/components/HeadlineTicker";
import Products from "@/components/Products";
import OurStory from "@/components/OurStory";
import Benefits from "@/components/Benefits";
import Franchise from "@/components/Franchise";
import OurOutlets from "@/components/OurOutlets";
import InstagramReels from "@/components/InstagramReels";
import Footer from "@/components/Footer";
import FranchiseModal from "@/components/FranchiseModal";
import LetConnectModal from "@/components/LetConnectModal";

export default function Home() {
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full">
      {/* 1 & 2. Top Information Bar + Main Navigation Header */}
      <Header
        onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* 3. HERO SECTION — Premium Full-Width Carousel (Slides 1 to 4) */}
      <Hero />

      {/* 4. Animated Headline / Ticker Strip */}
      <HeadlineTicker />

      {/* 5. Products Section (Clean Multi-column Desktop, 2-Column Mobile) */}
      <Products />

      {/* 6. Our Story / Brand Section */}
      <OurStory />
      <Benefits />

      {/* 7. Franchise Business Opportunities */}
      <Franchise onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)} />

      {/* 8. OUR OUTLETS — Growing Across South India */}
      <OurOutlets />

      {/* 9. Instagram Reels Section (Reel Sequence Carousel) */}
      <InstagramReels />

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
