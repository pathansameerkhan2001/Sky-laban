"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Sparkles, Heart, MapPin, Phone, Lock } from "lucide-react";
import { TOP_BAR_DATA } from "@/data/brandData";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./SocialIcons";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#063B91] text-white text-[11px] md:text-xs font-medium tracking-wide border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-9 sm:h-10 flex items-center justify-between">
        
        {/* Left: Quality Badges & Find Store */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          <div className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Leaf className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap font-medium">Quality Products</span>
          </div>

          <span className="hidden sm:inline-block text-white/30 text-xs">|</span>

          <div className="hidden sm:flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap font-medium">Premium Ingredients</span>
          </div>

          <span className="hidden lg:inline-block text-white/30 text-xs">|</span>

          <div className="hidden lg:flex items-center gap-1.5 text-white/95 hover:text-white transition-colors">
            <Heart className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap font-medium">Loved by Families</span>
          </div>

          <span className="hidden md:inline-block text-white/30 text-xs">|</span>

          <a
            href={TOP_BAR_DATA.storeLocator.href}
            className="hidden md:flex items-center gap-1.5 text-white/95 hover:text-[#43B8F2] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap font-medium">{TOP_BAR_DATA.storeLocator.text}</span>
          </a>
        </div>

        {/* Center / Right: Find Store (Mobile), Phone, & Social Media */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          <a
            href={TOP_BAR_DATA.storeLocator.href}
            className="flex md:hidden items-center gap-1 text-white/90 hover:text-[#43B8F2] transition-colors text-[11px]"
          >
            <MapPin className="w-3 h-3 text-[#43B8F2]" />
            <span className="whitespace-nowrap">Find Store</span>
          </a>

          <span className="inline-block md:hidden text-white/30 text-xs">|</span>

          <a
            href={TOP_BAR_DATA.phone.href}
            className="flex items-center gap-1.5 text-white/95 hover:text-[#43B8F2] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span className="whitespace-nowrap">{TOP_BAR_DATA.phone.number}</span>
          </a>

          <span className="text-white/30 text-xs">|</span>

          {/* Right: Social Media Icons */}
          <div className="flex items-center space-x-2">
            <a
              href={TOP_BAR_DATA.socials[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-0.5"
              aria-label="Follow Sky Laban on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com/skylaban"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-0.5"
              aria-label="Follow Sky Laban on Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com/@skylaban"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-white/80 hover:text-[#43B8F2] hover:scale-110 transition-all p-0.5"
              aria-label="Watch Sky Laban on YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="text-white/30 text-xs">|</span>

          {/* Admin Panel Access as requested in header top bar */}
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] sm:text-xs transition-all border border-white/25 hover:border-white/50 shadow-sm"
            title="Sky Laban Admin Panel"
          >
            <Lock className="w-3 h-3 text-white fill-white" />
            <span className="whitespace-nowrap font-medium">Admin Panel</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
