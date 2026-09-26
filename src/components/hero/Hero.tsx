"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [headerHeight, setHeaderHeight] = useState<number>(112);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const updateHeight = () => {
      const h = header.offsetHeight;
      if (h > 0) {
        setHeaderHeight((prev) => (prev !== h ? h : prev));
      }
      setIsMobile(window.innerWidth < 768);
    };

    updateHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(header);
    }

    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section
      id="home"
      className="hero relative w-full overflow-hidden bg-[#35AFF2] flex items-center justify-center aspect-[16/9] md:aspect-auto"
      style={{
        width: "100%",
        maxWidth: "none",
        height: isMobile ? "auto" : `calc(100vh - ${headerHeight}px)`,
        minHeight: isMobile ? "260px" : "540px",
      }}
    >
      {/* Background Hero Product Image (Wide, safe-area composition with full container & spoon visible) */}
      <div className="relative w-full h-full select-none pointer-events-none">
        <Image
          src="/hero/sky-laban-hero-enhanced.jpg"
          alt="Sky Laban Salankatia Signature Dessert"
          fill
          priority
          sizes="100vw"
          className="hero-image w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
}

