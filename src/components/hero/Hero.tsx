"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [headerHeight, setHeaderHeight] = useState<number>(112);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const updateHeight = () => {
      const h = header.offsetHeight;
      if (h > 0) {
        setHeaderHeight((prev) => (prev !== h ? h : prev));
      }
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
      className="hero relative w-full overflow-hidden bg-[#35AFF2] flex items-center justify-center aspect-[16/9] md:aspect-auto h-auto md:h-[calc(100vh-var(--header-h,112px))] min-h-[220px] sm:min-h-[320px] md:min-h-[540px]"
      style={
        {
          "--header-h": `${headerHeight}px`,
        } as React.CSSProperties
      }
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


