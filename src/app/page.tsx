"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeadlineTicker from "@/components/HeadlineTicker";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import OurStory from "@/components/OurStory";
import Founders from "@/components/Founders";
import InstagramReels from "@/components/InstagramReels";
import OurOutlets from "@/components/OurOutlets";
import Footer from "@/components/Footer";
import FranchiseModal from "@/components/FranchiseModal";
import LetConnectModal from "@/components/LetConnectModal";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full selection:bg-[#DDF5FF] selection:text-[#0754C9]">
      {/* 1. Header and navigation */}
      <Header
        onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Animated Brand Headline / Marquee */}
      <HeadlineTicker />

      {/* 4. Explore Our Categories */}
      <Categories onSelectCategory={(catName) => setSelectedCategory(catName)} />

      {/* 5. Products Section */}
      <Products selectedCategory={selectedCategory} />

      {/* 6. Our Story – Sky Laban */}
      <OurStory />

      {/* 7. Our Founders – Two separate founder profiles */}
      <Founders />

      {/* 8. Instagram Reels / Moments of Pure Delight */}
      <InstagramReels />

      {/* 9. Outlets / Locations */}
      <OurOutlets />

      {/* 10. Footer */}
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

