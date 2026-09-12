import React, { useRef, useEffect } from 'react';
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

/* ─── Mockup Gallery Data ──────────────────────────── */
const MOCKUP_SLIDES = [
  {
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    caption: 'PEACE OF MIND',
  },
  {
    poster: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    caption: 'THE DREAM',
  },
  {
    poster: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&q=80',
    caption: 'HAVE A GOOD TIME',
  },
  {
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    caption: 'SERIES 04',
  },
  {
    poster: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    caption: 'SERIES 05',
  },
  {
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    caption: 'SERIES 06',
  },
];

/* ─── Personal Series Posters ───────────────────────── */
const PERSONAL_SERIES_POSTERS = [
  {
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    title: 'PEACE OF MIND',
    num: '#01',
  },
  {
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    title: 'THE DREAM',
    num: '#02',
  },
  {
    image: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&q=80',
    title: 'HAVE A GOOD TIME',
    num: '#03',
  },
  {
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    title: 'STILL BREATHING',
    num: '#04',
  },
];

export const PosterHomepage: React.FC<PosterHomepageProps> = ({
  products,
  onSelectProduct,
  onQuickOrder,
  onNavigateShop,
  onNavigateAbout,
  onNavigateContact,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);


  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7,
        behavior: 'smooth',
      });
    }
  };



  /* ─── Personal Series auto-scroll ─────────────────── */
  const seriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = seriesRef.current;
    if (!el) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % PERSONAL_SERIES_POSTERS.length;
      el.scrollTo({ left: idx * (el.clientWidth * 0.75 + 16), behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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
          4. PERSONAL SERIES — Premium Editorial
          ═══════════════════════════════════════════════ */}
      <section className="w-full py-12 sm:py-20 max-w-[1878px] mx-auto">
        {/* Top: Section Header */}
        <div className="px-3 sm:px-5 lg:px-6 mb-8 sm:mb-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-inter-tight text-[10px] sm:text-[11px] tracking-[0.2em] text-black/40 uppercase mb-2">
                CURATED COLLECTION
              </p>
              <h2 className="font-inter-tight font-normal text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] leading-[0.92] tracking-[-0.04em] text-black uppercase select-none">
                PERSONAL
                <br />
                SERIES
              </h2>
            </div>
            <button
              onClick={onNavigateShop}
              className="group hidden sm:inline-flex items-center gap-1 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase shrink-0 hover:opacity-80 transition-opacity cursor-pointer pb-2"
            >
              <span>EXPLORE ALL</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Auto-scrolling Poster Cards */}
        <div className="px-3 sm:px-5 lg:px-6 mb-8 sm:mb-10">
          <div
            ref={seriesRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {PERSONAL_SERIES_POSTERS.map((poster, idx) => (
              <div
                key={idx}
                className="flex-none w-[280px] sm:w-[340px] md:w-[420px] lg:w-[520px] group cursor-pointer"
                onClick={() => onSelectProduct(products[idx % products.length])}
              >
                <div className="relative w-full aspect-[4/5] bg-[#ECECEC] overflow-hidden">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Poster Number Overlay */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="font-inter-tight font-normal text-[10px] sm:text-[11px] tracking-[0.15em] text-white/90 uppercase bg-black/50 backdrop-blur-xs px-2.5 py-1">
                      PERSONAL {poster.num}
                    </span>
                  </div>
                  {/* Bottom gradient + info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-5 pt-16">
                    <h4 className="font-inter-tight font-normal text-[13px] sm:text-sm md:text-base text-white tracking-[-0.01em]">
                      {poster.title}
                    </h4>
                    <p className="font-inter-tight text-[10px] sm:text-[11px] text-white/60 mt-0.5 uppercase tracking-wider">
                      Art Poster {poster.num}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Statement + CTA */}
        <div className="px-3 sm:px-5 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-black/10 pt-6 sm:pt-8">
            <div className="max-w-[500px]">
              <p className="font-inter-tight font-normal text-sm sm:text-base md:text-lg leading-relaxed tracking-normal text-black/80">
                Posters built around thoughts, feelings and moments worth keeping.
                Each piece in the series carries a personal meaning — designed to stay with you.
              </p>
            </div>
            <button
              onClick={onNavigateShop}
              className="group inline-flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-[#FF5131] tracking-wider uppercase shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span>SHOP THE SERIES</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF5131] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. MOCKUP GALLERY — 3-Card Auto-Scroll
          ═══════════════════════════════════════════════ */}
      <section className="w-full py-12 sm:py-20 overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-5 lg:px-6 mb-8 sm:mb-14 max-w-[1878px] mx-auto">
          <p className="font-inter-tight text-[10px] sm:text-[11px] tracking-[0.2em] text-black/40 uppercase mb-2">
            IN SITU
          </p>
          <h2 className="font-inter-tight font-medium text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em] uppercase">
            SEE THEM ON YOUR WALLS
          </h2>
        </div>

        {/* Infinite Auto-Scroll Marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex gap-5 sm:gap-8 lg:gap-10 animate-marquee w-max">
            {/* Duplicate set for seamless loop */}
            {[...MOCKUP_SLIDES, ...MOCKUP_SLIDES].map((slide, idx) => {
              const pos = idx % 3;
              const isCenter = pos === 1;
              return (
                <div
                  key={idx}
                  className={`flex-none group cursor-pointer ${
                    isCenter
                      ? 'w-[300px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[640px]'
                      : 'w-[240px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px]'
                  }`}
                  style={{
                    marginTop: isCenter ? '0' : '40px',
                  }}
                >
                  <div
                    className={`relative w-full overflow-hidden bg-[#F5F5F5] ${
                      isCenter
                        ? 'aspect-[3/4]'
                        : 'aspect-[4/5]'
                    }`}
                  >
                    <img
                      src={slide.poster}
                      alt={slide.caption}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  {/* Caption — only on center card */}
                  {isCenter && (
                    <div className="mt-4 sm:mt-5">
                      <p className="font-inter-tight text-[11px] sm:text-xs text-black/40 tracking-wider uppercase">
                        ART POSTER #{String((idx % MOCKUP_SLIDES.length) + 1).padStart(2, '0')}
                      </p>
                      <h4 className="font-inter-tight font-medium text-sm sm:text-base text-black tracking-[-0.01em] mt-0.5">
                        {slide.caption}
                      </h4>
                      <p className="font-inter-tight text-[10px] sm:text-[11px] text-black/40 tracking-wider mt-0.5">
                        PERSONAL SERIES © 2026
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inline keyframe for marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

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
          7. WHY BATIF + VALUE PROPS — Combined
          ═══════════════════════════════════════════════ */}
      <section className="w-full px-3 sm:px-5 lg:px-6 py-12 sm:py-16 max-w-[1878px] mx-auto">
        <div className="border border-black">
          {/* Top Row: 4 Value Props */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black border-b border-black">
            {[
              { label: '01', title: 'ORIGINAL ARTWORK', desc: 'Created by Abdelatif Haissoun' },
              { label: '02', title: 'PREMIUM PRINT', desc: 'Rich color and sharp detail' },
              { label: '03', title: 'LIMITED SERIES', desc: 'Curated collections' },
              { label: '04', title: 'MADE TO LIVE WITH', desc: 'Art for real spaces' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`px-5 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center group hover:bg-black hover:text-white transition-colors duration-400 cursor-default ${idx >= 2 ? 'border-t lg:border-t-0 border-black/10 lg:border-t-0' : ''}`}
              >
                <span className="font-inter-tight font-normal text-[10px] sm:text-[11px] text-black/30 group-hover:text-white/30 tracking-wider mb-2">
                  {item.label}
                </span>
                <h3 className="font-inter-tight font-medium text-[11px] sm:text-xs tracking-[0.12em] uppercase text-black group-hover:text-white mb-1">
                  {item.title}
                </h3>
                <p className="font-inter-tight font-normal text-xs text-black/50 group-hover:text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Row: 3 Service Perks */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
            {[
              { icon: '→', text: 'DELIVERY ACROSS MOROCCO' },
              { icon: '◆', text: 'SECURE PACKAGING' },
              { icon: '◉', text: 'CASH ON DELIVERY' },
            ].map((perk, idx) => (
              <div
                key={idx}
                className="px-5 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center gap-3 hover:bg-neutral-50 transition-colors group cursor-default"
              >
                <span className="font-inter-tight text-[10px] text-black/30 group-hover:text-[#FF5131] transition-colors shrink-0">
                  {perk.icon}
                </span>
                <span className="font-inter-tight font-normal text-[11px] sm:text-xs tracking-[0.12em] text-black/70 uppercase select-none">
                  {perk.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
