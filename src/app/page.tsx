"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import OurStory from "@/components/OurStory";
import Products from "@/components/Products";
import Franchise from "@/components/Franchise";
import FranchiseNetwork from "@/components/FranchiseNetwork";
import Footer from "@/components/Footer";
import FranchiseModal from "@/components/FranchiseModal";
import LetConnectModal from "@/components/LetConnectModal";

export default function Home() {
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header with Top Bar and Floating Navigation */}
      <Header
        onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero />

      {/* Franchise Network Section (Andhra Pradesh & Telangana) */}
      <FranchiseNetwork />

      {/* Brand Benefits Strip */}
      <Benefits />

      {/* Our Story Section */}
      <OurStory />

      {/* Products Showcase */}
      <Products />

      {/* Franchise Business Section */}
      <Franchise onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)} />

      {/* Footer */}
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
