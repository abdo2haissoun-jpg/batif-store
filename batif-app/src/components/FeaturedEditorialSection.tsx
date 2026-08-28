import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedEditorialSectionProps {
  onShopNow: () => void;
}

export const FeaturedEditorialSection: React.FC<FeaturedEditorialSectionProps> = ({ onShopNow }) => {
  return (
    <section className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
      {/* Exact Figma Layout: 1878px x 1044px Full Editorial Image Container */}
      <div className="relative w-full min-h-[640px] md:min-h-[760px] lg:min-h-[920px] xl:h-[1044px] border border-black overflow-hidden bg-[#111111] flex flex-col justify-between p-4 sm:p-8 lg:p-12">
        {/* Background Editorial Image */}
        <img
          src="https://i.ibb.co/qFxX6pGn/Chat-GPT-Image-Feb-28-2026-11-35-55-PM-5.png"
          alt="Editorial Lookbook by Abdelatif Haissoun"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-95"
        />

        {/* Subtle Dark Gradient Overlay to ensure crisp contrast */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Left White Editorial Card */}
        <div className="relative z-10 w-full max-w-[560px] bg-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between shadow-2xl border border-black/10 min-h-[420px] sm:min-h-[500px] lg:min-h-[640px] xl:min-h-[720px]">
          {/* Main Title: TITLE HERE */}
          <div>
            <h2 className="font-inter-tight font-normal text-[28px] sm:text-[42px] md:text-[52px] lg:text-[64px] xl:text-[72px] leading-[0.95] tracking-[-0.04em] text-[#151414] uppercase select-none">
              NOIR<br />ESSENTIALS
            </h2>
          </div>

          {/* Description & Action */}
          <div className="mt-6 sm:mt-10 pt-5 border-t border-black/10 flex flex-col gap-5">
            <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[420px]">
              The Noir Pocket Tee is built around contrast — clean minimal base with a bold functional detail. Designed for everyday wear, but made to stand out.
            </p>

            <div>
              <button
                onClick={onShopNow}
                className="group inline-flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase hover:opacity-85 transition-opacity cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right Handwritten Signature */}
        <div className="relative z-10 self-end mt-4 sm:mt-0 text-right pr-2 sm:pr-4 pb-1">
          <p
            className="font-handwriting text-[20px] sm:text-[28px] lg:text-[34px] leading-tight text-white tracking-normal select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          >
            Made by abdelatif haissoun
          </p>
        </div>
      </div>
    </section>
  );
};

