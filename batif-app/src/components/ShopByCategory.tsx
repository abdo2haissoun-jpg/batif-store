import React, { useRef } from 'react';
import { ArrowRight, ArrowLeft, Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/store';

interface ShopByCategoryProps {
  title?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  sectionId?: string;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  title = 'SHOP BY CATEGORY',
  products,
  onSelectProduct,
  onQuickOrder,
  onToggleWishlist,
  isWishlisted,
  sectionId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={sectionId} className="w-full px-3 sm:px-5 lg:px-6 py-8 sm:py-12 max-w-[1878px] mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-black pb-3 mb-5 sm:mb-6">
        <h2 className="font-inter-tight font-medium text-base sm:text-lg lg:text-xl text-black tracking-[-0.01em] uppercase">
          {title}
        </h2>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 border border-black/15/30 hover:border-black flex items-center justify-center text-black transition-colors cursor-pointer"
            aria-label="Previous Products"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="group flex items-center gap-1.5 font-inter-tight font-medium text-xs sm:text-sm text-black tracking-wider uppercase hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span>NEXT</span>
            <ArrowRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Products Row / Horizontal Carousel (Figma: 345.62px x 555.58px, gap 39.2px) */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 lg:gap-[39.2px] overflow-x-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => {
          const wishlisted = isWishlisted(product.id);

          return (
            <div
              key={product.id}
              className="flex-none w-[260px] sm:w-[300px] md:w-[325px] lg:w-[345.62px] group flex flex-col cursor-pointer select-none"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image Container with Studio Background (Figma: 345.62px x 484.48px) */}
              <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] lg:h-[484.48px] bg-[#F1EFEA] overflow-hidden group">
                <img
                  src={product.galleryImages && product.galleryImages.length > 1 ? product.galleryImages[1] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out absolute inset-0"
                  loading="lazy"
                  onClick={() => onSelectProduct(product)}
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:opacity-0 transition-opacity duration-500 ease-out"
                  loading="lazy"
                  onClick={() => onSelectProduct(product)}
                />

                {/* Badges */}
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`text-[11px] sm:text-[12px] font-inter-tight font-normal tracking-wider px-2.5 py-1 uppercase ${
                        product.badge.includes('LIMITED') || product.badge.includes('NEW')
                          ? 'bg-[#FF5131] text-white'
                          : 'bg-black text-white'
                      }`}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer shadow-xs"
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlisted ? 'fill-[#FF5131] text-[#FF5131]' : 'text-black'
                    }`}
                  />
                </button>

                {/* Quick Action Overlay on Hover */}
                <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="flex-1 bg-white/95 hover:bg-white text-black font-inter-tight font-normal text-xs py-2.5 px-2 flex items-center justify-center gap-1.5 border border-black/15 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>QUICK VIEW</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickOrder(product);
                    }}
                    className="bg-black hover:bg-[#FF5131] text-white font-inter-tight font-normal text-xs py-2.5 px-3 flex items-center justify-center transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Metadata */}
              <div className="pt-2.5 flex flex-col" onClick={() => onSelectProduct(product)}>
                <h4 className="font-inter-tight font-normal text-xs sm:text-[13px] md:text-sm leading-snug text-black tracking-[-0.01em] line-clamp-1 group-hover:underline">
                  {product.name}
                </h4>
                <p className="font-inter-tight font-normal text-xs sm:text-[13px] text-black/80 mt-0.5">
                  {product.price.toFixed(2)}$
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

