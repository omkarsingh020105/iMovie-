import { Theater, ScreenFormat } from '../types';

export const THEATERS: Theater[] = [
  {
    id: 'th-1',
    name: 'IMovies Grand Lux Cinema',
    city: 'Metropolis Central',
    address: '450 Broadway Plaza, 4th Floor',
    distance: '0.8 miles away',
    amenities: ['IMAX Laser 70mm', 'Dolby Atmos 64-Channel', 'VIP Heated Recliners', 'Gourmet In-Seat Dining', 'Free Valet'],
    formats: ['IMAX 3D', 'Dolby Atmos', '4DX', 'Standard 2D']
  },
  {
    id: 'th-2',
    name: 'IMovies Starlight Dolby Cineplex',
    city: 'Downtown Arts District',
    address: '880 Olympic Boulevard',
    distance: '2.1 miles away',
    amenities: ['Dolby Cinema', 'Laser Projection', 'Cocktail Lounge & Bar', 'Laser Alignment Sound'],
    formats: ['Dolby Atmos', 'Standard 2D', '4DX']
  },
  {
    id: 'th-3',
    name: 'IMovies Waterfront IMAX Theatre',
    city: 'Harbor Promenade',
    address: '12 Marina Gateway Pier',
    distance: '3.4 miles away',
    amenities: ['Largest IMAX Screen in City (90ft)', 'Dolby Surround', 'Waterfront Dining Deck'],
    formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D']
  },
  {
    id: 'th-4',
    name: 'IMovies Studio Drive-In & Classic Hall',
    city: 'North Hills',
    address: '1940 Sunset Boulevard',
    distance: '4.8 miles away',
    amenities: ['Classic 35mm & 70mm Projection', 'Vintage Concessions', 'Reclining Armchairs'],
    formats: ['Standard 2D', 'Dolby Atmos']
  }
];

export const SCREEN_FORMAT_INFO: Record<ScreenFormat, { badge: string; description: string; priceAddon: number }> = {
  'Standard 2D': {
    badge: 'Standard 2D',
    description: 'Crisp 4K digital projection with 7.1 surround audio',
    priceAddon: 0
  },
  'Dolby Atmos': {
    badge: 'Dolby Atmos',
    description: 'Breathtaking moving audio that flows all around you with Dolby Vision HDR',
    priceAddon: 3.5
  },
  'IMAX 3D': {
    badge: 'IMAX 3D Laser',
    description: 'Massive floor-to-ceiling curved screen with next-gen laser sharpness',
    priceAddon: 6.0
  },
  '4DX': {
    badge: '4DX Motion',
    description: 'Synchronized motion seats with wind, fog, scent, and environmental FX',
    priceAddon: 8.0
  }
};
