import React, { useState, useMemo } from 'react';
import { Movie, Theater, Showtime } from '../types';
import { THEATERS, SCREEN_FORMAT_INFO } from '../data/theatersData';
import { getAvailableDates, generateShowtimes } from '../services/storageService';
import { MovieArtwork } from './MovieArtwork';
import { X, MapPin, Calendar, Clock, Sparkles, ChevronRight, Info } from 'lucide-react';

interface ShowtimePickerProps {
  movie: Movie;
  onClose: () => void;
  onSelectShowtime: (showtime: Showtime, theater: Theater) => void;
}

export const ShowtimePicker: React.FC<ShowtimePickerProps> = ({
  movie,
  onClose,
  onSelectShowtime
}) => {
  const dates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].dateStr);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Filter theaters
  const activeTheaters = useMemo(() => {
    if (selectedTheaterId === 'all') return THEATERS;
    return THEATERS.filter(t => t.id === selectedTheaterId);
  }, [selectedTheaterId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 bg-zinc-950/70 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
              <MovieArtwork movie={movie} variant="poster" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Step 1 of 4 · Select Date & Showtime
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {movie.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1">
                <span>{movie.durationMinutes} mins</span>
                <span aria-hidden="true">·</span>
                <span>{movie.ageRating}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.language}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector Segmented Bar */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-950/40 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto">
          <div className="text-xs font-mono text-zinc-500 uppercase mr-2 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dates:</span>
          </div>

          <div className="flex items-center gap-2">
            {dates.map((d) => {
              const isSelected = selectedDate === d.dateStr;
              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80">{d.dayName}</span>
                  <span className="text-sm font-extrabold">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls (Theater & Screen Format) */}
        <div className="px-5 sm:px-6 py-3 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono">Format:</span>
            {['all', 'IMAX 3D', 'Dolby Atmos', '4DX', 'Standard 2D'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {fmt === 'all' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono">Cinema:</span>
            <select
              value={selectedTheaterId}
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Theaters ({THEATERS.length})</option>
              {THEATERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theaters and Showtimes List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          {activeTheaters.map((theater) => {
            const allShowtimes = generateShowtimes(movie.id, theater.id, selectedDate);
            const showtimes = selectedFormat === 'all' 
              ? allShowtimes 
              : allShowtimes.filter(s => s.format === selectedFormat);

            if (showtimes.length === 0) return null;

            return (
              <div 
                key={theater.id}
                className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/90 flex flex-col gap-4"
              >
                {/* Theater header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{theater.name}</span>
                    </h3>
                    <div className="text-xs text-zinc-400 mt-0.5 ml-6">
                      {theater.address} · <span className="text-amber-400/90 font-mono">{theater.distance}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap items-center gap-1.5 ml-6 sm:ml-0 text-[11px] font-mono text-zinc-400">
                    {theater.amenities.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                  {showtimes.map((st) => {
                    const isAlmostFull = st.availableSeatsCount < 75;
                    return (
                      <button
                        key={st.id}
                        onClick={() => onSelectShowtime(st, theater)}
                        className="group relative p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 hover:border-amber-400/70 transition-all text-left flex flex-col justify-between gap-2 cursor-pointer shadow-sm hover:shadow-amber-500/10 hover:-translate-y-0.5"
                      >
                        {/* Format tag */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors">
                            {st.format}
                          </span>
                          <span className="text-zinc-500 tabular-nums">
                            ${st.basePrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Large Showtime */}
                        <div className="text-lg font-extrabold text-white font-mono tracking-tight group-hover:text-amber-300">
                          {st.time}
                        </div>

                        {/* Hall & Seat status */}
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between border-t border-zinc-800/60 pt-1.5 mt-1">
                          <span className="truncate">{st.hallName}</span>
                          <span className={isAlmostFull ? 'text-amber-400' : 'text-emerald-400'}>
                            {st.availableSeatsCount} left
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Seats are locked for 8 minutes once selected to ensure guaranteed reservations.</span>
          </div>
          <span className="font-mono text-zinc-500 hidden sm:inline">IMovies Live Booking Engine</span>
        </div>

      </div>
    </div>
  );
};
