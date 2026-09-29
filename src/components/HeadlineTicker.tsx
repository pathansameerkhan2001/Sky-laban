"use client";

import React from "react";

const TICKER_WORDS = [
  "SKY LABAN",
  "PREMIUM",
  "CREAMY",
  "DREAMY",
];

export default function HeadlineTicker() {
  // Repeat words to ensure continuous seamless marquee across wide viewports
  const repeatedWords = [...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS];

  return (
    <section
      aria-label="Brand Headlines Marquee"
      className="relative w-full bg-white border-y border-[#DDF5FF] py-3 sm:py-3.5 overflow-hidden select-none z-10"
      style={{ overflow: "hidden" }}
    >
      <style>{`
        @keyframes tickerTrainLoop {
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
          animation: tickerTrainLoop 25s linear infinite !important;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Marquee Train Wrapper: 100% width of viewport, strictly no page overflow */}
      <div className="w-full overflow-hidden flex items-center">
        <div className="ticker-marquee-track flex items-center shrink-0">
          {/* Track 1 */}
          <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-14 pr-6 sm:pr-10 lg:pr-14 shrink-0">
            {repeatedWords.map((item, idx) => (
              <React.Fragment key={`t1-${idx}`}>
                <span className="font-extrabold text-[#0754C9] text-xs sm:text-sm md:text-base tracking-[0.24em] uppercase whitespace-nowrap">
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#43B8F2] shrink-0"
                  aria-hidden="true"
                />
              </React.Fragment>
            ))}
          </div>

          {/* Track 2 (Clone for 100% seamless, uninterrupted right-to-left loop) */}
          <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-14 pr-6 sm:pr-10 lg:pr-14 shrink-0" aria-hidden="true">
            {repeatedWords.map((item, idx) => (
              <React.Fragment key={`t2-${idx}`}>
                <span className="font-extrabold text-[#0754C9] text-xs sm:text-sm md:text-base tracking-[0.24em] uppercase whitespace-nowrap">
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
