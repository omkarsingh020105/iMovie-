import React from 'react';
import { Movie } from '../types';
import { MovieArtwork } from './MovieArtwork';
import { Play, Calendar, Star, Volume2 } from 'lucide-react';

interface HeroSectionProps {
  movie: Movie;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  movie,
  onBookTickets,
  onWatchTrailer
}) => {
  return (
    <div className="relative w-full overflow-hidden border-b border-zinc-800 bg-zinc-950">
      {/* Background cinematic backdrop */}
      <MovieArtwork
        movie={movie}
        variant="backdrop"
        className="absolute inset-0 w-full h-full min-h-[500px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          
          {/* Metadata line with clean typographic separators (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-4 tracking-wide">
            <span className="text-amber-400 font-semibold uppercase">Theatrical Feature</span>
            <span aria-hidden="true">·</span>
            <span>{movie.durationMinutes} Minutes</span>
            <span aria-hidden="true">·</span>
            <span className="border border-zinc-700/80 px-1.5 py-0.2 rounded text-zinc-300 font-bold text-[11px]">
              {movie.ageRating}
            </span>
            <span aria-hidden="true">·</span>
            <span>{movie.genres.join(' / ')}</span>
          </div>

          {/* Headline - Balanced type scale, no orphan words */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-4 text-balance">
            {movie.title}
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-amber-200/90 font-medium italic mb-3">
            "{movie.tagline}"
          </p>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3 mb-6 max-w-xl">
            {movie.synopsis}
          </p>

          {/* Key specs row */}
          <div className="flex items-center gap-6 text-xs text-zinc-300 font-mono mb-8 py-3 border-y border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-sm tabular-nums">{movie.imdbRating}</span>
              <span className="text-zinc-500">/10 IMDb</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400 text-sm tabular-nums">{movie.criticScore}%</span>
              <span className="text-zinc-500">Critic Score</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">{movie.formats.join(' · ')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onBookTickets(movie)}
              className="px-6 py-3 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Select Showtime & Seats</span>
            </button>

            <button
              onClick={() => onWatchTrailer(movie)}
              className="px-5 py-3 text-sm font-medium text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Watch Trailer</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
