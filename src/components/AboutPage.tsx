import React from 'react';
import { FadeInView } from './FadeInView';

interface AboutPageProps {
  onNavigateShop: () => void;
  onOpenContact: () => void;
}

const IMG = {
  founder: 'https://i.ibb.co/1JRqzRQ6/abdelatif.png',
  fallback: 'https://i.ibb.co/R4Q0jQby/abdelatif.png',
  teeDetail: 'https://i.ibb.co/0kTds1z/image-105.png',
  teeDetail2: 'https://i.ibb.co/WvvpqRgX/image-106.png',
  polo: 'https://i.ibb.co/bRyvYWhy/Rectangle-39864-1.png',
  polo2: 'https://i.ibb.co/S70pZvtz/Rectangle-39864-2.png',
  teeHero: 'https://i.ibb.co/XrrxzkM5/Rectangle-39864.png',
  teeClose: 'https://i.ibb.co/JXFvtmS/Chat-GPT-Image-Feb-28-2026-11-35-55-PM-1.png',
  shell: 'https://i.ibb.co/Zz97nJQD/Chat-GPT-Image-Apr-19-2026-01-51-05-PM-1.png',
  model1: 'https://i.ibb.co/RT3pB3hy/Chat-GPT-Image-Apr-24-2026-10-57-27-PM-1.png',
  model2: 'https://i.ibb.co/FLMXTr3q/Chat-GPT-Image-Feb-28-2026-11-35-55-PM-3.png',
};

