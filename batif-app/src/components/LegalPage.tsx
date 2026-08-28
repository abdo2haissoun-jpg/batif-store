import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { LegalTab } from '@/types/store';

interface LegalPageProps {
  initialTab?: LegalTab;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onShowToast: (msg: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  initialTab = 'TERMS',
  onNavigateHome,
  onNavigateShop,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Interactive Cookie Preferences State
  const [cookieConsent, setCookieConsent] = useState({
    necessary: true, // Always true
    analytics: true,
    functional: true,
    marketing: false,
  });
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  useEffect(() => {
    const stored = localStorage.getItem('batif_cookie_preferences');
    if (stored) {
      try {
        setCookieConsent(JSON.parse(stored));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('batif_cookie_preferences', JSON.stringify(cookieConsent));
    setSavedStatus(true);
    onShowToast('Cookie preferences updated and saved.');
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setCookieConsent(allEnabled);
    localStorage.setItem('batif_cookie_preferences', JSON.stringify(allEnabled));
    setSavedStatus(true);
    onShowToast('All cookie preferences accepted.');
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleRejectNonEssential = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setCookieConsent(minimal);
    localStorage.setItem('batif_cookie_preferences', JSON.stringify(minimal));
    setSavedStatus(true);
    onShowToast('Non-essential cookies disabled.');
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black font-inter-tight">
      {/* Top Breadcrumb */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 py-4">
        <div className="border border-black/15 bg-neutral-50 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2 text-black/70">
            <button onClick={onNavigateHome} className="hover:text-black transition-colors cursor-pointer">
              HOME
            </button>
            <ChevronRight className="w-3 h-3 text-black/40" />
            <span className="text-black font-normal">LEGAL & COMPLIANCE</span>
            <ChevronRight className="w-3 h-3 text-black/40" />
            <span className="text-black font-normal">{activeTab.replace('_', ' ')}</span>
          </div>

          <button
            onClick={onNavigateShop}
            className="flex items-center gap-1.5 text-black hover:opacity-60 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO SHOP</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pb-20 pt-2">
        <div className="bg-white">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-10 lg:p-12 border-b border-black bg-neutral-50">
            <span className="text-xs uppercase tracking-widest text-black/60 font-normal">
              BATIF STORE • CASABLANCA ATELIER
            </span>
            <h1 className="text-2xl sm:text-4xl font-normal uppercase tracking-tight text-black mt-2">
              TERMS, PRIVACY & COMPLIANCE POLICIES
            </h1>
            <p className="text-xs sm:text-sm text-black/70 mt-2 max-w-3xl leading-relaxed">
              We believe in total transparency. Review our detailed terms of service, customer privacy standards, Cash on Delivery protocols, and cookie controls.
            </p>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex flex-wrap border-b border-black bg-white">
            <button
              onClick={() => setActiveTab('TERMS')}
              className={`flex-1 min-w-[200px] py-3.5 px-4 text-xs font-normal uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border-r border-black/10 last:border-r-0 ${
                activeTab === 'TERMS'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>TERMS & CONDITIONS</span>
            </button>

            <button
              onClick={() => setActiveTab('PRIVACY')}
              className={`flex-1 min-w-[200px] py-3.5 px-4 text-xs font-normal uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border-r border-black/10 last:border-r-0 ${
                activeTab === 'PRIVACY'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>PRIVACY POLICY</span>
            </button>

            <button
              onClick={() => setActiveTab('COOKIE_POLICY')}
              className={`flex-1 min-w-[200px] py-3.5 px-4 text-xs font-normal uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border-r border-black/10 last:border-r-0 ${
                activeTab === 'COOKIE_POLICY'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <Cookie className="w-4 h-4" />
              <span>COOKIE POLICY</span>
            </button>

            <button
              onClick={() => setActiveTab('COOKIE_PREFERENCES')}
              className={`flex-1 min-w-[200px] py-3.5 px-4 text-xs font-normal uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'COOKIE_PREFERENCES'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>COOKIE PREFERENCES</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-10 lg:p-12">
            
            {/* 1. TERMS & CONDITIONS */}
            {activeTab === 'TERMS' && (
              <div className="space-y-8 max-w-4xl text-black/85 leading-relaxed text-sm sm:text-base">
                <div className="border-b border-black pb-4">
                  <h2 className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-black">
                    TERMS & CONDITIONS OF SERVICE
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-black/50 mt-1">
                    LAST UPDATED: 2026 • BATIF STORE (CASABLANCA, MOROCCO)
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    1. INTRODUCTION & IDENTITY
                  </h3>
                  <p>
                    Welcome to <strong>BATIF STORE</strong> (accessible via batif.store or authorized digital flagships). These Terms & Conditions govern your access to and purchases made through BATIF, founded by <strong>Abdelatif Haissoun</strong>, operated from Casablanca, Kingdom of Morocco. By browsing our catalog or placing an order, you agree unconditionally to these terms.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    2. PRODUCT SPECIFICATIONS & ARTISANAL CRAFT
                  </h3>
                  <p>
                    All BATIF garments are created with heavyweight architectural textiles (including our signature 280+ GSM combed organic cottons and micro-ripstops). Because our collections are produced in limited batches with custom dye and wash treatments, slight natural textural variations reflect authentic artisanal craftsmanship.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    3. ORDERING & CASH ON DELIVERY (COD) PROTOCOLS
                  </h3>
                  <p>
                    To ensure the highest level of security and peace of mind across Morocco, BATIF provides <strong>Cash on Delivery (Paiement à la Livraison)</strong>. When an order is placed:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>Our fulfillment team validates order coordinates and contacts you via WhatsApp or phone call prior to dispatch.</li>
                    <li>Delivery is executed nationwide within 2 to 5 business days via our verified courier partners.</li>
                    <li>Payment is rendered directly to the courier agent in cash upon receipt. You have the right to inspect the external parcel integrity before completing payment.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    4. PRICING & CURRENCY
                  </h3>
                  <p>
                    All prices displayed are in Moroccan Dirhams (MAD) and include all applicable local taxes. BATIF reserves the right to adjust prices or launch promotional editions at its sole discretion without retroactive obligation.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    5. 14-DAY EXCHANGES & RETURNS
                  </h3>
                  <p>
                    We offer a 14-day exchange and return policy for all standard pieces. Garments must be in pristine, unworn, unwashed condition with all original tags, labels, and packaging intact. For size exchanges, contact our Casablanca Atelier customer concierge.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    6. INTELLECTUAL PROPERTY
                  </h3>
                  <p>
                    All logos, product patterns, photography, campaign assets, typography, and the "Made by abdelatif haissoun" trademark are the exclusive intellectual property of BATIF. Unauthorized reproduction is strictly prohibited.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    7. GOVERNING LAW
                  </h3>
                  <p>
                    These terms are governed by and construed in accordance with the laws of the Kingdom of Morocco. Any dispute shall be subject to the exclusive jurisdiction of the competent courts of Casablanca.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PRIVACY POLICY */}
            {activeTab === 'PRIVACY' && (
              <div className="space-y-8 max-w-4xl text-black/85 leading-relaxed text-sm sm:text-base">
                <div className="border-b border-black pb-4">
                  <h2 className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-black">
                    PRIVACY & DATA PROTECTION POLICY
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-black/50 mt-1">
                    COMPLIANCE WITH LAW 09-08 • ZERO THIRD-PARTY SALE GUARANTEE
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    1. OUR PRIVACY COMMITMENT
                  </h3>
                  <p>
                    At BATIF, we hold privacy to the same exacting standards as our garments: clean, structured, and free of unnecessary noise. We collect only the information necessary to fulfill your orders, coordinate courier delivery across Morocco, and provide personalized concierge support.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    2. INFORMATION WE COLLECT
                  </h3>
                  <p>When interacting with BATIF, we may collect:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li><strong>Contact Details:</strong> Full name, telephone number, and email address.</li>
                    <li><strong>Delivery Address:</strong> Street address, city, and postal landmarks for our courier agents.</li>
                    <li><strong>Preferences:</strong> Wishlist favorites, size selections, and shopping bag state.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    3. HOW WE USE YOUR DATA
                  </h3>
                  <p>
                    Your data is strictly utilized to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Process, pack, and ship your Cash on Delivery orders.</li>
                    <li>Dispatch SMS/WhatsApp tracking updates and delivery coordination calls.</li>
                    <li>Notify you of limited edition drops and archive releases if you have subscribed.</li>
                  </ul>
                  <p className="pt-1 font-normal text-black">
                    We will <strong>never sell, lease, or monetize</strong> your personal data with third-party advertisers or data brokers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    4. SECURITY MEASURES
                  </h3>
                  <p>
                    All transmissions on our website are encrypted using industry-standard SSL/TLS protocols. Because we utilize Cash on Delivery, your sensitive financial card details are never stored or exposed on our servers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    5. YOUR RIGHTS (CNDP & MOROCCAN LAW 09-08)
                  </h3>
                  <p>
                    In accordance with Moroccan Law No. 09-08 regarding the protection of individuals with respect to the processing of personal data, you possess the right to access, rectify, oppose, or delete your personal information at any time by contacting our team at <strong>contact@batif.store</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* 3. COOKIE POLICY */}
            {activeTab === 'COOKIE_POLICY' && (
              <div className="space-y-8 max-w-4xl text-black/85 leading-relaxed text-sm sm:text-base">
                <div className="border-b border-black pb-4">
                  <h2 className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-black">
                    COOKIE & TRACKING POLICY
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-black/50 mt-1">
                    TRANSPARENT LOCAL STORAGE & SESSION MECHANISMS
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    1. WHAT ARE COOKIES?
                  </h3>
                  <p>
                    Cookies and local storage tokens are small text files placed on your device to ensure optimal performance, keep items in your shopping bag, save your wishlist, and remember your display preferences.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    2. TYPES OF COOKIES USED BY BATIF
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-normal uppercase text-xs tracking-wider text-black mb-1">
                        A. STRICTLY NECESSARY
                      </h4>
                      <p className="text-xs text-black/70">
                        Essential for core navigation, maintaining bag items during checkout, and security tokens. These cannot be disabled.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-normal uppercase text-xs tracking-wider text-black mb-1">
                        B. FUNCTIONAL & PREFERENCES
                      </h4>
                      <p className="text-xs text-black/70">
                        Remembers your selected size filters, preferred currency, and wishlist bookmarks between visits.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-normal uppercase text-xs tracking-wider text-black mb-1">
                        C. PERFORMANCE & ANALYTICS
                      </h4>
                      <p className="text-xs text-black/70">
                        Anonymized traffic metrics that help us evaluate page load speeds, catalog popularity, and user flow improvements.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-normal uppercase text-xs tracking-wider text-black mb-1">
                        D. CURATED MARKETING
                      </h4>
                      <p className="text-xs text-black/70">
                        Allows us to showcase relevant drops and limited editions on social channels based on your interests.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-normal uppercase tracking-wider text-black">
                    3. MANAGING YOUR CHOICES
                  </h3>
                  <p>
                    You can modify your preferences at any time by navigating to our dedicated <strong>Cookie Preferences</strong> tab or by adjusting your browser cookie settings.
                  </p>
                  <button
                    onClick={() => setActiveTab('COOKIE_PREFERENCES')}
                    className="mt-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-normal hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    OPEN COOKIE PREFERENCES PANEL →
                  </button>
                </div>
              </div>
            )}

            {/* 4. COOKIE PREFERENCES (INTERACTIVE MANAGER) */}
            {activeTab === 'COOKIE_PREFERENCES' && (
              <div className="space-y-8 max-w-4xl">
                <div className="border-b border-black pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-black">
                        COOKIE PREFERENCES DASHBOARD
                      </h2>
                      <p className="text-xs uppercase tracking-widest text-black/50 mt-1">
                        CUSTOMIZE YOUR PRIVACY AND TRACKING SETTINGS
                      </p>
                    </div>
                    {savedStatus && (
                      <span className="inline-flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1 uppercase font-normal tracking-wider animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PREFERENCES SAVED</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-black/80 leading-relaxed font-normal">
                  Customize which cookies and data tokens you allow BATIF Store to use during your browsing experience. Strictly necessary cookies are required for shopping bag and checkout functions.
                </p>

                {/* Toggles Container */}
                <div className="space-y-4 pt-2">
                  {/* Necessary */}
                  <div className="p-4 sm:p-6 bg-neutral-50 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-normal uppercase tracking-wider text-black">
                          STRICTLY NECESSARY COOKIES
                        </h4>
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                          ALWAYS ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-black/70 leading-relaxed">
                        Required for core e-commerce capabilities: keeping items in your bag, wishlist synchronisation, and security token authorization.
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="w-5 h-5 accent-black cursor-not-allowed opacity-70"
                      />
                    </div>
                  </div>

                  {/* Performance & Analytics */}
                  <div className="p-4 sm:p-6 bg-white flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-normal uppercase tracking-wider text-black">
                        PERFORMANCE & ANALYTICS COOKIES
                      </h4>
                      <p className="text-xs text-black/70 leading-relaxed">
                        Enables aggregated, anonymized metric collection to measure site performance, image rendering speeds, and customer discovery flows.
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.analytics}
                          onChange={(e) =>
                            setCookieConsent({ ...cookieConsent, analytics: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-hidden peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="p-4 sm:p-6 bg-white flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-normal uppercase tracking-wider text-black">
                        FUNCTIONAL & PERSISTENT PREFERENCES
                      </h4>
                      <p className="text-xs text-black/70 leading-relaxed">
                        Allows BATIF to remember your selected product filters, previously viewed sizes, and curated catalog sorting between sessions.
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.functional}
                          onChange={(e) =>
                            setCookieConsent({ ...cookieConsent, functional: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-hidden peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="p-4 sm:p-6 bg-white flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-normal uppercase tracking-wider text-black">
                        MARKETING & PERSONALIZED DROPS
                      </h4>
                      <p className="text-xs text-black/70 leading-relaxed">
                        Enables tailored drop notifications, new capsule lookbooks, and invitation-only archive sale access.
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.marketing}
                          onChange={(e) =>
                            setCookieConsent({ ...cookieConsent, marketing: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-hidden peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="pt-6 border-t border-black flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={handleRejectNonEssential}
                    className="px-5 py-2.5 border border-black/20 text-xs font-normal uppercase tracking-wider text-black transition-colors cursor-pointer"
                  >
                    REJECT NON-ESSENTIAL
                  </button>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-xs font-normal uppercase tracking-wider text-black transition-colors cursor-pointer"
                    >
                      ACCEPT ALL
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-6 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-normal uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      SAVE PREFERENCES
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
