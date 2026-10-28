import React from 'react';
import { Movie } from '../types';
import { MovieArtwork } from './MovieArtwork';
import { X, Star, Clock, Calendar, Ticket, Play, UserCheck, CheckCircle2 } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onBookTickets,
  onWatchTrailer
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header backdrop area */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          <MovieArtwork movie={movie} variant="backdrop" className="w-full h-full" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/70 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Bottom gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 -mt-16 relative z-10">
          
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Small poster preview */}
            <div className="hidden sm:block w-36 shrink-0 shadow-xl rounded-xl overflow-hidden">
              <MovieArtwork movie={movie} variant="poster" />
            </div>

            {/* Info details */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                <span className="text-zinc-200 font-bold border border-zinc-700 px-1.5 py-0.5 rounded text-[11px]">
                  {movie.ageRating}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.durationMinutes} mins
                </span>
                <span aria-hidden="true">·</span>
                <span>{movie.genres.join(', ')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>

              <p className="text-sm text-amber-300/90 font-medium italic mt-1">
                "{movie.tagline}"
              </p>

              {/* Ratings strip */}
              <div className="flex items-center gap-6 mt-4 py-3 border-y border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold text-sm tabular-nums">{movie.imdbRating}</span>
                  <span className="text-zinc-500">IMDb</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm tabular-nums">{movie.criticScore}%</span>
                  <span className="text-zinc-500">Rotten Tomatoes</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div className="text-zinc-400">
                  <span className="text-zinc-500">Audio:</span> {movie.language}
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mt-6">
            <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
              Synopsis
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase">Director</div>
              <div className="text-sm font-semibold text-white mt-0.5">{movie.director}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase">Release Date</div>
              <div className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Cast list */}
          <div className="mt-6">
            <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-3">
              Principal Cast
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {movie.cast.map((actor, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800">
                  <div className="text-xs font-semibold text-zinc-200 line-clamp-1">{actor.name}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{actor.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formats banner */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">Supported Formats:</span>
            {movie.formats.map((fmt, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-medium">
                {fmt}
              </span>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onWatchTrailer(movie);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBookTickets(movie);
              }}
              className="px-6 py-2.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Showtime & Book Seats</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
