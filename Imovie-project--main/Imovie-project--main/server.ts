import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database store representing MongoDB collections
const db = {
  movies: [
    {
      id: 'm1',
      title: 'ASTRAL ODYSSEY: BEYOND THE VOID',
      durationMinutes: 164,
      genres: ['Sci-Fi', 'Adventure', 'Drama'],
      ageRating: 'PG-13',
      imdbRating: 8.9,
      status: 'now_showing'
    },
    {
      id: 'm2',
      title: 'SHADOW RUNNER: NEO TOKYO',
      durationMinutes: 142,
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      ageRating: 'R',
      imdbRating: 8.6,
      status: 'now_showing'
    }
  ],
  theaters: [
    {
      id: 'th-1',
      name: 'IMovies Grand Lux Cinema',
      city: 'Metropolis Central',
      address: '450 Broadway Plaza, 4th Floor'
    }
  ],
  bookings: [] as any[]
};

// REST API Endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'IMovies API Server', timestamp: new Date().toISOString() });
});

app.get('/api/movies', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.movies.length, data: db.movies });
});

app.get('/api/theaters', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.theaters.length, data: db.theaters });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const { movie, theater, showtime, seats, customerName, customerEmail } = req.body;
  if (!movie || !seats || !seats.length) {
    return res.status(400).json({ success: false, error: 'Missing required booking parameters' });
  }

  const bookingCode = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;
  const newBooking = {
    id: `bk-${Date.now()}`,
    bookingCode,
    movie,
    theater,
    showtime,
    seats,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };

  db.bookings.push(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.bookings });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`IMovies Full-Stack Server running on port ${PORT}`);
  });
}

// Only start server when executed directly
if (process.env.RUN_SERVER === 'true') {
  startServer();
}

export default app;
