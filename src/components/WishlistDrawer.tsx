import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-batif text-2xl tracking-wider text-black">BATIF</span>
              <span className="font-inter-tight font-normal text-sm uppercase tracking-widest text-black/60">
                / WISHLIST ({items.length})
              </span>
            </div>
            <button onClick={onClose} className="p-1 hover:opacity-60 text-black cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <p className="font-inter-tight text-base font-normal text-black">Your wishlist is empty.</p>
                <p className="font-inter-tight text-xs text-black/60 mt-1">Tap the heart icon on any piece to save it for later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((product) => (
                  <div key={product.id} className="flex gap-4 pb-4 border-b border-black/10">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-24 object-cover bg-neutral-100 shrink-0 border border-black/10"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-inter-tight font-normal text-sm text-black">{product.name}</h4>
                          <button
                            onClick={() => onRemoveWishlist(product)}
                            className="text-black/40 hover:text-red-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-inter-tight text-xs text-black/60">{product.category}</p>
                        <p className="font-inter-tight font-normal text-sm text-black mt-1">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => onMoveToCart(product)}
                        className="mt-2 w-full bg-black text-white font-inter-tight font-normal text-xs uppercase py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MOVE TO BAG</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
