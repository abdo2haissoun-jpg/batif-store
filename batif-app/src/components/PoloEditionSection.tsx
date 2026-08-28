import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PoloEditionSectionProps {
  onShopPolo: () => void;
}

export const PoloEditionSection: React.FC<PoloEditionSectionProps> = ({ onShopPolo }) => {
  return (
    <section className="w-full px-3 sm:px-5 lg:px-6 py-6 sm:py-10 max-w-[1878px] mx-auto">
      {/* 1px Solid Black Border Box matching Figma layout (1878px x 1044px) */}
      <div className="w-full border border-black grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
        {/* Left Side: Large Editorial Photo (Figma: 920px x 1044px) */}
        <div className="lg:col-span-6 xl:col-span-6 relative h-[480px] sm:h-[620px] md:h-[740px] lg:h-[860px] xl:h-[960px] bg-[#D4C3B3] overflow-hidden group">
          <img
            src="https://i.ibb.co/FLMXTr3q/Chat-GPT-Image-Feb-28-2026-11-35-55-PM-3.png"
            alt="BATIF Polo Edition Lookbook"
            className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Right Side: Giant Typography & Content */}
        <div className="lg:col-span-6 xl:col-span-6 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black bg-white/40 backdrop-blur-xs">
          {/* Top Title: POLO EDITION */}
          <div>
            <h2 className="font-inter-tight font-normal text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px] xl:text-[84px] leading-[0.95] tracking-[-0.04em] text-[#151414] uppercase select-none">
              POLO
              <br />
              EDITION
            </h2>
          </div>

          {/* Bottom Info and Action Link */}
          <div className="mt-8 sm:mt-14 pt-6 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[420px]">
              Batif creates modern essentials for men who value simplicity, detail, and presence. Designed to stand out without trying too hard.
            </p>

            <button
              onClick={onShopPolo}
              className="group inline-flex items-center gap-1 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span>SHOP NOW</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

