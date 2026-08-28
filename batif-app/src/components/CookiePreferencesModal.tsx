import React, { useState, useEffect } from 'react';
import { X, Cookie, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BatifLogo } from './BatifLogo';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [cookieConsent, setCookieConsent] = useState({
    necessary: true,
    analytics: true,
    functional: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('batif_cookie_preferences');
    if (stored) {
      try {
        setCookieConsent(JSON.parse(stored));
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('batif_cookie_preferences', JSON.stringify(cookieConsent));
    setSaved(true);
    onShowToast('Cookie preferences successfully saved.');
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, functional: true, marketing: true };
    setCookieConsent(all);
    localStorage.setItem('batif_cookie_preferences', JSON.stringify(all));
    onShowToast('All cookie categories accepted.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200 font-inter-tight">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Cookie className="w-5 h-5 text-black" />
          <h3 className="text-base sm:text-lg font-normal uppercase tracking-wider text-black">
            BATIF COOKIE PREFERENCES
          </h3>
        </div>
        <p className="text-xs text-black/70 leading-relaxed mb-6">
          We use strictly necessary cookies to keep items in your shopping bag and process your orders. You can customize your analytical and marketing preferences below.
        </p>

        <div className="space-y-3.5">
          {/* Necessary */}
          <div className="p-3.5 border border-black/20 bg-neutral-50 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-normal text-black">Strictly Necessary Cookies</p>
              <p className="text-[11px] text-black/60">Cart, wishlist & session security.</p>
            </div>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase">Required</span>
          </div>

          {/* Analytics */}
          <div className="p-3.5 border border-black/20 bg-white flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-normal text-black">Performance & Analytics</p>
              <p className="text-[11px] text-black/60">Anonymous catalog discovery telemetry.</p>
            </div>
            <input
              type="checkbox"
              checked={cookieConsent.analytics}
              onChange={(e) => setCookieConsent({ ...cookieConsent, analytics: e.target.checked })}
              className="w-4 h-4 accent-black cursor-pointer"
            />
          </div>

          {/* Functional */}
          <div className="p-3.5 border border-black/20 bg-white flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-normal text-black">Functional & Preferences</p>
              <p className="text-[11px] text-black/60">Remembers your filters and sizing.</p>
            </div>
            <input
              type="checkbox"
              checked={cookieConsent.functional}
              onChange={(e) => setCookieConsent({ ...cookieConsent, functional: e.target.checked })}
              className="w-4 h-4 accent-black cursor-pointer"
            />
          </div>

          {/* Marketing */}
          <div className="p-3.5 border border-black/20 bg-white flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-normal text-black">Marketing & Tailored Drops</p>
              <p className="text-[11px] text-black/60">Curated capsule invitations.</p>
            </div>
            <input
              type="checkbox"
              checked={cookieConsent.marketing}
              onChange={(e) => setCookieConsent({ ...cookieConsent, marketing: e.target.checked })}
              className="w-4 h-4 accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 mt-6 border-t border-black flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-black/30 text-xs font-normal uppercase text-black hover:border-black transition-colors cursor-pointer"
          >
            CANCEL
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 border border-black text-xs font-normal uppercase text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              ACCEPT ALL
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-black text-white text-xs font-normal uppercase hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
            >
              {saved ? 'SAVED ✓' : 'SAVE PREFERENCES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
