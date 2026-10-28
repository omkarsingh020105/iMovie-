import React, { useState } from 'react';
import { Booking } from '../types';
import { cancelBooking } from '../services/storageService';
import { X, Ticket, Calendar, MapPin, QrCode, AlertCircle, CheckCircle, Ban } from 'lucide-react';

interface MyBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onRefresh: () => void;
  onSelectBookingForPass: (booking: Booking) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onRefresh,
  onSelectBookingForPass
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking? A 100% refund will be issued to your original payment method.')) {
      setCancellingId(bookingId);
      setTimeout(() => {
        cancelBooking(bookingId);
        setCancellingId(null);
        onRefresh();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                My Cinema Tickets & Bookings
              </h2>
              <div className="text-xs text-zinc-400 font-mono">
                {bookings.length} {bookings.length === 1 ? 'reservation' : 'reservations'} on file
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
          {bookings.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <Ticket className="w-12 h-12 text-zinc-600 mb-3" />
              <div className="text-base font-bold text-zinc-300">No Tickets Found</div>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                You haven't reserved any tickets yet. Explore our Now Showing lineup and book your favorite seats!
              </p>
            </div>
          ) : (
            bookings.map((b) => {
              const isCancelled = b.status === 'cancelled';
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isCancelled 
                      ? 'bg-zinc-950/40 border-zinc-800/50 opacity-60' 
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 shadow-md'
                  }`}
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-amber-400 tracking-wider">
                        {b.bookingCode}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className={isCancelled ? 'text-rose-400' : 'text-emerald-400 font-medium'}>
                        {isCancelled ? 'Cancelled (Refunded)' : 'Confirmed'}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400">{b.showtime.format}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-white">
                      {b.movie.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {b.showtime.date} at {b.showtime.time}
                      </span>
                      <span>·</span>
                      <span>{b.theater.name} ({b.showtime.hallName})</span>
                    </div>

                    <div className="text-xs font-mono text-zinc-300 pt-1">
                      <span className="text-zinc-500">Reserved Seats: </span>
                      <span className="font-bold text-amber-300">{b.seats.map(s => s.id).join(', ')}</span>
                      <span className="text-zinc-500 ml-3">Paid: </span>
                      <span className="font-bold text-white tabular-nums">${b.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => onSelectBookingForPass(b)}
                          className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>View Pass</span>
                        </button>

                        <button
                          disabled={cancellingId === b.id}
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-rose-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
                          title="Cancel ticket & refund"
                        >
                          {cancellingId === b.id ? 'Refunding...' : 'Cancel'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
