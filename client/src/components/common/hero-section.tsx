import { Camera, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function AuctionCard() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-md bg-white shadow-2xl">
      {/* Card image area */}
      <div className="relative">
        {/* Timer + LIVE badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1.5 backdrop-blur-sm">
          <Clock className="h-3.5 w-3.5 text-white" />
          <span className="text-sm font-mono font-semibold text-white">
            01:03:33
          </span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-cyan-400 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="text-xs font-bold text-gray-900">LIVE</span>
        </div>

        {/* Purple gradient image placeholder */}
        <div className="flex h-52 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
          <Camera className="h-12 w-12 text-white/50" />
        </div>
      </div>

      {/* Card info */}
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Fashion · Auction
          </p>
          <p className="text-xs text-gray-400">Current bid</p>
          <p className="text-2xl font-bold text-gray-900">$1,250</p>
        </div>
        <button className="cursor-pointer rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700">
          Bid now →
        </button>
      </div>
    </div>
  );
}

const STATS = [
  { value: '240k+', label: 'items sold' },
  { value: '4.9 ★', label: 'avg seller rating' },
  { value: '24h', label: 'auto-hammer window' },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-64px)] overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #060c1a 0%, #0a1128 50%, #060d1f 100%)',
        backgroundImage: `
          linear-gradient(135deg, #060c1a 0%, #0a1128 50%, #060d1f 100%),
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 -translate-x-1/2 translate-y-1/3 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute right-1/4 top-0 h-48 w-48 -translate-y-1/3 translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #6366f1, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-28">
        {/* Left: copy */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Live badge */}
          <div className="flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            <span className="text-sm text-gray-300">
              1,284 live auctions right now
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            Find your next
            <br />
            treasure, secondhand.
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-base leading-relaxed text-gray-400">
            Bid in real time or buy on the spot. Every listing comes from a
            verified seller — premium secondhand, zero guesswork.
          </p>

          {/* Search bar */}
          <div className="flex max-w-lg items-center overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex items-center gap-2 pl-4 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Find your next treasure..."
              className="h-14 flex-1 border-0 bg-transparent text-sm text-gray-700 shadow-none outline-none ring-0 placeholder:text-gray-400 focus-visible:ring-0"
            />
            <div className="pr-2">
              <Button className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-2">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="h-8 w-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: auction card */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <AuctionCard />
        </div>
      </div>
    </section>
  );
}
