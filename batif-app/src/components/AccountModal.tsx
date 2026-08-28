import React, { useState } from 'react';
import { X, User, Package, Heart, LogOut, Check } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Youssef Bennani');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoggedIn(true);
    onShowToast(`Welcome back, ${email.split('@')[0]}!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-md shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <span className="font-batif text-3xl tracking-wider text-black block">BATIF</span>
          <h3 className="font-inter-tight font-normal text-xl uppercase tracking-tight text-black mt-1">
            {isLoggedIn ? 'CLIENT PRIVILEGE ACCOUNT' : 'CLIENT SIGN IN'}
          </h3>
        </div>

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-neutral-100 bg-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-normal text-sm">
                YB
              </div>
              <div>
                <p className="font-inter-tight font-normal text-sm text-black">{name}</p>
                <p className="font-inter-tight text-xs text-black/60">{email || 'youssef@batif.vip'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3 flex items-center justify-between hover:bg-neutral-50 cursor-pointer">
                <div className="flex items-center gap-2 font-inter-tight text-xs font-normal uppercase">
                  <Package className="w-4 h-4" />
                  <span>Orders & COD Trackers (1 active)</span>
                </div>
                <span className="text-xs text-emerald-700 font-normal">In Transit</span>
              </div>
              <div className="p-3 flex items-center justify-between hover:bg-neutral-50 cursor-pointer">
                <div className="flex items-center gap-2 font-inter-tight text-xs font-normal uppercase">
                  <Heart className="w-4 h-4" />
                  <span>VIP Early Access Drops</span>
                </div>
                <span className="text-xs text-[#FF3300] font-normal">Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                onShowToast('Signed out of BATIF session');
              }}
              className="w-full mt-4 py-2.5 font-inter-tight font-normal text-xs uppercase hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip@batif.store"
                className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-inter-tight font-normal text-xs uppercase tracking-wider py-3.5 transition-colors cursor-pointer"
            >
              SIGN IN TO BATIF VIP
            </button>

            <p className="text-center font-inter-tight text-xs text-black/60 pt-2">
              Instant access to limited drops, priority COD processing, and size fit archive.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
