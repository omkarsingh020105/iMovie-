import React from 'react';
import { Film, User as UserIcon, Ticket, Code2 } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenMyBookings: () => void;
  onOpenProjectDocs: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenMyBookings,
  onOpenProjectDocs,
  activeTab,
  setActiveTab,
  bookingCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element wordmark with icon) */}
        <a 
          href="#home"
          onClick={(e) => { e.preventDefault(); setActiveTab('movies'); }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-wider font-mono text-base sm:text-lg">
            I<span className="text-amber-400">MOVIES</span>
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('movies')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'movies' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setActiveTab('theaters')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'theaters' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Cinema Theaters
          </button>
          <button
            onClick={() => setActiveTab('concessions')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'concessions' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Food & Drinks
          </button>
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white"
          >
            <Ticket className="w-3.5 h-3.5 text-zinc-400" />
            <span>My Tickets</span>
            {bookingCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-zinc-800 text-amber-300 rounded tabular-nums">
                {bookingCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenProjectDocs}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Project Specs & Docs</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:text-white transition-all whitespace-nowrap shrink-0"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-mono">{currentUser.name}</span>
              <span className="text-[10px] text-amber-400 font-mono hidden lg:inline">
                ({currentUser.cineClubPoints} pts)
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu trigger for Project Specs and Bookings */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={onOpenMyBookings}
              className="p-2 text-zinc-400 hover:text-white"
              title="My Tickets"
            >
              <Ticket className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenProjectDocs}
              className="p-2 text-amber-400 hover:text-amber-300"
              title="Project Docs"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
