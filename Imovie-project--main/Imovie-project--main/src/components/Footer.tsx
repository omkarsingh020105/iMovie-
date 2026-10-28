import React from 'react';
import { Film, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenProjectDocs: () => void;
  onOpenMyBookings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProjectDocs, onOpenMyBookings }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Brand & mission */}
        <div>
          <div className="flex items-center gap-2.5 text-white font-bold text-lg mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-mono tracking-wider">
              I<span className="text-amber-400">MOVIES</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
            The next-generation cinema ticketing experience. Real-time seating, premium formats, and effortless reservations.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <button 
            onClick={onOpenProjectDocs}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Project Documentation & Architecture
          </button>
          <button 
            onClick={onOpenMyBookings}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            My Cinema Tickets
          </button>
          <span className="text-zinc-700">·</span>
          <span>Terms & Cinema Policies</span>
          <span>Privacy</span>
        </div>

        {/* Copyright */}
        <div className="text-xs font-mono text-zinc-500">
          © {new Date().getFullYear()} IMovies Cinema Platform. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
