"use client";

import React from "react";

const TICKER_ITEMS = [
  "CREAMY",
  "DREAMY",
  "SKY LABAN",
  "PREMIUM",
  "CREAMY",
  "DREAMY",
  "SKY LABAN",
  "PREMIUM",
  "CREAMY",
  "DREAMY",
  "SKY LABAN",
  "PREMIUM",
];

export default function HeadlineTicker() {
  return (
    <section
      aria-label="Brand Headlines Marquee"
      className="relative w-full bg-white border-y border-[#DDF5FF] py-2.5 sm:py-3.5 overflow-hidden select-none z-10"
      style={{ overflow: "hidden" }}
    >
      <style>{`
        @keyframes tickerTrain {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ticker-marquee-track {
          display: flex;
          width: max-content;
          animation: tickerTrain 26s linear infinite !important;
          will-change: transform;
        }
      `}</style>

      {/* Marquee Train Wrapper: 100% width of viewport, no page overflow */}
      <div className="w-full overflow-hidden flex items-center">
        <div className="ticker-marquee-track flex items-center shrink-0">
          {/* Track A */}
          <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-14 pr-6 sm:pr-10 lg:pr-14 shrink-0">
            {TICKER_ITEMS.map((item, idx) => (
              <React.Fragment key={`a-${idx}`}>
                <span className="font-extrabold text-[#0754C9] text-xs sm:text-sm md:text-[15px] tracking-[0.25em] uppercase whitespace-nowrap">
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#43B8F2] shrink-0"
                  aria-hidden="true"
                />
              </React.Fragment>
            ))}
          </div>

          {/* Track B (Identical clone for 100% seamless looping without reset) */}
          <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-14 pr-6 sm:pr-10 lg:pr-14 shrink-0" aria-hidden="true">
            {TICKER_ITEMS.map((item, idx) => (
              <React.Fragment key={`b-${idx}`}>
                <span className="font-extrabold text-[#0754C9] text-xs sm:text-sm md:text-[15px] tracking-[0.25em] uppercase whitespace-nowrap">
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#43B8F2] shrink-0"
                  aria-hidden="true"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
