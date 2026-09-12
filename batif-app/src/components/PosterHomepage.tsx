import React, { useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types/store';

interface PosterHomepageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
  onNavigateShop: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
}

export const PosterHomepage: React.FC<PosterHomepageProps> = ({
  products,
  onSelectProduct,
  onQuickOrder,
  onNavigateShop,
  onNavigateAbout,
  onNavigateContact,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════
          1. HERO SECTION — Featured Art Poster
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 pb-12 max-w-[1878px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-8 items-start">
          {/* Left: Large Poster Artwork */}
          <div className="lg:col-span-7 relative w-full h-[480px] sm:h-[640px] md:h-[760px] lg:h-[880px] xl:h-[980px] bg-[#EBEBEB] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80"
              alt="Peace of Mind — Art Poster by Abdelatif Haissoun"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              loading="eager"
            />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
              <span className="bg-[#FF5131] text-white font-inter-tight font-medium text-[11px] sm:text-[13px] tracking-wider px-3.5 sm:px-4 py-1.5 sm:py-2 uppercase select-none inline-block">
                LIMITED ART PRINT
              </span>
            </div>
          </div>

          {/* Right: Poster Detail + Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="relative w-full h-[380px] sm:h-[500px] md:h-[600px] lg:h-[720px] xl:h-[820px] bg-[#EAEAEA] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80"
                alt="Peace of Mind — Detail View"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="pt-4 sm:pt-5 flex flex-row items-end justify-between gap-4">
              <div>
                <p className="font-inter-tight text-[10px] sm:text-[11px] tracking-[0.2em] text-black/50 uppercase mb-1">
                  ART POSTER #01 / PERSONAL SERIES / 2026
                </p>
                <h2 className="font-inter-tight font-normal text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em]">
                  PEACE OF MIND
                </h2>
                <p className="font-inter-tight font-normal text-xs sm:text-sm text-black/80 mt-0.5">
                  From 350 MAD
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectProduct(products[0]);
                }}
                className="group inline-flex items-center gap-1 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase cursor-pointer hover:opacity-85 transition-opacity shrink-0"
              >
                <span>SHOP THE PRINT</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Typography Banner */}
        <div className="mt-10 sm:mt-14 lg:mt-16 border-t border-black/10 pt-6 sm:pt-8">
          <p className="font-inter-tight text-xs sm:text-[13px] tracking-wider text-black uppercase font-normal">
            ART POSTERS. LIMITED PRINTS. DESIGNED IN CASABLANCA. WELCOME TO BATIF.
          </p>
          <h1 className="font-inter-tight font-normal text-[28px] sm:text-[44px] md:text-[56px] lg:text-[72px] xl:text-[84px] leading-[0.95] tracking-[-0.03em] text-black uppercase mt-3 sm:mt-4 select-none">
            ART FOR YOUR WALLS.
          </h1>
          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
            <div className="shrink-0">
              <button
                onClick={onNavigateShop}
                className="group inline-flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase hover:opacity-85 transition-opacity cursor-pointer"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
            <div className="md:text-right">
              <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[420px] md:ml-auto">
                A curated collection of original art prints and posters. Each piece is designed to bring presence, emotion, and character to the spaces you live in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. BRAND / ARTIST STATEMENT
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-16 sm:py-24 max-w-[1878px] mx-auto">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-inter-tight font-normal text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px] leading-[0.95] tracking-[-0.04em] text-black uppercase select-none">
            ART FOR THE WALLS
            <br />
            YOU LIVE WITH.
          </h2>
          <p className="mt-6 sm:mt-8 font-inter-tight font-normal text-xs sm:text-sm md:text-base leading-relaxed text-black/70 max-w-[520px] mx-auto">
            A collection of original posters exploring ideas, emotions, color and everyday life.
            Designed by Abdelatif Haissoun.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. FEATURED POSTERS — Grid
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
        <div className="flex items-center justify-between border-b border-black pb-3 mb-5 sm:mb-6">
          <h2 className="font-inter-tight font-medium text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em] uppercase">
            THE POSTER COLLECTION
          </h2>
          <button
            onClick={() => scroll('right')}
            className="group flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-black tracking-wider uppercase hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span>NEXT</span>
            <ArrowRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.slice(0, 6).map((product, idx) => (
            <div
              key={product.id}
              className="flex-none w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px] group cursor-pointer select-none"
              style={{ scrollSnapAlign: 'start' }}
              onClick={() => onSelectProduct(product)}
            >
              <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] bg-[#F1F1F1] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-inter-tight font-normal tracking-wider px-2.5 py-1 uppercase bg-white/90 backdrop-blur-xs text-black">
                      {product.badge}
                    </span>
                  </div>
                )}
                {/* Hover: show framed interior mockup */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="font-inter-tight text-[11px] tracking-wider uppercase text-white bg-black/70 px-4 py-2 backdrop-blur-xs">
                    VIEW PRINT
                  </span>
                </div>
              </div>
              <div className="pt-3 flex flex-col">
                <h4 className="font-inter-tight font-normal text-xs sm:text-[13px] md:text-sm text-black tracking-[-0.01em]">
                  {product.name}
                </h4>
                <p className="font-inter-tight text-[11px] text-black/50 mt-0.5 uppercase tracking-wider">
                  Art Poster #{String(idx + 1).padStart(2, '0')}
                </p>
                <p className="font-inter-tight font-normal text-xs sm:text-[13px] text-black/80 mt-1">
                  From {product.price} MAD
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. PERSONAL SERIES — Editorial Section
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-6 sm:py-10 max-w-[1878px] mx-auto">
        <div className="w-full border border-black grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
          {/* Left: Large Editorial Image */}
          <div className="lg:col-span-6 xl:col-span-7 relative h-[480px] sm:h-[620px] md:h-[740px] lg:h-[860px] xl:h-[960px] bg-[#D4C3B3] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80"
              alt="Personal Series — Art prints in contemporary interior"
              className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Right: Typography & Content */}
          <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black bg-white/40 backdrop-blur-xs">
            <div>
              <h2 className="font-inter-tight font-normal text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px] xl:text-[84px] leading-[0.95] tracking-[-0.04em] text-[#151414] uppercase select-none">
                PERSONAL
                <br />
                SERIES
              </h2>
            </div>

            <div className="mt-8 sm:mt-14 pt-6 border-t border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[360px]">
                Posters built around thoughts, feelings and moments worth keeping. Each piece in the series carries a personal meaning.
              </p>
              <button
                onClick={onNavigateShop}
                className="group inline-flex items-center gap-1 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span>EXPLORE THE SERIES</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. SHOP BY FORMAT
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-12 sm:py-20 max-w-[1878px] mx-auto">
        <h2 className="font-inter-tight font-medium text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em] uppercase border-b border-black pb-3 mb-8 sm:mb-12">
          FIND YOUR FORMAT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {[
            { size: 'A3', dim: '29.7 × 42 CM', desc: 'Compact and versatile' },
            { size: 'A2', dim: '42 × 59.4 CM', desc: 'Our most popular format' },
            { size: 'A1', dim: '59.4 × 84.1 CM', desc: 'Statement piece' },
          ].map((format) => (
            <div
              key={format.size}
              className="group border border-black p-6 sm:p-8 lg:p-10 flex flex-col items-start hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
              onClick={onNavigateShop}
            >
              <span className="font-inter-tight font-normal text-[48px] sm:text-[64px] md:text-[72px] lg:text-[84px] leading-none tracking-[-0.04em] select-none">
                {format.size}
              </span>
              <div className="mt-4 sm:mt-6 pt-4 border-t border-black/15 group-hover:border-white/30 w-full">
                <p className="font-inter-tight font-normal text-xs sm:text-sm tracking-wider uppercase text-black/60 group-hover:text-white/60">
                  {format.dim}
                </p>
                <p className="font-inter-tight font-normal text-xs text-black/40 group-hover:text-white/50 mt-1">
                  {format.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. MORE POSTERS — Second Collection Row
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
        <div className="flex items-center justify-between border-b border-black pb-3 mb-5 sm:mb-6">
          <h2 className="font-inter-tight font-medium text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em] uppercase">
            MORE FOR YOUR WALLS
          </h2>
          <button
            onClick={onNavigateShop}
            className="group flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-black tracking-wider uppercase hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(3, 8).map((product, idx) => (
            <div
              key={product.id}
              className="group cursor-pointer select-none"
              onClick={() => onSelectProduct(product)}
            >
              <div className="relative w-full aspect-[3/4] bg-[#F1F1F1] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
              </div>
              <div className="pt-2.5">
                <h4 className="font-inter-tight font-normal text-xs sm:text-[13px] text-black">
                  {product.name}
                </h4>
                <p className="font-inter-tight text-[11px] text-black/50 mt-0.5 uppercase tracking-wider">
                  Art Poster #{String(idx + 4).padStart(2, '0')}
                </p>
                <p className="font-inter-tight font-normal text-xs text-black/80 mt-0.5">
                  From {product.price} MAD
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. INTERIOR / LIFESTYLE CAMPAIGN
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
        <div className="relative w-full min-h-[640px] md:min-h-[760px] lg:min-h-[920px] xl:h-[1044px] border border-black overflow-hidden bg-[#111111] flex flex-col justify-between p-4 sm:p-8 lg:p-12">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=80"
            alt="BATIF art prints displayed in contemporary interior"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* White Editorial Card */}
          <div className="relative z-10 w-full max-w-[560px] bg-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between shadow-2xl border border-black/10 min-h-[420px] sm:min-h-[500px] lg:min-h-[640px] xl:min-h-[720px]">
            <div>
              <h2 className="font-inter-tight font-normal text-[28px] sm:text-[42px] md:text-[52px] lg:text-[64px] xl:text-[72px] leading-[0.95] tracking-[-0.04em] text-[#151414] uppercase select-none">
                MAKE THE
                <br />
                WALL YOURS.
              </h2>
            </div>

            <div className="mt-6 sm:mt-10 pt-5 border-t border-black/10 flex flex-col gap-5">
              <p className="font-inter-tight font-normal text-xs sm:text-sm leading-relaxed tracking-normal text-black/80 max-w-[420px]">
                Your space should say something about you. Our prints are designed to bring presence and character to any room.
              </p>
              <div>
                <button
                  onClick={onNavigateShop}
                  className="group inline-flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase hover:opacity-85 transition-opacity cursor-pointer"
                >
                  <span>SHOP ALL POSTERS</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="relative z-10 self-end mt-4 sm:mt-0 text-right pr-2 sm:pr-4 pb-1">
            <p className="font-handwriting text-[20px] sm:text-[28px] lg:text-[34px] leading-tight text-white tracking-normal select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Art by abdelatif haissoun
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. WHY BATIF — 4-Column Value Props
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-black divide-y md:divide-y-0 md:divide-x divide-black">
          {[
            { title: 'ORIGINAL ARTWORK', desc: 'Created by Abdelatif Haissoun' },
            { title: 'PREMIUM PRINT', desc: 'Rich color and sharp detail' },
            { title: 'LIMITED SERIES', desc: 'Selected artworks released as curated collections' },
            { title: 'MADE TO LIVE WITH', desc: 'Art designed for real spaces' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="h-auto sm:h-[120px] lg:h-[140px] px-5 sm:px-6 py-5 sm:py-0 flex flex-col justify-center group hover:bg-neutral-50 transition-colors"
            >
              <h3 className="font-inter-tight font-medium text-[11px] sm:text-xs tracking-[0.15em] uppercase text-black mb-1.5">
                {item.title}
              </h3>
              <p className="font-inter-tight font-normal text-xs sm:text-[13px] text-black/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. NEWSLETTER
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-12 sm:py-20 max-w-[1878px] mx-auto">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="font-inter-tight font-normal text-[24px] sm:text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.03em] text-black uppercase select-none">
            NEW ART,
            <br />
            WHEN IT DROPS.
          </h2>
          <p className="mt-4 font-inter-tight font-normal text-xs sm:text-sm text-black/60">
            New posters, limited editions and studio updates.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mt-6 flex gap-0 max-w-[400px] mx-auto"
          >
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 h-[42px] bg-white border border-black px-4 font-inter-tight text-xs tracking-wider text-black placeholder:text-black/30 focus:outline-hidden uppercase"
            />
            <button
              type="submit"
              className="h-[42px] px-5 bg-black text-white font-inter-tight text-[11px] uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors cursor-pointer border border-black shrink-0"
            >
              JOIN THE LIST
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. VALUE PROPS BAR
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-6 max-w-[1878px] mx-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 border border-black divide-y md:divide-y-0 md:divide-x divide-black bg-white">
          {[
            'DELIVERY ACROSS MOROCCO',
            'SECURE PACKAGING',
            'CASH ON DELIVERY AVAILABLE',
          ].map((perk, index) => (
            <div
              key={index}
              className="h-[76px] sm:h-[90px] lg:h-[104px] px-4 sm:px-6 flex items-center justify-center text-center hover:bg-neutral-50 transition-colors"
            >
              <h3 className="font-inter-tight font-normal text-xs sm:text-[13px] lg:text-[14px] leading-snug text-black tracking-wider uppercase select-none">
                {perk}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
