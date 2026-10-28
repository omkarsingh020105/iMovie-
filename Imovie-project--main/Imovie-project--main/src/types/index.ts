export type MovieGenre = 
  | 'Action' 
  | 'Sci-Fi' 
  | 'Drama' 
  | 'Thriller' 
  | 'Animation' 
  | 'Adventure' 
  | 'Horror' 
  | 'Comedy';

export type ScreenFormat = 'Standard 2D' | 'IMAX 3D' | 'Dolby Atmos' | '4DX';

export interface CastMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking?: boolean;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  durationMinutes: number;
  releaseDate: string;
  genres: MovieGenre[];
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  imdbRating: number;
  criticScore: number; // e.g. 94%
  director: string;
  cast: CastMember[];
  language: string;
  formats: ScreenFormat[];
  status: 'now_showing' | 'coming_soon';
  posterColor: string;
  accentColor: string;
  trailerYoutubeId: string;
  featured?: boolean;
}

export interface Theater {
  id: string;
  name: string;
  city: string;
  address: string;
  distance: string;
  amenities: string[];
  formats: ScreenFormat[];
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  hallName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:30"
  format: ScreenFormat;
  basePrice: number;
  availableSeatsCount: number;
  totalSeatsCount: number;
}

export type SeatTier = 'standard' | 'premium' | 'vip_recliner' | 'accessible';
export type SeatStatus = 'available' | 'reserved' | 'selected';

export interface Seat {
  id: string; // e.g. "E-7"
  row: string; // "A" - "J"
  col: number; // 1 - 12
  tier: SeatTier;
  status: SeatStatus;
  price: number;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'Combos' | 'Popcorn' | 'Beverages' | 'Gourmet Snacks';
  description: string;
  price: number;
  calories: string;
  iconName: string;
  popular?: boolean;
}

export interface SnackOrder {
  item: SnackItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  seats: Seat[];
  snacks: SnackOrder[];
  seatSubtotal: number;
  snackSubtotal: number;
  bookingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
  qrCodeData: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  cineClubPoints: number;
  tier: 'Silver' | 'Gold' | 'VIP Platinum';
  memberSince: string;
}
