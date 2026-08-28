import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { BatifLogo } from './BatifLogo';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenContact, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    onShowToast('Thank you for subscribing to BATIF.');
    setTimeout(() => { setEmail(''); setSubscribed(false); }, 4000);
  };

  return (
    <footer className="w-full px-3 sm:px-5 lg:px-6 pt-8 pb-6 max-w-[1878px] mx-auto">
      <div className="w-full border border-black bg-white">
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left: logo + newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-between items-start">
            <BatifLogo className="h-[24px] sm:h-[28px] md:h-[32px] lg:h-[36px] w-auto max-w-[160px] select-none" />
            <div className="mt-8">
              <h4 className="font-inter-tight text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-black mb-2">
                Join Our Newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-0 max-w-[320px]">
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 h-[34px] bg-white border border-black px-3 font-inter-tight text-xs text-black placeholder:text-black/30 focus:outline-hidden"
                />
                <button type="submit"
                  className="h-[34px] px-4 bg-black text-white font-inter-tight text-[10px] uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors cursor-pointer border border-black shrink-0">
                  {subscribed ? 'Joined' : 'Submit'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-4 lg:gap-6 xl:gap-10">
            <div>
              <h4 className="font-inter-tight text-[10px] uppercase tracking-[0.18em] text-black/40 mb-3">Shop</h4>
              <ul className="space-y-2">
                {['T-Shirts', 'Essentials', 'Men', 'New Arrivals'].map(i => (
                  <li key={i}>
                    <span className="font-inter-tight text-xs text-black/60 hover:text-black transition-colors cursor-pointer">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-inter-tight text-[10px] uppercase tracking-[0.18em] text-black/40 mb-3">About</h4>
              <ul className="space-y-2">
                <li><span onClick={onOpenAbout} className="font-inter-tight text-xs text-black/60 hover:text-black transition-colors cursor-pointer">Our Story</span></li>
                <li><span onClick={onOpenAbout} className="font-inter-tight text-xs text-black/60 hover:text-black transition-colors cursor-pointer">Founder</span></li>
                <li><span onClick={onOpenContact} className="font-inter-tight text-xs text-black/60 hover:text-black transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-inter-tight text-[10px] uppercase tracking-[0.18em] text-black/40 mb-3">Follow</h4>
              <a href="https://instagram.com/batif.store" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors">
                <Globe className="w-4 h-4 stroke-[1.75]" />
                <span className="font-inter-tight text-xs">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black px-3 sm:px-5 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-inter-tight text-[10px] sm:text-[11px] text-black/50 uppercase tracking-[0.15em]">
            &copy; 2026 Batif Store
          </p>
          <p className="font-inter-tight text-[10px] sm:text-[11px] text-black/50 uppercase tracking-[0.15em]">
            Morocco / MAD
          </p>
        </div>
      </div>
    </footer>
  );
};
