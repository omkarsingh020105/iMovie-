import React from 'react';
import { Movie } from '../types';
import { Sparkles, Film, Compass, Shield, Flame, Ghost, Clapperboard, Rocket } from 'lucide-react';

interface MovieArtworkProps {
  movie: Movie;
  variant?: 'poster' | 'backdrop' | 'banner';
  className?: string;
}

export const MovieArtwork: React.FC<MovieArtworkProps> = ({
  movie,
  variant = 'poster',
  className = ''
}) => {
  // Select distinct icon and aesthetic based on movie theme
  const getThemeDetails = () => {
    switch (movie.id) {
      case 'm1': // Astral Odyssey
        return {
          icon: <Rocket className="w-12 h-12 text-cyan-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.35), transparent 70%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50%" cy="32%" r="22%" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="50%" cy="32%" r="35%" fill="none" stroke="#818cf8" strokeWidth="1.5" />
              <line x1="10%" y1="75%" x2="90%" y2="75%" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <path d="M 30 200 Q 150 150 270 200" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.3" />
            </svg>
          )
        };
      case 'm2': // Shadow Runner
        return {
          icon: <Sparkles className="w-12 h-12 text-pink-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.35), transparent 65%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 L200,20 L400,60" stroke="#ec4899" strokeWidth="1.5" fill="none" />
              <rect x="20%" y="40%" width="60%" height="40%" fill="none" stroke="#a855f7" strokeWidth="1" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          )
        };
      case 'm3': // Solaris Realm
        return {
          icon: <Shield className="w-12 h-12 text-amber-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(249, 115, 22, 0.35), transparent 70%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <polygon points="150,40 180,120 120,120" stroke="#f97316" strokeWidth="1.5" fill="none" />
              <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#fbbf24" strokeWidth="1" />
            </svg>
          )
        };
      case 'm4': // French Patisserie Mystery
        return {
          icon: <Clapperboard className="w-12 h-12 text-emerald-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.35), transparent 65%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <rect x="15%" y="20%" width="70%" height="60%" rx="8" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="6 4" />
            </svg>
          )
        };
      case 'm5': // Velocity
        return {
          icon: <Flame className="w-12 h-12 text-rose-500 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.4), transparent 65%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="30" x2="300" y2="280" stroke="#f43f5e" strokeWidth="2" />
              <line x1="20" y1="10" x2="320" y2="260" stroke="#fb7185" strokeWidth="1" strokeDasharray="8 4" />
            </svg>
          )
        };
      case 'm6': // Lumina
        return {
          icon: <Compass className="w-12 h-12 text-indigo-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(129, 140, 248, 0.35), transparent 65%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30%" cy="30%" r="8%" fill="#818cf8" opacity="0.3" />
              <circle cx="70%" cy="40%" r="14%" fill="#c084fc" opacity="0.25" />
            </svg>
          )
        };
      case 'm8': // Haunting
        return {
          icon: <Ghost className="w-12 h-12 text-zinc-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(161, 161, 170, 0.3), transparent 65%)',
          visualOverlay: (
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 150 Q 150 50 250 150 T 350 250" fill="none" stroke="#71717a" strokeWidth="1" />
            </svg>
          )
        };
      default:
        return {
          icon: <Film className="w-12 h-12 text-amber-400 opacity-80" />,
          accentGlow: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.3), transparent 65%)',
          visualOverlay: null
        };
    }
  };

  const theme = getThemeDetails();

  if (variant === 'backdrop' || variant === 'banner') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${movie.posterColor} ${className}`}>
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: theme.accentGlow }}
        />
        {/* Subtle SVG geometry layer */}
        {theme.visualOverlay}

        {/* Film grain / texture overlay */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Vignette & bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>
    );
  }

  // Default 'poster' (3:4 aspect ratio)
  return (
    <div
      className={`relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-b ${movie.posterColor} border border-zinc-800/80 shadow-lg group-hover:border-zinc-700 transition-all flex flex-col justify-between p-5 ${className}`}
    >
      {/* Dynamic ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.accentGlow }}
      />
      {theme.visualOverlay}

      {/* Subtle fine dot grid */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '12px 12px'
        }}
      />

      {/* Top Header info */}
      <div className="relative z-10 flex items-center justify-between text-xs tracking-wider uppercase font-mono text-zinc-400">
        <span className="font-semibold text-zinc-300">{movie.ageRating}</span>
        <span className="text-[11px] text-zinc-400">{movie.durationMinutes}m</span>
      </div>

      {/* Center thematic visual motif */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
          {theme.icon}
        </div>
        <div className="mt-3 text-[10px] tracking-widest font-mono uppercase text-zinc-400 text-center">
          {movie.genres.slice(0, 2).join(' · ')}
        </div>
      </div>

      {/* Bottom Title Typography in Poster */}
      <div className="relative z-10 pt-2 border-t border-white/10">
        <div className="text-xs font-mono text-zinc-400 tracking-wide truncate">
          DIR: {movie.director.toUpperCase()}
        </div>
        <div className="text-base font-bold text-white tracking-tight leading-tight line-clamp-1 mt-0.5">
          {movie.title}
        </div>
      </div>

      {/* Subtle shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
