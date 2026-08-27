import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  heroProduct: Product;
  onOrderNow: (product: Product) => void;
  onExploreCollection: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroProduct,
  onOrderNow,
  onExploreCollection,
}) => {
  return (
    <section className="w-full px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 pb-12 max-w-[1878px] mx-auto">
      {/* 2-Column Split Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-8 items-start">
        {/* Left Big Editorial Portrait */}
        <div className="lg:col-span-7 relative w-full h-[480px] sm:h-[640px] md:h-[760px] lg:h-[880px] xl:h-[980px] bg-[#EBEBEB] overflow-hidden group">
          <img
            src="https://i.ibb.co/XrrxzkM5/Rectangle-39864.png"
            alt="BATIF Minimal Menswear Lookbook"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            loading="eager"
          />
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <span className="bg-[#FF5131] text-white font-inter-tight font-medium text-[11px] sm:text-[13px] tracking-wider px-3.5 sm:px-4 py-1.5 sm:py-2 uppercase select-none inline-block shadow-sm">
              LIMITED EDITION
            </span>
          </div>
        </div>

        {/* Right Detail Closeup + Product Info */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div className="relative w-full h-[380px] sm:h-[500px] md:h-[600px] lg:h-[720px] xl:h-[820px] bg-[#EAEAEA] overflow-hidden group">
            <img
              src="https://i.ibb.co/JXFvtmS/Chat-GPT-Image-Feb-28-2026-11-35-55-PM-1.png"
              alt="BATIF Essential Closeup Detail"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="pt-4 sm:pt-5 flex flex-row items-end justify-between gap-4">
            <div>
              <h3 className="font-inter-tight font-normal text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em]">
                {heroProduct.name}
              </h3>
              <p className="font-inter-tight font-normal text-xs sm:text-sm text-black/80 mt-0.5">
                {heroProduct.price.toFixed(2)}$
              </p>
            </div>
            <button
              onClick={() => onOrderNow(heroProduct)}
              className="group inline-flex items-center gap-1 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase cursor-pointer hover:opacity-85 transition-opacity shrink-0"
            >
              <span>ORDER NOW</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Typography Banner Section */}
      <div className="mt-10 sm:mt-14 lg:mt-16 border-t border-black/10 pt-6 sm:pt-8">
        <p className="font-inter-tight text-xs sm:text-[13px] tracking-wider text-black uppercase font-normal">
          MODERN MENSWEAR. CLEAN DESIGN. STRONG IDENTITY. WELCOME TO BATIF.
        </p>
        <h1 className="font-inter-tight font-normal text-[28px] sm:text-[44px] md:text-[56px] lg:text-[72px] xl:text-[84px] leading-[0.95] tracking-[-0.03em] text-black uppercase mt-3 sm:mt-4 select-none">
          MINIMAL. BOLD. ESSENTIAL.
        </h1>
        <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
          <div className="shrink-0">
            <button
              onClick={onExploreCollection}
              className="group inline-flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase hover:opacity-85 transition-opacity cursor-pointer"
            >
              <span>DISCOVER NEW COLLECTION</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="md:text-right">
            <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[420px] md:ml-auto">
              Batif creates modern essentials for men who value simplicity, detail, and presence. Designed to stand out without trying too hard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
