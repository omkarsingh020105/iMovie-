import React, { useState } from 'react';
import { User } from '../types';
import { saveCurrentUser, DEFAULT_USER } from '../services/storageService';
import { X, Sparkles, LogOut, Check, User as UserIcon, Shield, Award } from 'lucide-react';

interface AuthModalProps {
  currentUser: User | null;
  onClose: () => void;
  onUpdateUser: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onUpdateUser
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleDemoLogin = () => {
    saveCurrentUser(DEFAULT_USER);
    onUpdateUser(DEFAULT_USER);
    onClose();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone: phone || '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      cineClubPoints: 250,
      tier: 'Gold',
      memberSince: 'October 2026'
    };

    saveCurrentUser(user);
    onUpdateUser(user);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('imovies_current_user');
    onUpdateUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {currentUser ? 'CineClub Member Profile' : isSignUp ? 'Create CineClub Account' : 'Sign In to IMovies'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser ? (
            /* Logged in profile view */
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-lg font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{currentUser.name}</h4>
                  <div className="text-xs text-zinc-400">{currentUser.email}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{currentUser.phone}</div>
                </div>
              </div>

              {/* Loyalty Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    {currentUser.tier} Tier
                  </span>
                  <span className="text-zinc-500">Member since {currentUser.memberSince}</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Available CineClub Points</div>
                    <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                      {currentUser.cineClubPoints} <span className="text-xs text-zinc-400 font-normal">pts</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-emerald-400 font-mono">
                    = ${(currentUser.cineClubPoints / 10).toFixed(2)} in savings
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2 leading-relaxed">
                  Earn 10 points per $1 spent on movie tickets & concessions. Redeem anytime during checkout!
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Login / Signup form */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Mobile Phone (for SMS Tickets)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                {isSignUp ? 'Create Free CineClub Account' : 'Sign In'}
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <span className="relative bg-zinc-900 px-2 text-[11px] font-mono text-zinc-500 uppercase">
                  or quick demo
                </span>
              </div>

              {/* 1-Click Demo Login */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1-Click Demo Sign In (Alex Vance · VIP)</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Join CineClub"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