/* ── tiny reusable bits ─────────────────────────── */
const L = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-inter-tight text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.2em] text-black/35 ${className}`}>{children}</span>
);
const HR = () => <div className="w-full h-px bg-black/10" />;
const Gap = ({ s = 'sm' }: { s?: string }) => <div className={s === 'lg' ? 'h-24 sm:h-32' : 'h-12 sm:h-16'} />;

const Img: React.FC<{
  src: string; alt: string; aspect?: string;
  caption?: string; className?: string; color?: boolean;
  cover?: string;
}> = ({ src, alt, aspect = '3/4', caption, className = '', color, cover }) => (
  <div className={className}>
    <div className="relative w-full bg-neutral-100 overflow-hidden" style={{ aspectRatio: aspect }}>
      <img src={src} alt={alt} referrerPolicy="no-referrer" loading="lazy"
        className={`w-full h-full object-cover ${cover || 'object-center'} ${color ? '' : 'grayscale contrast-[1.08]'} transition-transform duration-[1.2s] hover:scale-[1.03]`} />
    </div>
    {caption && <p className="mt-2 text-[9px] sm:text-[10px] text-black/30 uppercase tracking-[0.2em] font-inter-tight">{caption}</p>}
  </div>
);

/* ── PAGE ───────────────────────────────────────── */
export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop, onOpenContact }) => (
  <div className="w-full min-h-screen bg-white text-black font-inter-tight">

    {/* ━━ 01  INTRO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-6 lg:gap-16">
        {/* vertical label column */}
        <div className="flex lg:flex-col justify-between lg:justify-start gap-4">
          <L>Batif / About</L>
          <L className="hidden lg:block">01 / 10</L>
        </div>

        {/* editorial opening */}
        <div className="max-w-[850px]">
          <p className="text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.15] tracking-[-0.02em] font-light text-black">
            <span className="font-semibold">BATIF</span> was created around a simple idea:{' '}
            <span className="font-medium">everyday clothing should be considered, not complicated.</span>
          </p>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4 sm:gap-8">
            <p className="text-sm leading-[1.8] text-black/60 max-w-lg">
              A contemporary menswear atelier based in Casablanca, Morocco &mdash; focused on heavyweight essential garments built around proportion, fabric, and restraint.
            </p>
            <L className="sm:text-right sm:pt-1">Casablanca, Morocco / FW26</L>
          </div>
        </div>
      </div>
    </section>

    {/* ━━ TOC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pb-12">
      <div className="flex flex-wrap gap-x-8 gap-y-2 ml-0 lg:ml-[100px] lg:pl-16">
        {[
          ['01', 'Origin'], ['02', 'The Idea'], ['03', 'The Product'],
          ['04', 'The Founder'], ['05', 'Philosophy'], ['06', 'Archive'],
        ].map(([n, t]) => (
          <span key={n} className="text-[10px] tracking-[0.15em] uppercase text-black/30 hover:text-black transition-colors cursor-default font-inter-tight">
            {n} &mdash; {t}
          </span>
        ))}
      </div>
    </section>

    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6"><HR /></div>

    {/* ━━ 02  ORIGIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Gap s="lg" />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[100px_minmax(0,1.2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        <L className="pt-2">01 / Origin</L>

        {/* large image — takes more space */}
        <Img
          src={IMG.teeClose} alt="BATIF essential T-shirt close"
          aspect="4/5" className="w-full"
          cover="object-top"
          caption="BATIF / Casablanca / 2026"
        />

        {/* text — offset upward */}
        <div className="space-y-5 lg:pt-8">
          <p className="text-sm sm:text-[15px] leading-[1.85] text-black/70">
            BATIF Store was founded by <strong className="text-black font-medium">Abdelatif Haissoun</strong> in Casablanca &mdash; a city where Art Deco geometry meets centuries of garment craftsmanship.
          </p>
          <p className="text-sm sm:text-[15px] leading-[1.85] text-black/70">
            What started as a personal frustration became a clear vision: the men's essentials market was saturated with thin, disposable basics designed to be replaced season after season.
          </p>
          <p className="text-sm sm:text-[15px] leading-[1.85] text-black/70">
            Abdelatif wanted to build something different. Not fast-fashion competing on price, not a luxury label competing on logos. A small, focused atelier producing well-made essentials &mdash; pieces a man reaches for daily without thinking, but notices the difference the moment he puts one on.
          </p>
          <p className="text-sm sm:text-[15px] leading-[1.85] text-black/70">
            The idea was simple: take the T-shirt, the most universal garment in any man's wardrobe, and treat it with the design rigour usually reserved for tailored suiting. Consider the weight. The cut. How fabric moves against the body. How it looks after fifty washes, not just one.
          </p>
        </div>
      </div>
    </section>



    {/* ━━ 04  MANIFESTO ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Gap s="lg" />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="max-w-[800px] ml-0 lg:ml-[100px]">
        <p className="text-[clamp(1.6rem,3.8vw,3.2rem)] leading-[1.1] tracking-[-0.02em] font-light text-black">
          We believe everyday clothing should be considered, not complicated.
        </p>
        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-black/30 font-inter-tight">
          &mdash; Batif Store
        </p>
      </div>
    </section>

    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 mt-16 sm:mt-24"><HR /></div>

    {/* ━━ 05  PRODUCT PHILOSOPHY ━━━━━━━━━━━━━━━━━ */}
    <Gap />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_100px] gap-8 lg:gap-10 items-start">
        {/* image */}
        <Img
          src={IMG.polo2} alt="BATIF polo detail"
          aspect="4/5" className="w-full"
          cover="object-top"
          caption="Intarsia knit / Ribbed collar detail"
        />

        {/* content with subheadings */}
        <div className="space-y-8">
          <L>03 / The Product</L>

          <p className="text-sm sm:text-[15px] leading-[1.85] text-black/70">
            BATIF began with T-shirts because the T-shirt is the foundation of modern menswear &mdash; the garment worn most frequently, yet most often neglected.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-black">Fit</p>
              <p className="text-[13px] leading-[1.7] text-black/60">Proportion and movement. Dropped shoulders, balanced armholes, ergonomic seamlines that follow the contours of the body.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-black">Fabric</p>
              <p className="text-[13px] leading-[1.7] text-black/60">Custom milled 280&ndash;300 GSM combed organic cotton, double-knit on partner mill looms in Casablanca and Marrakech.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-black">Construction</p>
              <p className="text-[13px] leading-[1.7] text-black/60">Double-needle topstitching, reinforced collar bands, blind-stitched sleeves. Each piece in numbered, limited-run batches.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-black">Use</p>
              <p className="text-[13px] leading-[1.7] text-black/60">Designed for everyday life. Pieces that hold their shape, maintain structure, and feel considered without being over-designed.</p>
            </div>
          </div>
        </div>

        <L className="hidden lg:block pt-8">Batif / Essentials</L>
      </div>
    </section>



    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 mt-16 sm:mt-24"><HR /></div>

    {/* ━━ 07  THE FOUNDER ━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Gap />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[100px_minmax(0,1fr)_minmax(0,1.6fr)] gap-6 lg:gap-8 items-start">
        <L className="pt-2">04 / The Founder</L>

        {/* bio */}
        <div className="space-y-6 lg:pt-16">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-[26px] font-normal tracking-[-0.01em] text-black mb-1">
              Abdelatif Haissoun
            </h2>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/45 font-inter-tight">Founder / Creative Director</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/30 font-inter-tight">Batif Store</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/30 font-inter-tight">Casablanca, Morocco</p>
            </div>
          </div>

          <p className="text-sm leading-[1.85] text-black/70">
            Abdelatif founded BATIF with a direct conviction: the most basic garments in a man's wardrobe deserved more attention, not less. Based in Casablanca, he works at the intersection of garment construction, textile development, and considered design.
          </p>
          <p className="text-sm leading-[1.85] text-black/70">
            His approach is architectural rather than decorative. Rather than adding visual elements, he focuses on structural properties &mdash; how weight influences drape, how stitch density affects shape retention, how proportion determines whether a garment sits cleanly on the body.
          </p>
          <p className="text-sm leading-[1.85] text-black/70">
            Working directly with Moroccan mills and artisan tailors, he oversees each stage from fibre selection to final construction. Every BATIF piece is the result of this hands-on process &mdash; small in quantity, considered in execution, built to last.
          </p>
        </div>

        {/* portrait — tall */}
        <div className="w-full">
          <Img
            src={IMG.founder} alt="Abdelatif Haissoun, Founder of BATIF"
            aspect="3/4" cover="object-top"
            caption="Portrait / Casablanca"
            className="w-full"
          />
        </div>
      </div>
    </section>

    {/* ━━ FOUNDER + DETAIL IMAGE ━━━━━━━━━━━━━━━━━ */}
    <Gap s="lg" />
    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-[1fr_280px] gap-4 sm:gap-6 items-end">
        <Img
          src={IMG.model2} alt="BATIF on model"
          aspect="16/9" color
          cover="object-cover object-top"
          caption="Campaign / FW26"
        />
        <Img
          src={IMG.teeDetail2} alt="BATIF fabric texture"
          aspect="3/4"
          cover="object-cover object-top"
          caption="Archive / 003"
        />
      </div>
    </div>

    {/* ━━ 08  FOUNDER QUOTE ━━━━━━━━━━━━━━━━━━━━━━ */}
    <Gap s="lg" />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="max-w-[750px] ml-0 lg:ml-[100px]">
        <p className="text-[clamp(1.6rem,4vw,3.4rem)] leading-[1.1] tracking-[-0.015em] font-light text-black">
          &ldquo;A T-shirt should feel like it was{' '}
          <span className="font-medium">made with intention</span> &mdash; not like it was
          made to be replaced.&rdquo;
        </p>
        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-black/30 font-inter-tight">
          &mdash; Abdelatif Haissoun, Founder
        </p>
      </div>
    </section>

    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 mt-16 sm:mt-24"><HR /></div>





    <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 mt-16 sm:mt-24"><HR /></div>

    {/* ━━ 11  WHY BATIF — three-column editorial ━ */}
    <Gap />
    <section className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Column 1: Bold statement */}
        <div>
          <L className="block mb-8">08 / Why BATIF</L>
          <p className="text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.35] tracking-[-0.01em] font-semibold text-black">
            BATIF exists because most men's essentials are designed to be disposable. Thin fabric. Shapeless cuts. Logos that do the talking instead of the garment itself.
          </p>
        </div>

        {/* Column 2: Supporting text */}
        <div className="space-y-5 lg:pt-[46px]">
          <p className="text-[13px] sm:text-sm leading-[1.85] text-black/65">
            We believe the most important pieces in a man's wardrobe are the ones he wears every day. The T-shirt under a jacket. The polo on a weekend morning. The simple garment that needs to hold its shape, maintain its structure, and feel considered.
          </p>
          <p className="text-[13px] sm:text-sm leading-[1.85] text-black/65">
            BATIF adds presence to the everyday. We use heavyweight organic cotton, produce in small numbered batches in Morocco, and refuse to chase trends that disappear in a single season.
          </p>
          <p className="text-[13px] sm:text-sm leading-[1.85] text-black/65">
            If you're looking for the loudest thing in the room, BATIF isn't that. But if you want something that feels solid, sits cleanly, and gets better with wear &mdash; that's exactly what we build.
          </p>
        </div>

        {/* Column 3: Continuation / What comes next */}
        <div className="space-y-5 lg:pt-[46px]">
          <p className="text-[13px] sm:text-sm leading-[1.85] text-black/65">
            BATIF is still in its early chapters. The focus remains on deepening what already exists &mdash; refining silhouettes, developing better materials, expanding the range of essentials with the same design discipline.
          </p>
          <p className="text-[13px] sm:text-sm leading-[1.85] text-black/65">
            New categories will arrive only when they meet the same standard. The goal is not rapid expansion &mdash; it is a brand that quietly improves, quietly grows, and quietly earns its place in a man's daily wardrobe.
          </p>
        </div>
      </div>
    </section>

    <Gap />


  </div>
);
