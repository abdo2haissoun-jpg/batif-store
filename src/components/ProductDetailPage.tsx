import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  Eye,
  Layers,
  Feather,
  Info,
  X,
  Clock,
  MapPin,
  Maximize2
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onQuickOrder: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  onNavigateHome: () => void;
  onNavigateShop: (category?: string) => void;
  onSelectProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onAddToCart,
  onQuickOrder,
  onToggleWishlist,
  isWishlisted,
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
  onShowToast,
}) => {
  // Gallery images array
  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image, product.detailImage || product.image].filter(Boolean) as string[];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('specs');

  // Reset states when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const wishlisted = isWishlisted(product.id);

  // Related products from same category or curated
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.badge))
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast(`Copied product link for "${product.name}"`);
  };

  const handleBuyNow = () => {
    onAddToCart(product, selectedSize, selectedColor);
    onQuickOrder(product);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black">
      {/* 1. Breadcrumb & Top Bar */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 py-4">
        <div className="border border-black/15 bg-neutral-50 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-inter-tight uppercase tracking-wider">
          <div className="flex items-center gap-2 text-black/70 flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-black transition-colors cursor-pointer"
            >
              HOME
            </button>
            <ChevronRight className="w-3 h-3 text-black/40" />
            <button
              onClick={() => onNavigateShop(product.category.toUpperCase())}
              className="hover:text-black transition-colors cursor-pointer"
            >
              {product.category}
            </button>
            <ChevronRight className="w-3 h-3 text-black/40" />
            <span className="text-black font-normal truncate max-w-[200px] sm:max-w-[300px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateShop('ALL')}
              className="flex items-center gap-1.5 text-black hover:opacity-60 transition-opacity cursor-pointer font-normal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO COLLECTION</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main PDP Content Grid */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* LEFT: Multi-Angle Interactive Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Strip (Vertical on md+, Horizontal on mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 shrink-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 shrink-0 transition-all cursor-pointer bg-neutral-100 overflow-hidden ${
                    activeImageIndex === idx
                      ? 'ring-2 ring-black'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 font-inter-tight">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Primary Viewport Image */}
            <div className="flex-1 relative bg-[#F5F5F3] overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                {product.badge && (
                  <span className="bg-black text-white text-[11px] font-inter-tight font-normal uppercase tracking-wider px-3 py-1">
                    {product.badge}
                  </span>
                )}
                {product.isLimited && (
                  <span className="bg-[#FF5131] text-white text-[10px] font-inter-tight font-normal uppercase tracking-wider px-2.5 py-0.5 shadow-xs">
                    LIMITED DROP
                  </span>
                )}
              </div>

              {/* Lightbox / Zoom Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer rounded-full shadow"
                title="Expand Full View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Main Image */}
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gallery Counter */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-black/30 px-3 py-1 text-[11px] font-inter-tight uppercase text-black font-normal tracking-wider">
                VIEW {activeImageIndex + 1} / {images.length} • BATIF ATELIER
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information, Purchase Controls & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pl-2">
            
            {/* Header: Title, SKU & Price */}
            <div className="border-b border-black pb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-inter-tight uppercase tracking-widest text-black/60 font-normal">
                  BATIF MENSWEAR • {product.category}
                </span>
                {product.sku && (
                  <span className="text-[11px] font-inter-tight uppercase tracking-wider text-black/40 font-mono">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-inter-tight font-normal uppercase tracking-tight text-black leading-tight">
                {product.name}
              </h1>

              {/* Price & COD Note */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-inter-tight font-normal text-black">
                  {product.price} MAD
                </span>
                {product.originalPrice && (
                  <span className="text-base sm:text-lg font-inter-tight font-normal text-black/40 line-through">
                    {product.originalPrice} MAD
                  </span>
                )}
                <span className="ml-auto text-[11px] font-inter-tight uppercase tracking-wider bg-neutral-100 border border-black/20 px-2 py-1 text-black font-normal">
                  CASH ON DELIVERY
                </span>
              </div>

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-inter-tight uppercase tracking-wider text-black/80 font-normal">
                  IN STOCK • CRAFTED IN CASABLANCA ATELIER
                </span>
              </div>
            </div>

            {/* Product Narrative Description */}
            <p className="text-sm sm:text-base text-black/80 font-inter-tight leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Picker */}
            <div className="space-y-2.5 pt-2 border-t border-black/10">
              <div className="flex items-center justify-between text-xs font-inter-tight uppercase tracking-wider">
                <span className="text-black font-normal">COLOR PALETTE:</span>
                <span className="text-black/70">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-2 border text-xs font-inter-tight uppercase transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-100 ring-1 ring-black font-normal text-black'
                          : 'border-black/20 hover:border-black text-black/80 bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector & Size Guide */}
            <div className="space-y-2.5 pt-2 border-t border-black/10">
              <div className="flex items-center justify-between text-xs font-inter-tight uppercase tracking-wider">
                <span className="text-black font-normal">SELECT SIZE:</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-black/70 hover:text-black underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>SIZE GUIDE</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 min-w-[48px] px-3.5 border text-xs font-inter-tight uppercase font-normal transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-black/30 hover:border-black text-black bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <span className="text-xs font-inter-tight uppercase tracking-wider text-black font-normal">
                QUANTITY:
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-black/30 bg-white h-11">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-base hover:bg-neutral-100 transition-colors cursor-pointer border-r border-black/20"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-inter-tight text-sm font-normal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-base hover:bg-neutral-100 transition-colors cursor-pointer border-l border-black/20"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-black/60 font-inter-tight uppercase">
                  Subtotal: {(product.price * quantity).toLocaleString()} MAD
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-4">
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product, selectedSize, selectedColor);
                    }
                  }}
                  className="flex-1 h-12 bg-black text-white font-inter-tight text-xs sm:text-sm uppercase tracking-wider font-normal hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-12 h-12 border border-black/20 flex items-center justify-center transition-colors cursor-pointer ${
                    wishlisted ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="w-12 h-12 border border-black/30 hover:border-black bg-white flex items-center justify-center text-black transition-colors cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Fast Cash on Delivery Order Button */}
              <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-white text-black border border-black/20 font-inter-tight text-xs sm:text-sm uppercase tracking-wider font-normal hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>ORDER NOW — CASH ON DELIVERY (FREE MOROCCO DELIVERY)</span>
              </button>
            </div>

            {/* Value Highlights Box */}
            <div className="border border-black/20 bg-neutral-50 p-4 space-y-3 text-xs font-inter-tight uppercase text-black font-normal">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-black shrink-0" />
                <span>Express Doorstep Delivery (2–4 Days across Morocco)</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-black shrink-0" />
                <span>14-Day Free Exchanges & Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>Guaranteed Moroccan Artisanal Craftsmanship</span>
              </div>
            </div>

            {/* Accordion Tabs for Specifications, Fit, Care & Shipping */}
            <div className="border-t border-black pt-4 space-y-3 font-inter-tight">
              {/* Accordion 1: Product Specifications & Architecture */}
              <div className="border border-black/20 bg-white">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'specs' ? '' : 'specs')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50"
                >
                  <span className="text-xs uppercase tracking-wider font-normal text-black flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-black" />
                    FABRIC & ARCHITECTURAL SPECS
                  </span>
                  <span className="text-xs text-black/60">{activeAccordion === 'specs' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'specs' && (
                  <div className="px-4 pb-4 pt-1 border-t border-black/10 text-xs text-black/80 space-y-2 leading-relaxed">
                    {product.fabric && (
                      <p><strong>Fabric:</strong> {product.fabric}</p>
                    )}
                    {product.gsm && (
                      <p><strong>Fabric Weight:</strong> {product.gsm} GSM (Heavyweight structure)</p>
                    )}
                    {product.fit && (
                      <p><strong>Cut & Silhouette:</strong> {product.fit}</p>
                    )}
                    {product.details && product.details.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 pt-1">
                        {product.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Care & Longevity */}
              <div className="border border-black/20 bg-white">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50"
                >
                  <span className="text-xs uppercase tracking-wider font-normal text-black flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5 text-black" />
                    GARMENT CARE & LONGEVITY
                  </span>
                  <span className="text-xs text-black/60">{activeAccordion === 'care' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'care' && (
                  <div className="px-4 pb-4 pt-1 border-t border-black/10 text-xs text-black/80 space-y-2 leading-relaxed">
                    {product.care && product.care.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.care.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Wash inside out on cold delicate cycle. Dry flat away from direct sunlight to preserve pigment integrity.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Delivery & Cash on Delivery */}
              <div className="border border-black/20 bg-white">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50"
                >
                  <span className="text-xs uppercase tracking-wider font-normal text-black flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-black" />
                    SHIPPING & CASH ON DELIVERY (MOROCCO)
                  </span>
                  <span className="text-xs text-black/60">{activeAccordion === 'shipping' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="px-4 pb-4 pt-1 border-t border-black/10 text-xs text-black/80 space-y-2 leading-relaxed">
                    <p>• <strong>Casablanca & Rabat:</strong> Next business day delivery.</p>
                    <p>• <strong>Marrakech, Tangier, Fes, Agadir & other cities:</strong> 2 to 4 business days.</p>
                    <p>• <strong>Payment:</strong> Pay in Cash upon doorstep delivery directly to the courier agent after verifying your package.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Founder Note Seal */}
            <div className="border-t border-black pt-4 flex items-center justify-between text-xs text-black/60 font-inter-tight">
              <span className="font-handwriting text-xl text-black">Made by abdelatif haissoun</span>
              <span className="uppercase text-[10px] tracking-wider">BATIF CASABLANCA ATELIER</span>
            </div>
          </div>
        </div>

        {/* 3. RELATED CREATIONS & COMPLETE THE LOOK */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-black">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-inter-tight font-normal uppercase tracking-widest text-black/60">
                  CURATED SELECTION
                </span>
                <h2 className="text-xl sm:text-2xl font-inter-tight font-normal uppercase tracking-wider text-black">
                  COMPLETE THE LOOK • RELATED PIECES
                </h2>
              </div>
              <button
                onClick={() => onNavigateShop('ALL')}
                className="hidden sm:inline-block text-xs font-inter-tight uppercase tracking-wider hover:opacity-60 underline cursor-pointer"
              >
                VIEW FULL SHOP →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="border border-black group bg-white flex flex-col justify-between"
                >
                  <div
                    onClick={() => onSelectProduct(relProduct)}
                    className="relative aspect-4/5 bg-neutral-100 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    {relProduct.badge && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-inter-tight font-normal uppercase px-2 py-0.5">
                        {relProduct.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 border-t border-black flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[11px] font-inter-tight text-black/60 uppercase">
                        {relProduct.category}
                      </p>
                      <h3
                        onClick={() => onSelectProduct(relProduct)}
                        className="text-xs sm:text-sm font-inter-tight font-normal uppercase text-black line-clamp-1 hover:underline cursor-pointer mt-1"
                      >
                        {relProduct.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-inter-tight font-normal text-black mt-2">
                        {relProduct.price} MAD
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/10 flex gap-2">
                      <button
                        onClick={() => onSelectProduct(relProduct)}
                        className="flex-1 py-1.5 border border-black text-[11px] font-inter-tight uppercase hover:bg-black hover:text-white transition-colors cursor-pointer text-center"
                      >
                        VIEW PIECE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-2xl shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4 font-inter-tight">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-black" />
                <h3 className="text-base sm:text-lg font-normal uppercase tracking-wider text-black">
                  BATIF SIZE & FIT MEASUREMENT GUIDE
                </h3>
              </div>
              <p className="text-xs text-black/70 leading-relaxed">
                All measurements are taken flat in centimeters. BATIF garments are tailored with structured drape and relaxed dropped shoulder aesthetics.
              </p>

              {/* Table */}
              <div className="overflow-x-auto border border-black mt-4">
                <table className="w-full text-left text-xs uppercase">
                  <thead className="bg-black text-white font-normal">
                    <tr>
                      <th className="p-2.5 border-r border-white/20">SIZE</th>
                      <th className="p-2.5 border-r border-white/20">CHEST (CM)</th>
                      <th className="p-2.5 border-r border-white/20">LENGTH (CM)</th>
                      <th className="p-2.5 border-r border-white/20">SHOULDER (CM)</th>
                      <th className="p-2.5">RECOMMENDED HEIGHT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20">
                    <tr>
                      <td className="p-2.5 font-normal border-r border-black/20">S</td>
                      <td className="p-2.5 border-r border-black/20">106</td>
                      <td className="p-2.5 border-r border-black/20">70</td>
                      <td className="p-2.5 border-r border-black/20">52</td>
                      <td className="p-2.5">165–175 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-normal border-r border-black/20">M</td>
                      <td className="p-2.5 border-r border-black/20">112</td>
                      <td className="p-2.5 border-r border-black/20">72</td>
                      <td className="p-2.5 border-r border-black/20">54</td>
                      <td className="p-2.5">172–182 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-normal border-r border-black/20">L</td>
                      <td className="p-2.5 border-r border-black/20">118</td>
                      <td className="p-2.5 border-r border-black/20">74</td>
                      <td className="p-2.5 border-r border-black/20">56</td>
                      <td className="p-2.5">178–188 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-normal border-r border-black/20">XL</td>
                      <td className="p-2.5 border-r border-black/20">124</td>
                      <td className="p-2.5 border-r border-black/20">76</td>
                      <td className="p-2.5 border-r border-black/20">58</td>
                      <td className="p-2.5">185–195 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-normal border-r border-black/20">XXL</td>
                      <td className="p-2.5 border-r border-black/20">130</td>
                      <td className="p-2.5 border-r border-black/20">78</td>
                      <td className="p-2.5 border-r border-black/20">60</td>
                      <td className="p-2.5">190+ cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-6 py-2 bg-black text-white text-xs uppercase tracking-wider font-normal cursor-pointer"
                >
                  GOT IT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-neutral-300 cursor-pointer z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={images[activeImageIndex] || product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto object-contain border border-white/20"
            />
            <p className="text-white text-xs font-inter-tight uppercase tracking-wider mt-4">
              {product.name} — VIEW 0{activeImageIndex + 1} OF 0{images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
