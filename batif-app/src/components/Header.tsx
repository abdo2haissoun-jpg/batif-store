import React, { useState } from 'react';
import { User, Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { BatifLogo } from './BatifLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
  cartCount: number;
  wishlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onOpenContact,
  onOpenAbout,
  cartCount,
  wishlistCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'HOME' || tab === 'SHOP' || tab === 'ABOUT') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'CONTACT') {
      onOpenContact();
    }
  };

  return (
    <header className="w-full max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pt-2 pb-1 sticky top-0 z-40 bg-white/95 backdrop-blur-xs">
      <div
        id="batif-main-header"
        className="w-full h-[48px] sm:h-[52px] bg-white border border-black flex items-center justify-between px-3 sm:px-5 lg:px-6 transition-all"
      >
        {/* Left: BATIF Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => handleNavClick('HOME')}
            className="text-left group cursor-pointer focus:outline-hidden flex items-center"
            aria-label="BATIF Home"
          >
            <BatifLogo className="h-[20px] sm:h-[24px] lg:h-[28px] w-auto transition-transform group-hover:scale-[1.02]" />
          </button>
        </div>

        {/* Center: Navigation Links (HOME, SHOP, ABOUT, CONTACT) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-[64px] xl:gap-[80px]">
          {(['HOME', 'SHOP', 'ABOUT', 'CONTACT'] as const).map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`font-inter-tight text-xs sm:text-sm lg:text-[14px] leading-tight uppercase tracking-wider transition-colors cursor-pointer relative py-1 focus:outline-hidden ${
                activeTab === item
                  ? 'text-black font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black'
                  : 'text-black/80 hover:text-black hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-black/40'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: Interactive Action Icons (User, Search, Wishlist/Heart, Cart) */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-7">
          {/* User Profile */}
          <button
            onClick={onOpenAccount}
            className="w-6 h-6 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer relative focus:outline-hidden"
            aria-label="User Account"
            title="Account"
          >
            <User className="w-[18px] h-[18px] stroke-[1.75]" />
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="w-6 h-6 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-hidden"
            aria-label="Search Collection"
            title="Search"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.75]" />
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="w-6 h-6 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer relative focus:outline-hidden"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-[18px] h-[18px] stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium font-inter-tight">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Bag */}
          <button
            onClick={onOpenCart}
            className="w-6 h-6 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer relative focus:outline-hidden"
            aria-label="Shopping Bag"
            title="Cart"
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FF5131] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium font-inter-tight animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-6 h-6 flex items-center justify-center text-black hover:opacity-60 transition-opacity focus:outline-hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.75]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[1.75]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full max-w-[1878px] mx-auto mt-2 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            {(['HOME', 'SHOP', 'ABOUT', 'CONTACT'] as const).map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-left font-inter-tight text-xl tracking-wider uppercase font-medium text-black py-2 border-b border-black/10 last:border-b-0 flex justify-between items-center"
              >
                <span>{item}</span>
                <span className="text-black/30">→</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
