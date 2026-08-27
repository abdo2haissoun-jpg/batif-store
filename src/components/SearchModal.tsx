import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white border border-black w-full max-w-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-6 h-6 text-black" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH BATIF ARCHIVE, POLOS, OUTERWEAR..."
              className="w-full font-inter-tight font-normal text-lg sm:text-2xl uppercase tracking-wider text-black placeholder:text-black/30 focus:outline-hidden"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-60 text-black cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-2">
          <span className="font-inter-tight text-xs font-normal text-black/50 uppercase mr-2 self-center">
            Popular:
          </span>
          {['Noir Pocket Tee', 'Polo Edition', 'Orange Shell', 'Acid Graphic'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="font-inter-tight text-xs border border-black/20 hover:border-black px-3 py-1 bg-neutral-50 hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-8 max-h-[50vh] overflow-y-auto space-y-4">
          <p className="font-inter-tight text-xs font-normal uppercase tracking-widest text-black/60">
            {query.trim() ? `FOUND ${filtered.length} RESULTS` : 'FEATURED PIECES'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 border border-black/10 hover:border-black transition-colors cursor-pointer group bg-neutral-50 hover:bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-20 object-cover bg-neutral-200"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-inter-tight uppercase text-black/60 font-normal">
                    {product.category}
                  </span>
                  <h5 className="font-inter-tight font-normal text-sm text-black group-hover:underline">
                    {product.name}
                  </h5>
                  <p className="font-inter-tight font-normal text-xs text-black mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
