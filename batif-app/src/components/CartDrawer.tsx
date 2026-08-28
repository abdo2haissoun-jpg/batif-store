import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { CartItem } from '@/types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (details: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    postalCode?: string;
    note?: string;
  }) => Promise<{ orderNumber: string } | null>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'cod_form' | 'confirmed' | 'loading'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Casablanca');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPostal, setCustomerPostal] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('loading');

    const result = await onCheckout({
      customerName,
      phone: customerPhone,
      city: customerCity,
      address: customerAddress,
      postalCode: customerPostal,
      note: customerNote,
    });

    if (result) {
      setOrderNumber(result.orderNumber);
      setCheckoutStep('confirmed');
      setTimeout(() => {
        setCheckoutStep('cart');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');
        setCustomerPostal('');
        setCustomerNote('');
      }, 5000);
    } else {
      setCheckoutStep('cod_form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-batif text-2xl tracking-wider text-black">BATIF</span>
              <span className="font-inter-tight font-normal text-sm uppercase tracking-widest text-black/60">
                / SHOPPING BAG ({items.reduce((a, b) => a + b.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity text-black cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutStep === 'loading' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
                <h3 className="font-inter-tight font-normal text-lg uppercase tracking-tight text-black">
                  PLACING YOUR ORDER...
                </h3>
                <p className="font-inter-tight text-sm text-black/60 mt-2">
                  Just a moment while we confirm your COD order.
                </p>
              </div>
            ) : checkoutStep === 'confirmed' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4 animate-bounce" />
                <h3 className="font-inter-tight font-normal text-2xl uppercase tracking-tight text-black">
                  ORDER CONFIRMED
                </h3>
                <p className="font-inter-tight font-normal text-lg text-black mt-2">
                  #{orderNumber}
                </p>
                <p className="font-inter-tight text-sm text-black/70 mt-3 max-w-xs">
                  Thank you, {customerName}. Your order has been received and is being prepared.
                </p>
                <div className="mt-6 p-4 bg-neutral-100 border border-black/10 text-xs font-inter-tight text-black/80 text-left w-full space-y-1">
                  <p><span className="uppercase text-black/50">Payment:</span> Cash on Delivery</p>
                  <p><span className="uppercase text-black/50">City:</span> {customerCity}</p>
                  <p><span className="uppercase text-black/50">Estimated delivery:</span> 2-4 business days</p>
                </div>
              </div>
            ) : checkoutStep === 'cod_form' ? (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/20">
                  <h4 className="font-inter-tight font-normal text-sm uppercase tracking-wider">
                    CASH ON DELIVERY
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs font-inter-tight underline text-black/60 hover:text-black"
                  >
                    Back to bag
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Youssef Bennani"
                    className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+212 6XX-XXXXXX"
                    className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    City *
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full border border-black p-2.5 font-inter-tight text-sm bg-white focus:outline-hidden"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Fes">Fes</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Street, Building, Apartment number..."
                    className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={customerPostal}
                    onChange={(e) => setCustomerPostal(e.target.value)}
                    placeholder="e.g. 20000"
                    className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase font-inter-tight mb-1">
                    Delivery Note
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Any special instructions..."
                    className="w-full border border-black/30 p-2.5 font-inter-tight text-sm focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-neutral-800 text-white font-inter-tight font-normal text-sm uppercase tracking-wider py-3.5 transition-colors cursor-pointer"
                  >
                    CONFIRM ORDER — {subtotal.toFixed(2)} MAD (COD)
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-black/60 font-inter-tight">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cash on Delivery • Free shipping across Morocco</span>
                </div>
              </form>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <span className="font-batif text-4xl text-black/30 mb-2">BATIF</span>
                <p className="font-inter-tight text-base font-medium text-black">Your bag is empty.</p>
                <p className="font-inter-tight text-xs text-black/60 mt-1">Discover our modern minimal essentials.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 pb-4 border-b border-black/10"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover bg-neutral-100 shrink-0 border border-black/10"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-inter-tight font-normal text-sm text-black">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-black/40 hover:text-red-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-inter-tight text-xs text-black/60 mt-0.5">
                          Size: {item.selectedSize} • Color: {item.selectedColor}
                        </p>
                        <p className="font-inter-tight font-normal text-sm text-black mt-1">
                          {item.product.price.toFixed(2)} MAD
                        </p>
                      </div>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-black/30">
                          <button
                            onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 hover:bg-neutral-100 text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-inter-tight text-xs font-normal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-neutral-100 text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && checkoutStep === 'cart' && (
            <div className="p-6 border-t border-black/20 bg-neutral-50">
              <div className="flex justify-between items-center mb-2 font-inter-tight text-sm">
                <span className="text-black/70">Subtotal</span>
                <span className="font-normal text-black">{subtotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between items-center mb-4 font-inter-tight text-xs text-black/70">
                <span>Shipping in Morocco</span>
                <span className="text-emerald-700 font-normal uppercase">FREE (2-5 DAYS)</span>
              </div>

              <button
                onClick={() => setCheckoutStep('cod_form')}
                className="w-full bg-black hover:bg-neutral-800 text-white font-inter-tight font-normal text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>PROCEED TO CASH ON DELIVERY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-black/60 font-inter-tight">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspected & verified garments • Cash on Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
