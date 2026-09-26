"use client";

import React from "react";
import { Leaf, Sparkles, Heart, MapPin, Phone } from "lucide-react";
import { TOP_BAR_DATA } from "@/data/brandData";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./SocialIcons";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#063b91] text-white text-[11px] md:text-xs font-medium tracking-wide border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        
        {/* Left: Quality Badges */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Leaf className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">Quality Products</span>
          </div>

          <span className="hidden md:inline-block text-white/30 text-xs">|</span>

          <div className="hidden sm:flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">Premium Ingredients</span>
          </div>

          <span className="hidden lg:inline-block text-white/30 text-xs">|</span>

          <div className="hidden lg:flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Heart className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">Loved by Families</span>
          </div>
        </div>

        {/* Center / Right: Find Store & Phone */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <a
            href={TOP_BAR_DATA.storeLocator.href}
            className="flex items-center gap-1.5 text-white/90 hover:text-[#43B8F2] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">{TOP_BAR_DATA.storeLocator.text}</span>
          </a>

          <span className="hidden sm:inline-block text-white/30 text-xs">|</span>

          <a
            href={TOP_BAR_DATA.phone.href}
            className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-[#43B8F2] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">{TOP_BAR_DATA.phone.number}</span>
          </a>

          <span className="text-white/30 text-xs">|</span>

          {/* Right: Social Media Icons */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-1"
              aria-label="Follow Sky Laban on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-1"
              aria-label="Follow Sky Laban on Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-1"
              aria-label="Watch Sky Laban on YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
