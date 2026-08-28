import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Globe } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast('Message transmitted to BATIF atelier team.');
  };

  return (
    <div className="w-full min-h-screen bg-white text-black font-inter-tight">
      
      {/* 1. Header */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pt-10 sm:pt-16 pb-6">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-black/50 font-normal mb-3">
          CLIENT CONCIERGE & ATELIER
        </p>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-tight text-black leading-tight">
          GET IN TOUCH
        </h1>
      </div>

      {/* 2. Contact Form & Info */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="space-y-2 mb-8">
              <span className="text-xs font-normal uppercase tracking-widest text-black/60 bg-neutral-100 px-3 py-1 inline-block">
                SEND A MESSAGE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-tight text-black">
                ATELIER INQUIRY FORM
              </h2>
            </div>

            {submitted ? (
              <div className="border border-black p-10 sm:p-14 text-center bg-neutral-50">
                <CheckCircle2 className="w-14 h-14 text-black mx-auto mb-4" />
                <h3 className="font-inter-tight font-normal text-2xl uppercase tracking-wider mb-2">
                  MESSAGE RECEIVED
                </h3>
                <p className="font-inter-tight text-sm text-black/70">
                  An advisor will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-3 bg-black text-white text-xs uppercase tracking-wider font-normal hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-normal uppercase mb-1.5">Your Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full border border-black p-3 text-sm focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal uppercase mb-1.5">Your Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full border border-black p-3 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase mb-1.5">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-black p-3 text-sm bg-white focus:outline-hidden"
                  >
                    <option value="Product Sizing & Fit">Product Sizing & Fit</option>
                    <option value="Morocco Order & Delivery">Morocco Order & Delivery (Cash on Delivery)</option>
                    <option value="Artisanal Collaboration">Artisanal Collaboration</option>
                    <option value="Press & Stockist">Press & Stockist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today?"
                    className="w-full border border-black p-3 text-sm focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-normal text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>SEND INQUIRY</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2 mb-8">
              <span className="text-xs font-normal uppercase tracking-widest text-black/60 bg-neutral-100 px-3 py-1 inline-block">
                REACH US
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal uppercase tracking-tight text-black">
                ATELIER CONTACT
              </h2>
            </div>

            <div className="border border-black p-6 bg-neutral-50 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-normal uppercase tracking-wider mb-1">ATELIER LOCATION</h4>
                  <p className="text-sm text-black/70">Casablanca & Marrakech, Morocco</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-normal uppercase tracking-wider mb-1">PHONE</h4>
                  <p className="text-sm text-black/70">+212 522-890123</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-normal uppercase tracking-wider mb-1">EMAIL</h4>
                  <p className="text-sm text-black/70">concierge@batif.store</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-normal uppercase tracking-wider mb-1">RESPONSE TIME</h4>
                  <p className="text-sm text-black/70">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="border border-black p-6">
              <h4 className="text-sm font-normal uppercase tracking-wider mb-3">ATELIER HOURS</h4>
              <div className="space-y-2 text-sm text-black/70">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom CTA */}
      <div className="max-w-[1878px] mx-auto px-3 sm:px-5 lg:px-6 pb-16">
        <div className="bg-black text-white p-8 sm:p-12 lg:p-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-normal uppercase tracking-wider">
              VISIT OUR COLLECTION
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal">
              Explore our latest drops of heavyweight tees, knitted polos, and structured outerwear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
