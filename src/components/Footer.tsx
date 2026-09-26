"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Heart, Sparkles } from "lucide-react";
import { FOOTER_DATA } from "@/data/brandData";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./SocialIcons";

interface FooterProps {
  onOpenConnectModal?: () => void;
  onOpenFranchiseModal?: () => void;
}

export default function Footer({ onOpenConnectModal, onOpenFranchiseModal }: FooterProps) {
  return (
    <footer id="contact" className="bg-[#063B91] text-white pt-16 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Exact Sky Laban Logo */}
            <a href="#home" className="inline-block relative w-36 sm:w-44 h-14">
              <Image
                src="/images/sky_laban_logo_transparent.png"
                alt="Sky Laban Brand Logo"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              />
            </a>

            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              {FOOTER_DATA.brandBio}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#43B8F2] hover:text-[#063B91] flex items-center justify-center transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#43B8F2] hover:text-[#063B91] flex items-center justify-center transition-all"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#43B8F2] hover:text-[#063B91] flex items-center justify-center transition-all"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#43B8F2]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {FOOTER_DATA.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.label === "Franchise" && onOpenFranchiseModal) {
                        e.preventDefault();
                        onOpenFranchiseModal();
                      }
                    }}
                    className="hover:text-[#43B8F2] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#43B8F2]">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#43B8F2] shrink-0" />
                <a href={FOOTER_DATA.contact.phone} className="hover:text-[#43B8F2] transition-colors">
                  {FOOTER_DATA.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#43B8F2] shrink-0" />
                <a href={`mailto:${FOOTER_DATA.contact.email}`} className="hover:text-[#43B8F2] transition-colors">
                  {FOOTER_DATA.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#43B8F2] shrink-0 mt-0.5" />
                <span>{FOOTER_DATA.contact.hq}</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenConnectModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#43B8F2] hover:text-[#063B91] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send a Message</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>{FOOTER_DATA.copyright}</div>
          <div className="flex items-center gap-1.5">
            <span>Crafted with passion for creamy happiness</span>
            <Heart className="w-3 h-3 text-[#43B8F2] fill-[#43B8F2]" />
          </div>
        </div>

      </div>
    </footer>
  );
}
