import React from 'react';
import { X, Feather, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { BatifLogo } from './BatifLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFullAbout?: () => void;
  onNavigateShop?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onNavigateToFullAbout,
  onNavigateShop,
}) => {
  if (!isOpen) return null;

  const founderImage = 'https://i.ibb.co/1JRqzRQ6/abdelatif.png';
  const fallbackFounderImage = 'https://i.ibb.co/R4Q0jQby/abdelatif.png';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-4xl shadow-2xl p-6 sm:p-10 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-2">
          <BatifLogo className="h-[32px] sm:h-[40px] w-auto text-black" />
        </div>
        <p className="font-inter-tight font-normal text-center text-xs uppercase tracking-widest text-black/50 mb-8">
          THE STORY OF BATIF STORE • CASABLANCA ATELIER
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
          {/* Founder image */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="p-2 bg-neutral-50 w-full max-w-[240px]">
              <div className="aspect-3/4 overflow-hidden bg-neutral-200">
                <img
                  src={founderImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackFounderImage;
                  }}
                  alt="Abdelatif Haissoun - BATIF Founder"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="pt-2 text-center">
                <p className="text-xs uppercase font-normal text-black">ABDELATIF HAISSOUN</p>
                <p className="text-[10px] uppercase text-black/60">FOUNDER & CREATIVE DIRECTOR</p>
              </div>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="md:col-span-8 space-y-4 font-inter-tight text-xs sm:text-sm text-black/85 leading-relaxed">
            <p className="text-sm sm:text-base font-normal text-black border-l-2 border-black/30 pl-3">
              BATIF was founded in Casablanca by Abdelatif Haissoun with a clear purpose: to craft architectural menswear that commands presence through texture, heavyweight drape, and clean geometry.
            </p>
            <p>
              Rejecting flimsy synthetic mass-production, BATIF mills custom 280+ GSM combed organic cottons and micro-ripstop fabrics directly in Morocco. Handcrafted in small limited batches by master tailors.
            </p>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/10 text-[11px] uppercase">
              <div className="p-2 bg-neutral-50 text-center">
                <Feather className="w-4 h-4 mx-auto mb-1 text-black" />
                <span>280+ GSM Heavy</span>
              </div>
              <div className="p-2 bg-neutral-50 text-center">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-black" />
                <span>Zero Logo Slop</span>
              </div>
              <div className="p-2 bg-neutral-50 text-center">
                <Globe className="w-4 h-4 mx-auto mb-1 text-black" />
                <span>Made in Morocco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature & Buttons */}
        <div className="pt-4 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-handwriting text-2xl text-black">Made by abdelatif haissoun</p>
            <p className="font-inter-tight text-[10px] font-normal tracking-widest text-black/60 uppercase">
              FOUNDER & CREATIVE DIRECTOR • CASABLANCA
            </p>
          </div>

          <div className="flex gap-2.5">
            {onNavigateToFullAbout && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullAbout();
                }}
                className="px-4 py-2 text-xs font-inter-tight uppercase tracking-wider font-normal hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                READ FULL STORY
              </button>
            )}
            {onNavigateShop && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateShop();
                }}
                className="px-4 py-2 bg-black text-white text-xs font-inter-tight uppercase tracking-wider font-normal hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                EXPLORE SHOP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
