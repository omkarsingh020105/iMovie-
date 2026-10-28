import React, { useState } from 'react';
import { Movie, Theater, Showtime, Seat, SnackOrder, Booking, User } from '../types';
import { ArrowLeft, CreditCard, ShieldCheck, Ticket, Tag, Check, Sparkles, X, Smartphone, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  seats: Seat[];
  snacks: SnackOrder[];
  currentUser: User | null;
  onBack: () => void;
  onClose: () => void;
  onCompleteBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  theater,
  showtime,
  seats,
  snacks,
  currentUser,
  onBack,
  onClose,
  onCompleteBooking
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 482-1980');
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'apple_pay' | 'points'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('492');

  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const seatSubtotal = seats.reduce((sum, s) => sum + s.price, 0);
  const snackSubtotal = snacks.reduce((sum, o) => sum + o.item.price * o.quantity, 0);
  const bookingFee = 2.50; // standard flat booking fee
  const tax = Number(((seatSubtotal + snackSubtotal) * 0.0825).toFixed(2)); // 8.25%
  
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const totalAmount = Math.max(0, seatSubtotal + snackSubtotal + bookingFee + tax - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'CINEMA50') {
      const disc = Number(((seatSubtotal + snackSubtotal) * 0.5).toFixed(2));
      setAppliedPromo({ code: 'CINEMA50 (50% OFF)', discountAmount: disc });
    } else if (code === 'IMOVIES10') {
      setAppliedPromo({ code: 'IMOVIES10 ($10 OFF)', discountAmount: 10.00 });
    } else if (code === 'WELCOME') {
      setAppliedPromo({ code: 'WELCOME ($5 OFF)', discountAmount: 5.00 });
    } else {
      setPromoError('Invalid promo code. Try: CINEMA50 or IMOVIES10');
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail) {
      alert('Please provide your name and email address for ticket delivery.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      // Generate random ticket code
      const randomCode = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingCode: randomCode,
        userId: currentUser?.id || 'guest',
        customerName,
        customerEmail,
        customerPhone,
        movie,
        theater,
        showtime,
        seats,
        snacks,
        seatSubtotal,
        snackSubtotal,
        bookingFee,
        discount,
        totalAmount,
        paymentMethod: paymentMethod === 'card' 
          ? `Card (•••• ${cardNumber.slice(-4)})` 
          : paymentMethod === 'upi' ? 'UPI Instant Pay' : 'Digital Wallet',
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        qrCodeData: `${randomCode}-${movie.id}-${showtime.id}-${seats.map(s => s.id).join('_')}`
      };

      setIsProcessing(false);
      onCompleteBooking(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              disabled={isProcessing}
              className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Step 4 of 4 · Checkout & Confirmation
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Review & Confirm Booking
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form & Summary 2-Column Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Customer details & Payment Options */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                Ticket Recipient Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Phone (SMS Ticket)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                Payment Method
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('points')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'points'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>CineClub</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Expires</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
                  <div className="font-mono text-white font-semibold mb-1">Scan QR via GooglePay / PhonePe / Paytm</div>
                  <div>Instant confirmation upon transaction approval</div>
                </div>
              )}

              {paymentMethod === 'points' && (
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                  <div className="flex items-center justify-between mb-2">
                    <span>Available CineClub Points:</span>
                    <span className="font-bold text-amber-400 font-mono">{currentUser?.cineClubPoints || 850} pts</span>
                  </div>
                  <div className="text-zinc-500 text-[11px]">Points will be redeemed at 100 pts = $10.00 discount.</div>
                </div>
              )}
            </div>

            {/* Promo Code section */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. CINEMA50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Promo applied: {appliedPromo.code} (-${appliedPromo.discountAmount.toFixed(2)})</span>
                </div>
              )}
              {promoError && (
                <div className="mt-2 text-xs text-rose-400 font-mono">
                  {promoError}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
                Order Summary
              </div>

              {/* Movie info */}
              <div className="pb-3 border-b border-zinc-800">
                <h4 className="text-base font-bold text-white leading-snug">
                  {movie.title}
                </h4>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">
                  {theater.name} · {showtime.hallName}
                </div>
                <div className="text-xs text-amber-400 font-mono mt-0.5">
                  {showtime.date} at {showtime.time} ({showtime.format})
                </div>
              </div>

              {/* Seats Breakdown */}
              <div className="py-3 border-b border-zinc-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Seats ({seats.length}): {seats.map(s => s.id).join(', ')}</span>
                  <span className="text-white tabular-nums">${seatSubtotal.toFixed(2)}</span>
                </div>

                {snacks.map(o => (
                  <div key={o.item.id} className="flex justify-between text-zinc-400">
                    <span className="truncate pr-2">{o.quantity}x {o.item.name}</span>
                    <span className="text-white tabular-nums">${(o.item.price * o.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Fees & Taxes */}
              <div className="py-3 border-b border-zinc-800 space-y-1.5 text-xs font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span>Online Convenience Fee</span>
                  <span className="tabular-nums">${bookingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="tabular-nums">${tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span className="tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-3 flex items-baseline justify-between font-mono">
                <span className="text-sm font-bold text-white uppercase">Total Amount</span>
                <span className="text-2xl font-black text-amber-400 tabular-nums">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Reservation...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Confirm Ticket (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] font-mono text-zinc-500">
                Guaranteed Instant Confirmation · 100% Secure SSL Payment
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
