import { Booking, Movie, Seat, Showtime, Theater, User } from '../types';
import { MOVIES } from '../data/moviesData';
import { THEATERS } from '../data/theatersData';

const CURRENT_USER_KEY = 'imovies_current_user';
const BOOKINGS_KEY = 'imovies_bookings';
const RESERVED_SEATS_KEY = 'imovies_showtime_seats_';
const PROJECT_LINKS_KEY = 'imovies_project_links';

export const DEFAULT_USER: User = {
  id: 'usr-1049',
  name: 'Alex Vance',
  email: 'alex.vance@cinema.io',
  phone: '+1 (555) 382-9104',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  cineClubPoints: 850,
  tier: 'VIP Platinum',
  memberSince: 'March 2025'
};

export interface ProjectLinks {
  demoUrl: string;
  githubUrl: string;
}

export const DEFAULT_PROJECT_LINKS: ProjectLinks = {
  demoUrl: 'https://ais-pre-wxovcvpsc2nbeffd2d4lhy-786646194286.asia-northeast1.run.app',
  githubUrl: 'https://github.com/developer/imovies-cinema-booking-platform'
};

// Generate dates for today and the next 4 days
export function getAvailableDates(): { dateStr: string; label: string; dayName: string; isToday: boolean }[] {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    let label = '';
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    dates.push({
      dateStr,
      label,
      dayName,
      isToday: i === 0
    });
  }
  return dates;
}

// Generate realistic showtimes for a movie and theater
export function generateShowtimes(movieId: string, theaterId: string, dateStr: string): Showtime[] {
  const times = [
    { time: '11:00 AM', format: 'Standard 2D', price: 13.50, hall: 'Hall 4' },
    { time: '01:45 PM', format: 'Dolby Atmos', price: 17.00, hall: 'Dolby Cine Hall 1' },
    { time: '04:30 PM', format: 'IMAX 3D', price: 21.50, hall: 'IMAX Laser Auditorium' },
    { time: '07:15 PM', format: 'IMAX 3D', price: 22.50, hall: 'IMAX Laser Auditorium' },
    { time: '10:00 PM', format: '4DX', price: 23.00, hall: '4DX Extreme Hall' }
  ];

  return times.map((t, index) => {
    const id = `st-${movieId}-${theaterId}-${dateStr}-${index}`;
    // Pseudo random available seat counts
    const hash = (movieId.charCodeAt(1) || 5) + index * 7 + (theaterId.charCodeAt(3) || 2);
    const available = 70 + (hash % 38);

    return {
      id,
      movieId,
      theaterId,
      hallName: t.hall,
      date: dateStr,
      time: t.time,
      format: t.format as any,
      basePrice: t.price,
      availableSeatsCount: available,
      totalSeatsCount: 120
    };
  });
}

// Generate a full 10x12 theater seat layout
export function generateSeatLayout(showtimeId: string, basePrice: number): Seat[] {
  const savedReserved = getReservedSeatIds(showtimeId);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']; // 9 rows
  const cols = 12; // 12 columns per row
  const seats: Seat[] = [];

  // Deterministic seed for initial occupied seats based on showtime ID
  let seed = 0;
  for (let i = 0; i < showtimeId.length; i++) {
    seed = (seed * 31 + showtimeId.charCodeAt(i)) % 1000;
  }

  rows.forEach((row, rIdx) => {
    for (let col = 1; col <= cols; col++) {
      const id = `${row}-${col}`;
      
      let tier: Seat['tier'] = 'standard';
      let price = basePrice;

      if (row === 'D' && (col === 1 || col === 12)) {
        tier = 'accessible';
        price = basePrice;
      } else if (['A', 'B', 'C'].includes(row)) {
        tier = 'standard';
        price = basePrice;
      } else if (['D', 'E', 'F', 'G'].includes(row)) {
        tier = 'premium';
        price = basePrice + 4.0;
      } else {
        // Rows H, J
        tier = 'vip_recliner';
        price = basePrice + 8.5;
      }

      // Check if reserved
      let isReserved = savedReserved.includes(id);
      if (!isReserved && savedReserved.length === 0) {
        // Generate realistic cluster of already booked seats if freshly generated
        const val = (seed + rIdx * 17 + col * 23) % 100;
        if (val < 26) {
          isReserved = true;
        }
      }

      seats.push({
        id,
        row,
        col,
        tier,
        status: isReserved ? 'reserved' : 'available',
        price
      });
    }
  });

  return seats;
}

