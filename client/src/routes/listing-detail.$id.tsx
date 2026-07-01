import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/listing-detail/$id')({
  component: ListingDetailPage,
});

/* ── Types ───────────────────────────────────────────────────────── */

type Condition = 'new' | 'like-new' | 'good' | 'fair';
type ListingType = 'auction' | 'fixed';

interface MockListing {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  condition: Condition;
  location: string;
  listingType: ListingType;
  watchers: number;
  currentBid: number;
  startingPrice: number;
  fixedPrice?: number;
  endsAt: Date;
  totalBids: number;
  seller: { name: string; initials: string; rating: number; reviews: number };
  description: string;
  bidHistory: { id: string; bidder: string; amount: number; timeAgo: string }[];
  images: { gradient: string }[];
}

/* ── Mock data ───────────────────────────────────────────────────── */

const MOCK: MockListing = {
  id: '1',
  title: 'Roland Juno-60 Vintage Analog Synthesizer',
  category: 'Electronics',
  subcategory: 'Music & Instruments',
  condition: 'like-new',
  location: 'Seattle, WA',
  listingType: 'auction',
  watchers: 142,
  currentBid: 2450,
  startingPrice: 1800,
  endsAt: new Date(Date.now() + 14 * 3600000 + 22 * 60000 + 5000),
  totalBids: 12,
  seller: { name: 'Alex_AudioGear', initials: 'AA', rating: 4.9, reviews: 128 },
  description:
    "Incredible condition Roland Juno-60. Freshly serviced by a professional tech last month. All sliders and buttons work perfectly. The chorus sounds thick and lush, just as you'd expect. Minor scuffs on the wooden sides consistent with age, but otherwise pristine. Includes original manual and a hard flight case. Local pickup in Seattle preferred but willing to ship fully insured.",
  bidHistory: [
    { id: '1', bidder: 'J***n', amount: 2450, timeAgo: '2 mins ago' },
    { id: '2', bidder: 'A***2', amount: 2400, timeAgo: '1 hour ago' },
    { id: '3', bidder: 'M***k', amount: 2200, timeAgo: '3 hours ago' },
  ],
  images: [
    { gradient: 'from-teal-300 via-cyan-400 to-sky-500' },
    { gradient: 'from-slate-500 to-slate-700' },
    { gradient: 'from-amber-300 to-orange-500' },
    { gradient: 'from-violet-400 to-indigo-600' },
    { gradient: 'from-emerald-400 to-teal-600' },
  ],
};

/* ── Condition config ────────────────────────────────────────────── */

const CONDITION: Record<Condition, { label: string; cls: string }> = {
  new: {
    label: 'New',
    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  'like-new': {
    label: 'Like New',
    cls: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  good: {
    label: 'Good',
    cls: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  fair: {
    label: 'Fair',
    cls: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
};

/* ── Countdown hook ──────────────────────────────────────────────── */

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(t.h)}:${p(t.m)}:${p(t.s)}`;
}

/* ── Page ────────────────────────────────────────────────────────── */

function ListingDetailPage() {
  const { id } = Route.useParams();
  const listing = { ...MOCK, id }; // in production: fetch by id

  const [activeImg, setActiveImg] = useState(0);
  const [bidValue, setBidValue] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const countdown = useCountdown(listing.endsAt);

  const cond = CONDITION[listing.condition];
  const suggestedBid = listing.currentBid + 50;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            to="/"
            className="no-underline transition-colors hover:text-foreground"
          >
            Explore
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="hover:text-foreground cursor-pointer transition-colors">
            {listing.category}
          </span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-foreground font-medium">
            {listing.title}
          </span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ── Left: image gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
              <div
                className={cn(
                  'aspect-[4/3] w-full bg-gradient-to-br',
                  listing.images[activeImg].gradient
                )}
              />

              {/* Top-left badges */}
              <div className="absolute left-3 top-3 flex items-center gap-2">
                {listing.listingType === 'auction' && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                    Auction
                  </span>
                )}
                <div className="flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-sm">
                  <Eye className="h-3 w-3 text-white" />
                  <span className="text-xs font-semibold text-white">
                    {listing.watchers}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {listing.images.slice(0, 4).map((img, i) => {
                const isExtra = i === 3 && listing.images.length > 4;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => !isExtra && setActiveImg(i)}
                    className={cn(
                      'relative aspect-[4/3] overflow-hidden rounded-xl transition-all',
                      activeImg === i && !isExtra
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-75 hover:opacity-100'
                    )}
                  >
                    <div
                      className={cn(
                        'h-full w-full bg-gradient-to-br',
                        img.gradient
                      )}
                    />
                    {isExtra && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
                        <span className="text-sm font-bold text-white">
                          +{listing.images.length - 3} Photos
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: details ── */}
          <div className="space-y-5">
            {/* Title + wishlist */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                {listing.title}
              </h1>
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                className={cn(
                  'mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all',
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-border bg-white text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-400'
                )}
              >
                <Heart
                  className="h-4.5 w-4.5"
                  fill={wishlisted ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Condition + location */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                  cond.cls
                )}
              >
                {cond.label}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {listing.location}
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {listing.seller.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {listing.seller.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {listing.seller.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({listing.seller.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 rounded-lg text-xs font-semibold"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Button>
            </div>

            {/* Bid box (auction) */}
            {listing.listingType === 'auction' && (
              <div className="rounded-2xl border-2 border-primary/25 bg-primary/[0.03] p-5">
                {/* Current bid + timer */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Current Highest Bid
                    </p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold tabular-nums text-foreground">
                        ${listing.currentBid.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        USD
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Starting Price: ${listing.startingPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-primary px-4 py-2.5 shadow-md shadow-primary/20">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary-foreground/70">
                      ENDS IN
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary-foreground" />
                      <span className="font-mono text-lg font-bold tabular-nums text-primary-foreground">
                        {countdown}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-primary/10" />

                {/* Bid input */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground">
                    Place Your Bid
                  </p>
                  <div className="flex gap-2">
                    <div className="flex flex-1 items-center rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
                      <span className="mr-1.5 text-sm font-medium text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        value={bidValue}
                        onChange={(e) => setBidValue(e.target.value)}
                        placeholder={suggestedBid.toLocaleString()}
                        className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <Button className="shrink-0 rounded-xl px-5 font-bold shadow-sm">
                      Place Bid
                    </Button>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    Must be higher than current bid ($
                    {listing.currentBid.toLocaleString()})
                  </p>
                </div>
              </div>
            )}

            {/* Fixed price buy box */}
            {listing.listingType === 'fixed' && listing.fixedPrice && (
              <div className="rounded-2xl border-2 border-primary/25 bg-primary/[0.03] p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Price
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tabular-nums text-foreground">
                    ${listing.fixedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    USD
                  </span>
                </div>
                <Button className="mt-4 w-full rounded-xl py-3 font-bold">
                  Buy Now
                </Button>
              </div>
            )}

            {/* Bid history */}
            {listing.listingType === 'auction' && (
              <div className="rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <p className="text-sm font-bold text-foreground">
                    Bid History
                  </p>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                    {listing.totalBids} Bids
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {listing.bidHistory.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {bid.bidder[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {bid.bidder}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          ${bid.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {bid.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="rounded-2xl border border-border bg-white px-5 py-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-foreground">
                Description
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Buyer Protection
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Secure checkout
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Verified Item
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Authenticity guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
