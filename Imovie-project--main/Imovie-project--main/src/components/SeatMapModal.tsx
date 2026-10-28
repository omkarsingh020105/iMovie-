import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Theater, Showtime, Seat } from '../types';
import { generateSeatLayout } from '../services/storageService';
import { X, ArrowLeft, Clock, ShieldCheck, Armchair, ChevronRight, Check } from 'lucide-react';

interface SeatMapModalProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  onBack: () => void;
  onClose: () => void;
  onProceedToSnacks: (selectedSeats: Seat[]) => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  movie,
  theater,
  showtime,
  onBack,
  onClose,
  onProceedToSnacks
}) => {
  // Load seats for this showtime
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(480); // 8 minutes countdown

  useEffect(() => {
    const initialSeats = generateSeatLayout(showtime.id, showtime.basePrice);
    setSeats(initialSeats);
  }, [showtime.id, showtime.basePrice]);

  // Reservation countdown timer
  useEffect(() => {
    if (selectedSeatIds.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedSeatIds.length]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSeats = useMemo(() => {
    return seats.filter(s => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const seatTotal = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'reserved') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('Maximum 8 seats per booking allowed.');
        return;
      }
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  // Group seats by rows
  const seatRows = useMemo(() => {
    const map = new Map<string, Seat[]>();
    seats.forEach(s => {
      if (!map.has(s.row)) {
        map.set(s.row, []);
      }
      map.get(s.row)!.push(s);
    });
    return Array.from(map.entries());
  }, [seats]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Back to Showtimes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Step 2 of 4 · Select Seats
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{movie.title}</span>
                <span className="text-xs font-mono text-zinc-400 font-normal">
                  ({showtime.format} · {showtime.hallName})
                </span>
              </h2>
              <div className="text-xs text-zinc-400 font-mono">
                {theater.name} · <span className="text-white font-semibold">{showtime.time}</span> · {showtime.date}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedSeatIds.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Reserved: </span>
                <span className="font-bold tabular-nums">{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seat Map Canvas Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-grow flex flex-col items-center justify-start bg-zinc-950/50">
          
          {/* Cinema Screen Indicator */}
          <div className="w-full max-w-2xl flex flex-col items-center mb-8">
            <div className="relative w-full h-8 flex items-center justify-center">
              <div 
                className="w-full h-2 rounded-t-full bg-gradient-to-r from-cyan-500/30 via-amber-400/80 to-cyan-500/30 shadow-[0_4px_24px_rgba(245,158,11,0.35)]"
              />
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
              Curved Panoramic Cinema Screen
            </div>
          </div>

          {/* Seat Grid */}
          <div className="w-full max-w-3xl overflow-x-auto pb-4">
            <div className="min-w-[620px] flex flex-col gap-2.5 items-center">
              {seatRows.map(([rowName, rowSeats]) => {
                const tier = rowSeats[0]?.tier || 'standard';
                return (
                  <div key={rowName} className="flex items-center gap-3">
                    {/* Row letter left */}
                    <span className="w-5 text-center text-xs font-mono font-bold text-zinc-500">
                      {rowName}
                    </span>

                    {/* Left Block (Seats 1-3) */}
                    <div className="flex items-center gap-1.5">
                      {rowSeats.slice(0, 3).map(seat => renderSeatButton(seat))}
                    </div>

                    {/* Aisle */}
                    <div className="w-5" />

                    {/* Center Block (Seats 4-9) */}
                    <div className="flex items-center gap-1.5">
                      {rowSeats.slice(3, 9).map(seat => renderSeatButton(seat))}
                    </div>

                    {/* Aisle */}
                    <div className="w-5" />

                    {/* Right Block (Seats 10-12) */}
                    <div className="flex items-center gap-1.5">
                      {rowSeats.slice(9, 12).map(seat => renderSeatButton(seat))}
                    </div>

                    {/* Row letter right */}
                    <span className="w-5 text-center text-xs font-mono font-bold text-zinc-500">
                      {rowName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Tier Legend */}
          <div className="mt-8 pt-4 border-t border-zinc-800/80 w-full max-w-2xl flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-400 text-zinc-950 font-bold flex items-center justify-center text-[9px] shadow-sm shadow-amber-400/40">
                ✓
              </div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-zinc-800/40 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px]">
                ✕
              </div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-950/60 border border-indigo-500/50" />
              <span>VIP Recliner (${(showtime.basePrice + 8.5).toFixed(2)})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-950/60 border border-cyan-500/50" />
              <span>Premium Lounge (${(showtime.basePrice + 4).toFixed(2)})</span>
            </div>
          </div>

        </div>

        {/* Bottom Booking Summary Bar */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="text-xs font-mono">
              <div className="text-zinc-400">Selected Seats ({selectedSeats.length}):</div>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSeats.map(s => (
                    <span 
                      key={s.id} 
                      className="px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/40 text-amber-300 font-bold text-xs"
                    >
                      {s.id} (${s.price.toFixed(2)})
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 italic mt-0.5">Please tap available seats on map to reserve</div>
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div className="sm:border-l sm:border-zinc-800 sm:pl-4">
                <div className="text-[11px] font-mono text-zinc-400 uppercase">Subtotal</div>
                <div className="text-xl font-black text-white font-mono tabular-nums">
                  ${seatTotal.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => onProceedToSnacks(selectedSeats)}
              className={`w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedSeats.length > 0
                  ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-500/20 active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Continue to Concessions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  function renderSeatButton(seat: Seat) {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isReserved = seat.status === 'reserved';

    let colorStyles = 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300';

    if (isReserved) {
      colorStyles = 'bg-zinc-900/40 border-zinc-800 text-zinc-700 cursor-not-allowed';
    } else if (isSelected) {
      colorStyles = 'bg-amber-400 border-amber-300 text-zinc-950 font-bold shadow-md shadow-amber-400/40 scale-105';
    } else if (seat.tier === 'vip_recliner') {
      colorStyles = 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-500/40 text-indigo-200';
    } else if (seat.tier === 'premium') {
      colorStyles = 'bg-cyan-950/60 hover:bg-cyan-900/80 border-cyan-500/40 text-cyan-200';
    } else if (seat.tier === 'accessible') {
      colorStyles = 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/40 text-emerald-200';
    }

    return (
      <button
        key={seat.id}
        disabled={isReserved}
        onClick={() => toggleSeat(seat)}
        title={`${seat.id} · ${seat.tier.replace('_', ' ').toUpperCase()} · $${seat.price.toFixed(2)}`}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${colorStyles}`}
      >
        {isSelected ? (
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        ) : isReserved ? (
          <span className="text-[10px]">✕</span>
        ) : (
          <span>{seat.col}</span>
        )}
      </button>
    );
  }
};