export function getReservedSeatIds(showtimeId: string): string[] {
  try {
    const raw = localStorage.getItem(`${RESERVED_SEATS_KEY}${showtimeId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveReservedSeatIds(showtimeId: string, seatIds: string[]): void {
  try {
    const current = getReservedSeatIds(showtimeId);
    const combined = Array.from(new Set([...current, ...seatIds]));
    localStorage.setItem(`${RESERVED_SEATS_KEY}${showtimeId}`, JSON.stringify(combined));
  } catch (e) {
    console.error('Failed to save reserved seats', e);
  }
}

// User Profile helpers
export function getCurrentUser(): User {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // fallback
  }
  return DEFAULT_USER;
}

export function saveCurrentUser(user: User): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

// Bookings
export function getBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }

  // Seed default initial booking so user sees a realistic booking card right away
  const sampleMovie = MOVIES[0];
  const sampleTheater = THEATERS[0];
  const initialBooking: Booking = {
    id: 'bk-sample-01',
    bookingCode: 'IMV-948210',
    userId: DEFAULT_USER.id,
    customerName: DEFAULT_USER.name,
    customerEmail: DEFAULT_USER.email,
    customerPhone: DEFAULT_USER.phone,
    movie: sampleMovie,
    theater: sampleTheater,
    showtime: {
      id: 'st-sample',
      movieId: sampleMovie.id,
      theaterId: sampleTheater.id,
      hallName: 'IMAX Laser Auditorium',
      date: new Date().toISOString().split('T')[0],
      time: '07:15 PM',
      format: 'IMAX 3D',
      basePrice: 22.50,
      availableSeatsCount: 84,
      totalSeatsCount: 120
    },
    seats: [
      { id: 'E-6', row: 'E', col: 6, tier: 'premium', status: 'reserved', price: 26.50 },
      { id: 'E-7', row: 'E', col: 7, tier: 'premium', status: 'reserved', price: 26.50 }
    ],
    snacks: [],
    seatSubtotal: 53.00,
    snackSubtotal: 0,
    bookingFee: 3.50,
    discount: 0,
    totalAmount: 56.50,
    paymentMethod: 'Credit Card (•••• 4921)',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    qrCodeData: 'IMV-948210-VERIFIED-SEAT-E6-E7'
  };

  saveBookings([initialBooking]);
  return [initialBooking];
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
}

export function addBooking(newBooking: Booking): void {
  const existing = getBookings();
  const updated = [newBooking, ...existing];
  saveBookings(updated);
  // Also reserve the seats permanently for that showtime
  saveReservedSeatIds(newBooking.showtime.id, newBooking.seats.map(s => s.id));
}

export function cancelBooking(bookingId: string): boolean {
  const existing = getBookings();
  const found = existing.find(b => b.id === bookingId);
  if (!found) return false;
  found.status = 'cancelled';
  saveBookings([...existing]);
  return true;
}

// Project links helper
export function getProjectLinks(): ProjectLinks {
  try {
    const stored = localStorage.getItem(PROJECT_LINKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // fallback
  }
  return DEFAULT_PROJECT_LINKS;
}

export function saveProjectLinks(links: ProjectLinks): void {
  try {
    localStorage.setItem(PROJECT_LINKS_KEY, JSON.stringify(links));
  } catch (e) {
    console.error(e);
  }
}
