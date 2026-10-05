"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

/**
 * SafeImage - Resilient image wrapper for Sky Laban Next.js images.
 * Prevents broken image icons and raw ALT text when remote images fail to load or are missing.
 * Gracefully cascades to fallbackSrc or a polished Sky Laban branded placeholder.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [failedCompletely, setFailedCompletely] = useState(false);

  // If no source provided, jump straight to fallback
  if (!src) {
    if (fallbackSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt || "Sky Laban"}
          className={className}
        />
      );
    }
    return (
      <div
        className={`w-full h-full min-h-[100px] flex flex-col items-center justify-center bg-gradient-to-br from-[#063B91] via-[#0754C9] to-[#0A2540] text-white/80 p-4 select-none ${
          fallbackClassName || className || ""
        }`}
      >
        <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 text-center text-white">
          Sky Laban
        </span>
      </div>
    );
  }

  if (failedCompletely) {
    return (
      <div
        className={`w-full h-full min-h-[100px] flex flex-col items-center justify-center bg-gradient-to-br from-[#063B91] via-[#0754C9] to-[#0A2540] text-white/80 p-4 select-none ${
          fallbackClassName || className || ""
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 shadow-sm border border-white/15">
          <span className="text-sm font-black text-[#43B8F2]">SL</span>
        </div>
        <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 text-center text-white">
          Sky Laban Signature
        </span>
      </div>
    );
  }

  if (useFallback && fallbackSrc) {
    return (
      <Image
        {...props}
        src={fallbackSrc}
        alt={alt || "Sky Laban"}
        className={className}
        onError={() => setFailedCompletely(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt || "Sky Laban"}
      className={className}
      onError={() => {
        if (fallbackSrc) {
          setUseFallback(true);
        } else {
          setFailedCompletely(true);
        }
      }}
    />
  );
}
