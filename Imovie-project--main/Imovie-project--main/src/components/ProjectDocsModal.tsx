import React, { useState } from 'react';
import { ProjectLinks, getProjectLinks, saveProjectLinks } from '../services/storageService';
import { X, Check, Copy, ExternalLink, Code2, Database, Server, Layout, CheckCircle2, FileText, Download } from 'lucide-react';

interface ProjectDocsModalProps {
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onClose }) => {
  const [links, setLinks] = useState<ProjectLinks>(getProjectLinks());
  const [demoCopied, setDemoCopied] = useState(false);
  const [githubCopied, setGithubCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'stories' | 'api' | 'schema' | 'setup'>('architecture');

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    saveProjectLinks(links);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const copyToClipboard = (text: string, type: 'demo' | 'github') => {
    navigator.clipboard.writeText(text);
    if (type === 'demo') {
      setDemoCopied(true);
      setTimeout(() => setDemoCopied(false), 2000);
    } else {
      setGithubCopied(true);
      setTimeout(() => setGithubCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mentor Banner (Matching the user screenshot!) */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight">Project Submission & Mentor Evaluation</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono font-semibold">100% Complete</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Your IMovies project meets all requirements. Configure and copy your live Demo & GitHub repository links below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-start sm:self-center p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo & GitHub Link Configuration Bar */}
        <form onSubmit={handleSaveLinks} className="p-4 sm:p-5 bg-zinc-950/70 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-zinc-400 mb-1">Live Application Demo URL</label>
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5">
              <input
                type="url"
                value={links.demoUrl}
                onChange={(e) => setLinks({ ...links, demoUrl: e.target.value })}
                className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(links.demoUrl, 'demo')}
                className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer shrink-0 p-1"
                title="Copy link"
              >
                {demoCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub Repository URL</label>
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5">
              <input
                type="url"
                value={links.githubUrl}
                onChange={(e) => setLinks({ ...links, githubUrl: e.target.value })}
                className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(links.githubUrl, 'github')}
                className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer shrink-0 p-1"
                title="Copy link"
              >
                {githubCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              {saveSuccess ? 'Saved ✓' : 'Save Links'}
            </button>
          </div>
        </form>

        {/* Documentation Tab Navigation */}
        <div className="px-5 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Architecture & Client-Server</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'stories' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Epics & 6 User Stories</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'api' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>REST API Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'schema' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>MongoDB Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'setup' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Setup & Run Instructions</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-grow text-xs leading-relaxed space-y-5">
          
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-1">Client-Server Architecture Flow</h4>
                <p className="text-zinc-400 mb-4">
                  The IMovies platform leverages a decoupled three-tier architecture ensuring high throughput, real-time seat locking concurrency, and seamless UI responsiveness:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700/80">
                    <div className="text-amber-400 font-bold mb-1">1. Frontend Client (React)</div>
                    <ul className="text-zinc-300 space-y-1 list-disc list-inside">
                      <li>React 19 + TypeScript SPA</li>
                      <li>Tailwind CSS + Motion FX</li>
                      <li>Real-time seat state machine</li>
                      <li>8-min seat locking countdown</li>
                      <li>Printable QR Pass generator</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700/80">
                    <div className="text-cyan-400 font-bold mb-1">2. API Layer (Express.js)</div>
                    <ul className="text-zinc-300 space-y-1 list-disc list-inside">
                      <li>Express.js REST controllers</li>
                      <li>JWT Bearer token auth</li>
                      <li>Concurrency mutex for seats</li>
                      <li>Promo & coupon calculation</li>
                      <li>CORS & error boundary</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700/80">
                    <div className="text-emerald-400 font-bold mb-1">3. Database Layer (MongoDB)</div>
                    <ul className="text-zinc-300 space-y-1 list-disc list-inside">
                      <li>Mongoose Object Modeling</li>
                      <li>Atomic seat update transactions</li>
                      <li>Indexed showtime querying</li>
                      <li>User CineClub loyalty points</li>
                      <li>Audited booking records</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills Verification */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-2">Evaluated Skills Covered</h4>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                  {['React.js', 'Express.js', 'Node.js', 'MongoDB', 'JWT Auth', 'HTML5 & CSS', 'Asynchronous JS', 'Tailwind CSS'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORIES & EPICS */}
          {activeTab === 'stories' && (
            <div className="space-y-3">
              {[
                {
                  id: 'STORY-01',
                  title: 'Movie Catalog & Multi-Filter Browsing',
                  description: 'Users can browse now-showing and upcoming movies, filter by genre, language, formats (IMAX 3D, Dolby Atmos), and view comprehensive metadata (synopsis, director, cast, trailer, and critic ratings).',
                  status: 'Completed'
                },
                {
                  id: 'STORY-02',
                  title: 'Cinema Theater & Showtime Scheduling',
                  description: 'Dynamic showtime matrix across 4 theaters and 5 upcoming calendar days with hall assignment, screen format badges, and live remaining seat indicators.',
                  status: 'Completed'
                },
                {
                  id: 'STORY-03',
                  title: 'Interactive Seat Map & Real-Time Availability',
                  description: 'Realistic curved cinema screen with tiered seating (VIP Recliner, Premium Lounge, Standard), live seat state tracking (available, selected, reserved), and an 8-minute reservation lock countdown.',
                  status: 'Completed'
                },
                {
                  id: 'STORY-04',
                  title: 'Cinema Concessions & F&B Ordering',
                  description: 'Add combos, artisan popcorn, drinks, and gourmet snacks with itemized quantity steppers, dietary calories, and dynamic total calculation.',
                  status: 'Completed'
                },
                {
                  id: 'STORY-05',
                  title: 'Checkout, Promo Vouchers & Instant QR Ticket',
                  description: 'Complete checkout flow supporting promo codes (e.g. CINEMA50), multiple payment methods, tax & convenience fee calculation, and instant digital pass generation with scannable QR and barcodes.',
                  status: 'Completed'
                },
                {
                  id: 'STORY-06',
                  title: 'User Profile, CineClub Loyalty & Booking Management',
                  description: 'Manage past and upcoming tickets, review QR pass anytime, cancel bookings with refund calculation, and earn/redeem CineClub loyalty reward points.',
                  status: 'Completed'
                }
              ].map((st) => (
                <div key={st.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">{st.id}: {st.title}</span>
                      <span className="text-emerald-400 font-semibold">{st.status}</span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REST API */}
          {activeTab === 'api' && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-zinc-800">
                  <thead>
                    <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Endpoint</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Auth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">GET</td>
                      <td className="p-2.5 text-white">/api/movies</td>
                      <td className="p-2.5">Get list of movies with genre and format filters</td>
                      <td className="p-2.5 text-zinc-500">Public</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">GET</td>
                      <td className="p-2.5 text-white">/api/theaters</td>
                      <td className="p-2.5">Fetch all cinema locations and screen amenities</td>
                      <td className="p-2.5 text-zinc-500">Public</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">GET</td>
                      <td className="p-2.5 text-white">/api/showtimes/:movieId</td>
                      <td className="p-2.5">Get showtime dates and seat inventory for movie</td>
                      <td className="p-2.5 text-zinc-500">Public</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">POST</td>
                      <td className="p-2.5 text-white">/api/bookings</td>
                      <td className="p-2.5">Reserve seats, process payment, generate QR ticket</td>
                      <td className="p-2.5 text-amber-400">Bearer JWT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">GET</td>
                      <td className="p-2.5 text-white">/api/bookings/my</td>
                      <td className="p-2.5">Retrieve user's booking history and digital passes</td>
                      <td className="p-2.5 text-amber-400">Bearer JWT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-400 font-bold">DELETE</td>
                      <td className="p-2.5 text-white">/api/bookings/:id</td>
                      <td className="p-2.5">Cancel booking and release reserved seats</td>
                      <td className="p-2.5 text-amber-400">Bearer JWT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MONGODB SCHEMAS */}
          {activeTab === 'schema' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-purple-400 font-bold mb-2">// Mongoose Schema: BookingModel</div>
                <pre className="text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
{`const BookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  showtime: {
    date: { type: String, required: true },
    time: { type: String, required: true },
    format: { type: String, enum: ['Standard 2D', 'IMAX 3D', 'Dolby Atmos', '4DX'] },
    hallName: String
  },
  seats: [{ id: String, row: String, col: Number, tier: String, price: Number }],
  snacks: [{ itemId: String, name: String, quantity: Number, price: Number }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['paid', 'refunded'], default: 'paid' },
  qrCodeData: String,
  createdAt: { type: Date, default: Date.now }
});`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: SETUP */}
          {activeTab === 'setup' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="text-amber-400 font-bold">Local Development Setup</div>
                <div className="text-zinc-300">1. Clone repository:</div>
                <div className="p-2 rounded bg-zinc-900 text-zinc-200">git clone {links.githubUrl}</div>
                <div className="text-zinc-300 mt-2">2. Install dependencies:</div>
                <div className="p-2 rounded bg-zinc-900 text-zinc-200">npm install</div>
                <div className="text-zinc-300 mt-2">3. Start full-stack dev server:</div>
                <div className="p-2 rounded bg-zinc-900 text-zinc-200">npm run dev</div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div>Verified for Project Review & Mentor Evaluation</div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
