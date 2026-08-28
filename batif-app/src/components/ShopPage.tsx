import React, { useState, useMemo } from 'react';
import { Product } from '@/types/store';
import {
  SlidersHorizontal,
  X,
  Search,
  Heart,
  Eye,
  ShoppingBag,
  ArrowUpDown,
  RotateCcw,
  Check,
  Grid3X3,
  Columns2,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  initialCategory?: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  onQuickOrder,
  onToggleWishlist,
  isWishlisted,
  initialCategory = 'ALL'
}) => {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState<boolean>(true);
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);

  // Collapsible filter sections state
  const [openSections, setOpenSections] = useState<{
    search: boolean;
    categories: boolean;
    price: boolean;
    sizes: boolean;
    colors: boolean;
    editions: boolean;
  }>({
    search: true,
    categories: true,
    price: true,
    sizes: true,
    colors: true,
    editions: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract unique available filter options from catalog
  const categories = useMemo(() => {
    const cats = ['ALL', ...Array.from(new Set(products.map((p) => p.category.toUpperCase())))];
    return cats;
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return ['S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].filter((s) => set.has(s));
  }, [products]);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.name)) {
          map.set(c.name, c.hex);
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allBadges = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.badge) set.add(p.badge);
    });
    return Array.from(set);
  }, [products]);

  // Max price in products
  const maxProductPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 1800);
  }, [products]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'ALL' && p.category.toUpperCase() !== selectedCategory.toUpperCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Price range
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }

      // Sizes filter (match any of selected)
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => p.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Colors filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((colorName) =>
          p.colors.some((c) => c.name.toLowerCase() === colorName.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Badge filter
      if (selectedBadges.length > 0) {
        if (!p.badge || !selectedBadges.includes(p.badge)) return false;
      }

      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedBadges,
    inStockOnly,
  ]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return list.reverse();
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Toggle helpers
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBadges([]);
    setPriceRange([0, maxProductPrice + 200]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFilterCount =
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedBadges.length +
    (priceRange[0] > 0 || priceRange[1] < maxProductPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-white text-black">
      {/* Top Breadcrumb & Page Banner */}
      <div className="border-b border-black/10 bg-neutral-50/50">
        <div className="max-w-[1878px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-inter-tight text-xs tracking-wider uppercase text-black/60 font-medium">
                BATIF ARCHIVE / MENSWEAR
              </p>
              <h1 className="font-inter-tight font-normal text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-black mt-1">
                SHOP ALL PIECES
              </h1>
              <p className="font-inter-tight text-xs sm:text-sm text-black/70 mt-1 max-w-lg">
                Explore the complete seasonal range. Minimalist cuts, structured heavyweight organic fabrics, and bespoke details.
              </p>
            </div>

            {/* Quick stats & Layout control */}
            <div className="flex items-center gap-3">
              {/* Desktop Filter Toggle Button */}
              <button
                onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
                className="hidden lg:flex items-center gap-2 h-8 px-3 bg-white hover:bg-neutral-100 text-black font-inter-tight text-xs uppercase tracking-wider font-normal transition-colors cursor-pointer"
                title={isDesktopFilterOpen ? 'Hide Filters Sidebar' : 'Show Filters Sidebar'}
              >
                {isDesktopFilterOpen ? (
                  <>
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>HIDE FILTERS</span>
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="w-3.5 h-3.5" />
                    <span>SHOW FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                  </>
                )}
              </button>

              <span className="font-inter-tight text-xs uppercase tracking-wider text-black/80 font-normal px-3 py-1.5 bg-white">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
              </span>

              {/* Grid Column Selector */}
              <div className="hidden lg:flex items-center bg-white">
                <button
                  onClick={() => setGridColumns(3)}
                  className={`p-1.5 transition-colors ${gridColumns === 3 ? 'bg-black text-white' : 'text-black hover:bg-neutral-100'}`}
                  title="3 Columns"
                  aria-label="3 Column Grid"
                >
                  <Columns2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridColumns(4)}
                  className={`p-1.5 transition-colors ${gridColumns === 4 ? 'bg-black text-white' : 'text-black hover:bg-neutral-100'}`}
                  title="4 Columns"
                  aria-label="4 Column Grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar Filters + Products Grid */}
      <div className="max-w-[1878px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Filter & Sort Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-6 pb-4 border-b border-black/10">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 h-10 border bg-black text-white font-inter-tight text-xs uppercase tracking-wider font-normal cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Mobile Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3 pr-8 border border-black bg-white font-inter-tight text-xs uppercase tracking-wider font-normal appearance-none cursor-pointer focus:outline-hidden"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="newest">Newest</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-black absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* DESKTOP FILTER SIDEBAR (COLLAPSIBLE / EXPANDABLE) */}
          {isDesktopFilterOpen && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 pr-2 border-r border-black/10 pb-12">
              {/* Sidebar Header with Close button & Filter count */}
              <div className="flex items-center justify-between pb-3 border-b border-black">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
                  <h2 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-inter-tight uppercase text-black/60 hover:text-black tracking-wider underline cursor-pointer"
                    >
                      CLEAR
                    </button>
                  )}
                  <button
                    onClick={() => setIsDesktopFilterOpen(false)}
                    className="flex items-center gap-1 text-[11px] font-inter-tight uppercase text-black/70 hover:text-black hover:bg-neutral-100 px-2 py-1 border border-black/20 transition-colors cursor-pointer"
                    title="Close filter panel"
                  >
                    <PanelLeftClose className="w-3 h-3" />
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>

              {/* Search in Shop */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('search')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <label className="block font-inter-tight font-normal text-xs uppercase tracking-wider text-black cursor-pointer">
                    SEARCH COLLECTION
                  </label>
                  {openSections.search ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  )}
                </button>
                {openSections.search && (
                  <div className="relative pt-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Polo, Cargo, Heavyweight..."
                      className="w-full h-9 pl-8 pr-3 border border-black text-xs font-inter-tight text-black placeholder:text-black/40 focus:outline-hidden bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-black/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="border-t border-black/10 pt-5 space-y-3">
                <button
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    CATEGORIES
                  </h3>
                  {openSections.categories ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  )}
                </button>
                {openSections.categories && (
                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const count =
                        cat === 'ALL'
                          ? products.length
                          : products.filter((p) => p.category.toUpperCase() === cat).length;
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full flex items-center justify-between py-1.5 px-2 text-xs font-inter-tight uppercase transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-black text-white font-normal'
                              : 'text-black/80 hover:bg-neutral-100'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-black/50'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="border-t border-black/10 pt-5 space-y-3">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                      PRICE (USD)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-inter-tight font-normal text-black/70">
                      ${priceRange[0]} — ${priceRange[1]}
                    </span>
                    {openSections.price ? (
                      <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                    )}
                  </div>
                </button>
                {openSections.price && (
                  <div className="space-y-3 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black cursor-pointer h-1 bg-neutral-200"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center border border-black/20 px-2 py-1 bg-white">
                        <span className="text-[11px] text-black/50 mr-1">$</span>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full text-xs font-inter-tight focus:outline-hidden"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-xs text-black/40">—</span>
                      <div className="flex-1 flex items-center border border-black/20 px-2 py-1 bg-white">
                        <span className="text-[11px] text-black/50 mr-1">$</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full text-xs font-inter-tight focus:outline-hidden"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="border-t border-black/10 pt-5 space-y-3">
                <button
                  onClick={() => toggleSection('sizes')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    SIZES
                  </h3>
                  {openSections.sizes ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  )}
                </button>
                {openSections.sizes && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allSizes.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`h-8 min-w-[34px] px-2.5 border text-xs font-inter-tight uppercase font-normal transition-colors cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'text-black bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Color Swatches */}
              <div className="border-t border-black/10 pt-5 space-y-3">
                <button
                  onClick={() => toggleSection('colors')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    COLOR PALETTE
                  </h3>
                  {openSections.colors ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                  )}
                </button>
                {openSections.colors && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {allColors.map((color) => {
                      const isSelected = selectedColors.includes(color.name);
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`flex items-center gap-2 px-2 py-1.5 border text-[11px] font-inter-tight text-left transition-colors cursor-pointer truncate ${
                            isSelected
                              ? 'border-black bg-neutral-100 font-normal'
                              : 'bg-white'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Badges / Collections */}
              {allBadges.length > 0 && (
                <div className="border-t border-black/10 pt-5 space-y-3">
                  <button
                    onClick={() => toggleSection('editions')}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                      EDITIONS & DROPS
                    </h3>
                    {openSections.editions ? (
                      <ChevronUp className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-black/50 group-hover:text-black transition-colors" />
                    )}
                  </button>
                  {openSections.editions && (
                    <div className="space-y-1.5 pt-1">
                      {allBadges.map((badge) => {
                        const isSelected = selectedBadges.includes(badge);
                        return (
                          <button
                            key={badge}
                            onClick={() => toggleBadge(badge)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 border text-xs font-inter-tight uppercase transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-black text-white font-normal'
                                : 'text-black bg-white'
                            }`}
                          >
                            <span>{badge}</span>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* In Stock Filter */}
              <div className="border-t border-black/10 pt-5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="font-inter-tight text-xs uppercase tracking-wider font-normal text-black">
                    IN STOCK ONLY
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-black rounded-none cursor-pointer"
                  />
                </label>
              </div>

              {/* Reset Filters CTA */}
              {activeFilterCount > 0 && (
                <div className="pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-black/20 text-xs font-inter-tight uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer text-black font-normal"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RESET ALL FILTERS ({activeFilterCount})</span>
                  </button>
                </div>
              )}
            </aside>
          )}

          {/* MAIN PRODUCT LISTING */}
          <main className={`${isDesktopFilterOpen ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
            {/* Desktop Top Toolbar: Active Filters summary & Sort controls */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-black/10 gap-4">
              {/* Left Side: Filter Toggle & Active Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Quick Toggle Button when filters are hidden */}
                {!isDesktopFilterOpen && (
                  <button
                    onClick={() => setIsDesktopFilterOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border bg-black text-white text-xs font-inter-tight uppercase font-normal tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>OPEN FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                  </button>
                )}
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-inter-tight uppercase font-medium">
                    <span>Category: {selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('ALL')}
                      className="hover:text-neutral-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-inter-tight uppercase font-medium">
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-neutral-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 border border-black/20 text-black text-[11px] font-inter-tight uppercase font-medium"
                  >
                    <span>Size {size}</span>
                    <button onClick={() => toggleSize(size)} className="hover:text-black/60">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 border border-black/20 text-black text-[11px] font-inter-tight uppercase font-medium"
                  >
                    <span>{color}</span>
                    <button onClick={() => toggleColor(color)} className="hover:text-black/60">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FF5131] text-white text-[11px] font-inter-tight uppercase font-normal"
                  >
                    <span>{badge}</span>
                    <button onClick={() => toggleBadge(badge)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-inter-tight text-black/60 hover:text-black uppercase tracking-wider underline cursor-pointer ml-1"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-inter-tight text-xs uppercase tracking-wider text-black/60 font-normal">
                  SORT BY:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-black bg-white px-3 py-1.5 font-inter-tight text-xs uppercase tracking-wider font-normal focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                  <option value="newest">Latest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="border border-black p-12 sm:p-16 text-center bg-neutral-50/50">
                <h3 className="font-inter-tight font-normal text-xl uppercase tracking-tight text-black">
                  NO PRODUCTS MATCH YOUR FILTERS
                </h3>
                <p className="font-inter-tight text-xs sm:text-sm text-black/70 mt-2 max-w-md mx-auto">
                  Try adjusting your size, color, or price range parameters to discover available pieces.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-inter-tight font-normal text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET ALL FILTERS</span>
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  !isDesktopFilterOpen
                    ? gridColumns === 4
                      ? 'lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5'
                      : 'lg:grid-cols-3 xl:grid-cols-4'
                    : gridColumns === 4
                    ? 'lg:grid-cols-4'
                    : 'lg:grid-cols-3'
                } gap-5 sm:gap-6`}
              >
                {sortedProducts.map((product) => {
                  const wishlisted = isWishlisted(product.id);
                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col border border-black/10 bg-white hover:border-black transition-all duration-200"
                    >
                      {/* Image Container with Badges and Hover Actions */}
                      <div className="relative aspect-4/5 w-full bg-[#EAEAEA] overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span className="bg-[#FF5131] text-white font-inter-tight font-normal text-[10px] sm:text-[11px] tracking-wider px-2.5 py-1 uppercase shadow-xs">
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
                          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-all cursor-pointer ${
                            wishlisted
                              ? 'bg-black text-white border-black'
                              : 'bg-white/90 text-black border-black/20 hover:border-black hover:bg-white'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              wishlisted ? 'fill-white text-white' : 'text-black'
                            }`}
                          />
                        </button>

                        {/* Quick View Button overlay on hover */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-white text-black font-inter-tight font-normal text-[11px] uppercase tracking-wider hover:bg-neutral-100 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>QUICK VIEW</span>
                          </button>
                          <button
                            onClick={() => onQuickOrder(product)}
                            className="h-8 px-3 bg-black text-white border border-white/40 font-inter-tight font-normal text-[11px] uppercase tracking-wider hover:bg-neutral-900 cursor-pointer shadow-xs flex items-center justify-center"
                            title="Quick Add to Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3.5 flex flex-col justify-between flex-1 border-t border-black/10">
                        <div>
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-black/50 font-normal">
                            <span>{product.category}</span>
                            <span>{product.sizes.join(' · ')}</span>
                          </div>
                          <h2
                            onClick={() => onSelectProduct(product)}
                            className="font-inter-tight font-normal text-xs sm:text-sm text-black tracking-tight line-clamp-1 mt-1 cursor-pointer hover:underline"
                          >
                            {product.name}
                          </h2>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between">
                          <span className="font-inter-tight font-normal text-xs sm:text-sm text-black">
                            ${product.price.toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1">
                            {product.colors.slice(0, 3).map((col) => (
                              <span
                                key={col.name}
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-[10px] text-black/40">
                                +{product.colors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE SLIDE-OVER FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="p-4 border-b border-black flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <h3 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                  FILTERS ({activeFilterCount})
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-7 h-7 border border-black/20 flex items-center justify-center hover:border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h4 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    CATEGORIES
                  </h4>
                  {openSections.categories ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50" />
                  )}
                </button>
                {openSections.categories && (
                  <div className="space-y-1 pt-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between py-1.5 px-2 text-xs font-inter-tight uppercase text-left ${
                          selectedCategory === cat
                            ? 'bg-black text-white font-normal'
                            : 'text-black/80 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] ${selectedCategory === cat ? 'text-neutral-300' : 'text-black/50'}`}>
                          {cat === 'ALL'
                            ? products.length
                            : products.filter((p) => p.category.toUpperCase() === cat).length}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-black/10 pt-4 space-y-2">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h4 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    PRICE (MAX: ${priceRange[1]})
                  </h4>
                  {openSections.price ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50" />
                  )}
                </button>
                {openSections.price && (
                  <div className="space-y-3 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center border border-black/20 px-2 py-1 bg-white">
                        <span className="text-[11px] text-black/50 mr-1">$</span>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full text-xs font-inter-tight focus:outline-hidden"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-xs text-black/40">—</span>
                      <div className="flex-1 flex items-center border border-black/20 px-2 py-1 bg-white">
                        <span className="text-[11px] text-black/50 mr-1">$</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full text-xs font-inter-tight focus:outline-hidden"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="border-t border-black/10 pt-4 space-y-2">
                <button
                  onClick={() => toggleSection('sizes')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h4 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    SIZES
                  </h4>
                  {openSections.sizes ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50" />
                  )}
                </button>
                {openSections.sizes && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allSizes.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`h-8 min-w-[32px] px-2 border text-xs font-inter-tight uppercase ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'border-black/30 text-black bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="border-t border-black/10 pt-4 space-y-2">
                <button
                  onClick={() => toggleSection('colors')}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <h4 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                    COLORS
                  </h4>
                  {openSections.colors ? (
                    <ChevronUp className="w-3.5 h-3.5 text-black/50" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-black/50" />
                  )}
                </button>
                {openSections.colors && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {allColors.map((color) => {
                      const isSelected = selectedColors.includes(color.name);
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`flex items-center gap-1.5 px-2 py-1 border text-[11px] font-inter-tight truncate ${
                            isSelected ? 'border-black bg-neutral-100 font-normal' : 'border-black/20'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Badges / Collections */}
              {allBadges.length > 0 && (
                <div className="border-t border-black/10 pt-4 space-y-2">
                  <button
                    onClick={() => toggleSection('editions')}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <h4 className="font-inter-tight font-normal text-xs uppercase tracking-wider text-black">
                      EDITIONS & DROPS
                    </h4>
                    {openSections.editions ? (
                      <ChevronUp className="w-3.5 h-3.5 text-black/50" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-black/50" />
                    )}
                  </button>
                  {openSections.editions && (
                    <div className="space-y-1.5 pt-1">
                      {allBadges.map((badge) => {
                        const isSelected = selectedBadges.includes(badge);
                        return (
                          <button
                            key={badge}
                            onClick={() => toggleBadge(badge)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 border text-xs font-inter-tight uppercase transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-black text-white font-normal'
                                : 'text-black bg-white'
                            }`}
                          >
                            <span>{badge}</span>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Stock */}
              <div className="border-t border-black/10 pt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-inter-tight text-xs uppercase tracking-wider font-normal text-black">
                    IN STOCK ONLY
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-black bg-neutral-50 flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 h-10 border border-black bg-white text-black font-inter-tight font-normal text-xs uppercase tracking-wider"
              >
                RESET
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 h-10 border bg-black text-white font-inter-tight font-normal text-xs uppercase tracking-wider"
              >
                VIEW ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
