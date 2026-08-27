import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Inquiry', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast('Message transmitted to BATIF atelier team.');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-2xl shadow-2xl p-6 sm:p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <span className="font-batif text-3xl tracking-wider text-black block">BATIF</span>
          <h3 className="font-inter-tight font-normal text-2xl sm:text-3xl uppercase tracking-tight text-black mt-1">
            CLIENT CONCIERGE & ATELIER
          </h3>
          <p className="font-inter-tight text-sm text-black/70 mt-1">
            Connect with our Casablanca studio regarding sizing, custom tailoring, or wholesale inquiries.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#FF3300] mx-auto mb-3" />
            <h4 className="font-inter-tight font-normal text-xl uppercase">MESSAGE RECEIVED</h4>
            <p className="font-inter-tight text-sm text-black/70 mt-1">An advisor will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-normal uppercase font-inter-tight mb-1">Your Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-normal uppercase font-inter-tight mb-1">Your Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase font-inter-tight mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-black p-2.5 font-inter-tight text-sm bg-white focus:outline-hidden"
              >
                <option value="Product Sizing & Fit">Product Sizing & Fit</option>
                <option value="Morocco Order & Delivery">Morocco Order & Delivery (Cash on Delivery)</option>
                <option value="Artisanal Collaboration">Artisanal Collaboration</option>
                <option value="Press & Stockist">Press & Stockist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase font-inter-tight mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist you today?"
                className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-inter-tight font-normal text-sm uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>SEND INQUIRY</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Contact Info Footer */}
        <div className="mt-8 pt-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-inter-tight text-black/70">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-black shrink-0" />
            <span>Casablanca & Marrakech, Morocco</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-black shrink-0" />
            <span>+212 522-890123</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-black shrink-0" />
            <span>concierge@batif.store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
