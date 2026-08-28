import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/store';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenProductPage?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenProductPage,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<'main' | 'detail'>('main');
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setActiveImage('main');
      setAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const currentImg =
    activeImage === 'detail' && product.detailImage
      ? product.detailImage
      : product.image;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-black/20 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left: Product Images with thumbnail switcher */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between bg-neutral-100 border-b md:border-b-0 md:border-r border-black">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-black/20/10">
              <img
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#FF3300] text-white font-inter-tight font-normal text-[11px] tracking-wider px-3 py-1 uppercase">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.detailImage && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setActiveImage('main')}
                  className={`w-16 h-20 border overflow-hidden cursor-pointer ${
                    activeImage === 'main' ? 'border-2 border-black' : 'border-black/20 opacity-70'
                  }`}
                >
                  <img src={product.image} alt="main view" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setActiveImage('detail')}
                  className={`w-16 h-20 border overflow-hidden cursor-pointer ${
                    activeImage === 'detail' ? 'border-2 border-black' : 'border-black/20 opacity-70'
                  }`}
                >
                  <img src={product.detailImage} alt="detail view" className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="font-inter-tight text-xs font-normal uppercase tracking-widest text-black/50">
                {product.category}
              </span>
              <h2 className="font-inter-tight font-normal text-2xl sm:text-3xl text-black uppercase mt-1 tracking-tight">
                {product.name}
              </h2>
              <p className="font-inter-tight font-normal text-xl text-black mt-2">
                ${product.price.toFixed(2)}
              </p>

              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="font-inter-tight text-sm text-black/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Selector */}
              <div className="mt-6">
                <label className="block font-inter-tight font-normal text-xs uppercase tracking-wider text-black mb-2">
                  COLOR: <span className="font-normal text-black/70">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer ${
                        selectedColor === c.name ? 'border-black scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            c.hex === '#FFFFFF' || c.hex === '#FAF0E6' || c.hex === '#E5E0D8'
                              ? 'bg-black'
                              : 'bg-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    SELECT SIZE
                  </label>
                  <span className="font-inter-tight text-[11px] text-black/60 uppercase">
                    Model is 186cm wearing size L
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`font-inter-tight font-normal text-sm min-w-[48px] h-10 border flex items-center justify-center transition-colors cursor-pointer ${
                        selectedSize === s
                          ? 'border-black bg-black text-white'
                          : 'border-black/30 hover:border-black text-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-black space-y-2.5">
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-inter-tight font-normal text-sm uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-12 h-12 border border-black/20 flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-[#FF3300] border-[#FF3300] text-white' : 'hover:bg-neutral-100 text-black'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {onOpenProductPage && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenProductPage(product);
                  }}
                  className="w-full py-2.5 border border-black/20 text-black text-xs font-inter-tight uppercase font-normal hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>VIEW FULL DETAILS & MULTI-ANGLE PICS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
