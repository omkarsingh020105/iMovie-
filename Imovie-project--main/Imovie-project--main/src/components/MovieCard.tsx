import React from 'react';
import { Movie } from '../types';
import { MovieArtwork } from './MovieArtwork';
import { Star, Clock, Ticket, Info, Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onBookTickets,
  onWatchTrailer
}) => {
  return (
    <div className="group relative flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200">
      
      {/* Poster Media Area */}
      <div className="relative cursor-pointer overflow-hidden" onClick={() => onSelectMovie(movie)}>
        <MovieArtwork movie={movie} variant="poster" />

        {/* Quick action overlay on poster hover */}
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookTickets(movie);
            }}
            className="w-full max-w-[180px] py-2.5 px-4 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie);
            }}
            className="w-full max-w-[180px] py-2 px-4 text-xs font-medium text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>Trailer</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMovie(movie);
            }}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors mt-1"
          >
            <Info className="w-3 h-3" />
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5">
            <span className="font-semibold text-zinc-300">{movie.ageRating}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{movie.durationMinutes}m</span>
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold tabular-nums">{movie.imdbRating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectMovie(movie)}
            className="text-base font-bold text-white tracking-tight leading-snug line-clamp-1 hover:text-amber-400 cursor-pointer transition-colors"
          >
            {movie.title}
          </h3>

          {/* Genres text */}
          <p className="text-xs text-zinc-400 mt-0.5 truncate">
            {movie.genres.join(' · ')}
          </p>
        </div>

        {/* Formats and Action */}
        <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-zinc-400 truncate">
            {movie.formats.slice(0, 2).join(' / ')}
          </div>

          <button
            onClick={() => onBookTickets(movie)}
            className="px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-zinc-950 bg-amber-400/10 hover:bg-amber-400 border border-amber-400/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Seats
          </button>
        </div>

      </div>

    </div>
  );
};
