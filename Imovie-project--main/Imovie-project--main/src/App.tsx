import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Theater, Showtime, Seat, SnackOrder, Booking, User, MovieGenre, ScreenFormat } from './types';
import { MOVIES } from './data/moviesData';
import { THEATERS, SCREEN_FORMAT_INFO } from './data/theatersData';
import { SNACKS } from './data/snacksData';
import { getCurrentUser, getBookings, addBooking } from './services/storageService';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MovieCard } from './components/MovieCard';
import { MovieDetailModal } from './components/MovieDetailModal';
import { ShowtimePicker } from './components/ShowtimePicker';
import { SeatMapModal } from './components/SeatMapModal';
import { SnacksSelector } from './components/SnacksSelector';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketModal } from './components/TicketModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { AuthModal } from './components/AuthModal';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { TrailerModal } from './components/TrailerModal';
import { Footer } from './components/Footer';

import { Search, Film, MapPin, Sparkles, SlidersHorizontal, Check, Popcorn, Clock, Star, Ticket } from 'lucide-react';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'movies' | 'theaters' | 'concessions'>('movies');
  const [statusFilter, setStatusFilter] = useState<'all' | 'now_showing' | 'coming_soon'>('now_showing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // User & Data State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());

  // Booking Flow Steps State
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<Movie | null>(null);
  
  // Active Booking Wizard State
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);
  const [bookingTheater, setBookingTheater] = useState<Theater | null>(null);
  const [bookingShowtime, setBookingShowtime] = useState<Showtime | null>(null);
  const [bookingSeats, setBookingSeats] = useState<Seat[]>([]);
  const [bookingSnacks, setBookingSnacks] = useState<SnackOrder[]>([]);

  // Wizard active step modal
  const [step, setStep] = useState<'none' | 'showtime' | 'seats' | 'snacks' | 'checkout' | 'ticket'>('none');
  const [latestIssuedBooking, setLatestIssuedBooking] = useState<Booking | null>(null);

  // Global modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isProjectDocsOpen, setIsProjectDocsOpen] = useState(false);

  // Refresh bookings from storage
  const refreshBookings = () => {
    setBookings(getBookings());
  };

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return MOVIES.filter(m => {
      // Status filter
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      // Genre filter
      if (selectedGenre !== 'all' && !m.genres.includes(selectedGenre as MovieGenre)) return false;
      // Format filter
      if (selectedFormat !== 'all' && !m.formats.includes(selectedFormat as ScreenFormat)) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(query);
        const matchDirector = m.director.toLowerCase().includes(query);
        const matchCast = m.cast.some(c => c.name.toLowerCase().includes(query));
        if (!matchTitle && !matchDirector && !matchCast) return false;
      }
      return true;
    });
  }, [statusFilter, selectedGenre, selectedFormat, searchQuery]);

  // Featured Hero movie
  const featuredMovie = useMemo(() => {
    return MOVIES.find(m => m.featured) || MOVIES[0];
  }, []);

  // START BOOKING FLOW
  const handleStartBooking = (movie: Movie) => {
    setSelectedMovieForDetail(null);
    setBookingMovie(movie);
    setStep('showtime');
  };

  // STEP 1 COMPLETE -> GO TO SEATS
  const handleSelectShowtime = (showtime: Showtime, theater: Theater) => {
    setBookingShowtime(showtime);
    setBookingTheater(theater);
    setStep('seats');
  };

  // STEP 2 COMPLETE -> GO TO SNACKS
  const handleProceedToSnacks = (selectedSeats: Seat[]) => {
    setBookingSeats(selectedSeats);
    setStep('snacks');
  };

  // STEP 3 COMPLETE -> GO TO CHECKOUT
  const handleProceedToCheckout = () => {
    setStep('checkout');
  };

  // STEP 4 COMPLETE -> BOOKING CONFIRMED -> TICKET
  const handleCompleteBooking = (newBooking: Booking) => {
    addBooking(newBooking);
    refreshBookings();
    setLatestIssuedBooking(newBooking);
    setStep('ticket');
  };

  // RESET BOOKING FLOW
  const handleCloseBookingFlow = () => {
    setStep('none');
    setBookingMovie(null);
    setBookingTheater(null);
    setBookingShowtime(null);
    setBookingSeats([]);
    setBookingSnacks([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Universal Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenProjectDocs={() => setIsProjectDocsOpen(true)}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as 'movies' | 'theaters' | 'concessions')}
        bookingCount={bookings.filter(b => b.status === 'confirmed').length}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* MOVIES TAB */}
        {activeTab === 'movies' && (
          <div>
            {/* Cinematic Blockbuster Hero */}
            <HeroSection
              movie={featuredMovie}
              onBookTickets={handleStartBooking}
              onWatchTrailer={(m) => setSelectedMovieForTrailer(m)}
            />

            {/* Filter & Search Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 border-b border-zinc-800/80">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Status Segmented Control (Now Showing vs Coming Soon) */}
                <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start">
                  <button
                    onClick={() => setStatusFilter('now_showing')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'now_showing'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Now Showing ({MOVIES.filter(m => m.status === 'now_showing').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('coming_soon')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'coming_soon'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Coming Soon ({MOVIES.filter(m => m.status === 'coming_soon').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'all'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All Films
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, director, or actor..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

              </div>

              {/* Genre & Format Filter Chips Bar */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500 uppercase mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Genre:</span>
                </span>
                {['all', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Animation', 'Adventure'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedGenre === genre
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {genre === 'all' ? 'All Genres' : genre}
                  </button>
                ))}

                <span className="text-zinc-700 mx-2">|</span>

                <span className="text-zinc-500 uppercase mr-1">Format:</span>
                {['all', 'IMAX 3D', 'Dolby Atmos', '4DX'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedFormat === fmt
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {fmt === 'all' ? 'Any Format' : fmt}
                  </button>
                ))}
              </div>
            </section>

            {/* Movies Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {statusFilter === 'coming_soon' ? 'Upcoming Releases' : 'Now Playing In Theaters'}
                  </h2>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">
                    Showing {filteredMovies.length} movies available for immediate booking
                  </div>
                </div>
              </div>

              {filteredMovies.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <Film className="w-12 h-12 text-zinc-600 mb-3" />
                  <div className="text-base font-bold text-zinc-300">No movies match your filter criteria</div>
                  <button
                    onClick={() => { setSelectedGenre('all'); setSelectedFormat('all'); setSearchQuery(''); setStatusFilter('all'); }}
                    className="mt-3 px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelectMovie={(m) => setSelectedMovieForDetail(m)}
                      onBookTickets={handleStartBooking}
                      onWatchTrailer={(m) => setSelectedMovieForTrailer(m)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* THEATERS TAB */}
        {activeTab === 'theaters' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="max-w-2xl mb-8">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                Locations & Auditoriums
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                IMovies Cinema Locations
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Equipped with cutting-edge IMAX Laser projection, Dolby Atmos 64-channel immersive sound, and VIP heated recliners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {THEATERS.map((theater) => (
                <div 
                  key={theater.id}
                  className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                      <span className="text-amber-400 font-bold">{theater.city}</span>
                      <span>{theater.distance}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <span>{theater.name}</span>
                    </h3>

                    <p className="text-xs text-zinc-400 mt-1 ml-7">
                      {theater.address}
                    </p>

                    {/* Amenities list */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/80">
                      <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Auditorium Amenities</div>
                      <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                        {theater.amenities.map((a, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700/60">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Supported formats */}
                    <div className="mt-4 flex items-center gap-2 text-xs font-mono">
                      <span className="text-zinc-500">Formats:</span>
                      {theater.formats.map((f, i) => (
                        <span key={i} className="text-amber-300 font-semibold">
                          {f}{i < theater.formats.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('movies');
                      handleStartBooking(MOVIES[0]);
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Showtimes for this Cinema</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONCESSIONS TAB */}
        {activeTab === 'concessions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="max-w-2xl mb-8">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                In-Seat & Counter Concessions
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Gourmet Cinema Concessions
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Order freshly popped artisan popcorn, hot loaded nachos, signature combos, and craft beverages for immediate pickup or delivery directly to your seat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SNACKS.map((snack) => (
                <div
                  key={snack.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                      <span className="text-amber-400 font-semibold">{snack.category}</span>
                      <span className="text-[11px] text-zinc-500">{snack.calories}</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {snack.name}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-1 line-clamp-3 leading-relaxed">
                      {snack.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div className="text-base font-black text-amber-400 font-mono tabular-nums">
                      ${snack.price.toFixed(2)}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('movies');
                        handleStartBooking(MOVIES[0]);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Order with Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODALS & WIZARDS */}

      {/* 1. Movie Detail Drawer / Modal */}
      <MovieDetailModal
        movie={selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onBookTickets={handleStartBooking}
        onWatchTrailer={(m) => setSelectedMovieForTrailer(m)}
      />

      {/* 2. Trailer Modal */}
      <TrailerModal
        movie={selectedMovieForTrailer}
        onClose={() => setSelectedMovieForTrailer(null)}
      />

      {/* 3. Wizard Step 1: Showtime Picker */}
      {step === 'showtime' && bookingMovie && (
        <ShowtimePicker
          movie={bookingMovie}
          onClose={handleCloseBookingFlow}
          onSelectShowtime={handleSelectShowtime}
        />
      )}

      {/* 4. Wizard Step 2: Interactive Seat Map */}
      {step === 'seats' && bookingMovie && bookingTheater && bookingShowtime && (
        <SeatMapModal
          movie={bookingMovie}
          theater={bookingTheater}
          showtime={bookingShowtime}
          onBack={() => setStep('showtime')}
          onClose={handleCloseBookingFlow}
          onProceedToSnacks={handleProceedToSnacks}
        />
      )}

      {/* 5. Wizard Step 3: Food & Drinks Concessions */}
      {step === 'snacks' && (
        <SnacksSelector
          snackOrders={bookingSnacks}
          onUpdateSnacks={(orders) => setBookingSnacks(orders)}
          onBack={() => setStep('seats')}
          onProceedToCheckout={handleProceedToCheckout}
          onClose={handleCloseBookingFlow}
        />
      )}

      {/* 6. Wizard Step 4: Checkout & Payment */}
      {step === 'checkout' && bookingMovie && bookingTheater && bookingShowtime && (
        <CheckoutModal
          movie={bookingMovie}
          theater={bookingTheater}
          showtime={bookingShowtime}
          seats={bookingSeats}
          snacks={bookingSnacks}
          currentUser={currentUser}
          onBack={() => setStep('snacks')}
          onClose={handleCloseBookingFlow}
          onCompleteBooking={handleCompleteBooking}
        />
      )}

      {/* 7. Wizard Final: Digital Cinema Ticket Pass */}
      {step === 'ticket' && latestIssuedBooking && (
        <TicketModal
          booking={latestIssuedBooking}
          onClose={handleCloseBookingFlow}
          onViewMyBookings={() => {
            handleCloseBookingFlow();
            setIsMyBookingsOpen(true);
          }}
        />
      )}

      {/* 8. My Bookings / Tickets Management */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setIsMyBookingsOpen(false)}
          onRefresh={refreshBookings}
          onSelectBookingForPass={(booking) => {
            setLatestIssuedBooking(booking);
            setStep('ticket');
          }}
        />
      )}

      {/* 9. User Authentication & Profile */}
      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthOpen(false)}
          onUpdateUser={(u) => setCurrentUser(u)}
        />
      )}

      {/* 10. Project Specs & Mentor Evaluation Hub */}
      {isProjectDocsOpen && (
        <ProjectDocsModal
          onClose={() => setIsProjectDocsOpen(false)}
        />
      )}

      {/* Clean anti-slop Footer */}
      <Footer
        onOpenProjectDocs={() => setIsProjectDocsOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
      />

    </div>
  );
}
