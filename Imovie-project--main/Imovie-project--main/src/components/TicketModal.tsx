import React, { useRef } from 'react';
import { Booking } from '../types';
import { MovieArtwork } from './MovieArtwork';
import { X, Download, Share2, Calendar, MapPin, CheckCircle, Ticket, QrCode } from 'lucide-react';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  booking,
  onClose,
  onViewMyBookings
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close */}
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>BOOKING CONFIRMED & ISSUED</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable / Viewable Cinema Ticket Pass */}
        <div ref={ticketRef} className="p-6 bg-zinc-950 text-white flex flex-col items-center">
          
          {/* Ticket Header & Brand */}
          <div className="w-full flex items-center justify-between border-b border-dashed border-zinc-700/80 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-black">
                IM
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">
                IMOVIES CINEMA PASS
              </span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-500">REF NUMBER</div>
              <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                {booking.bookingCode}
              </div>
            </div>
          </div>

          {/* Movie artwork & details */}
          <div className="w-full flex gap-4 items-center bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 mb-4">
            <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden shadow-md">
              <MovieArtwork movie={booking.movie} variant="poster" />
            </div>

            <div className="flex-grow">
              <div className="text-[11px] font-mono text-amber-400">
                {booking.showtime.format} · {booking.movie.ageRating}
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {booking.movie.title}
              </h3>
              <div className="text-xs text-zinc-400 mt-1 line-clamp-1">
                {booking.theater.name}
              </div>
            </div>
          </div>

          {/* Key Ticket Details 2x2 Grid */}
          <div className="w-full grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs font-mono mb-4">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Date & Time</div>
              <div className="text-sm font-bold text-white mt-0.5">{booking.showtime.date}</div>
              <div className="text-amber-400 font-semibold">{booking.showtime.time}</div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Auditorium / Hall</div>
              <div className="text-sm font-bold text-white mt-0.5">{booking.showtime.hallName}</div>
              <div className="text-zinc-400">{booking.theater.city}</div>
            </div>

            <div className="col-span-2 pt-2 border-t border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">Reserved Seats ({booking.seats.length})</div>
              <div className="text-base font-black text-amber-400 mt-0.5 tracking-wider">
                {booking.seats.map(s => s.id).join('  ·  ')}
              </div>
            </div>

            {booking.snacks.length > 0 && (
              <div className="col-span-2 pt-2 border-t border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">Concessions Pick-Up</div>
                <div className="text-xs text-zinc-300 mt-0.5">
                  {booking.snacks.map(s => `${s.quantity}x ${s.item.name}`).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Barcode & Scannable QR Code */}
          <div className="w-full flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-zinc-950 shadow-inner">
            <div className="flex items-center justify-center gap-4">
              <QrCode className="w-20 h-20 text-zinc-900" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-600 uppercase">
                  Scan at Usher Gate
                </span>
                <span className="text-sm font-mono font-black text-zinc-950 mt-1">
                  {booking.bookingCode}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  Guest: {booking.customerName}
                </span>
              </div>
            </div>

            {/* Realistic stylized barcode stripes */}
            <div className="w-full h-8 mt-3 flex items-center justify-between px-2 overflow-hidden opacity-85">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 3, 1, 2].map((w, idx) => (
                <div
                  key={idx}
                  className="bg-black h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewMyBookings();
            }}
            className="flex-1 py-2.5 px-4 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Ticket className="w-4 h-4" />
            <span>View in My Tickets</span>
          </button>
        </div>

      </div>
    </div>
  );
};
