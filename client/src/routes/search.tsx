import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3X3,
  Heart,
  List,
  MapPin,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* ── Route (query params) ────────────────────────────────────────── */

const searchSchema = z.object({
  q:         z.string().optional().default(''),
  category:  z.string().optional(),
  condition: z.string().optional(),
  minPrice:  z.number().optional(),
  maxPrice:  z.number().optional(),
  sort:      z.string().optional().default('relevance'),
  page:      z.number().optional().default(1),
});

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
});

/* ── Types ───────────────────────────────────────────────────────── */

type ListingType = 'buy-now' | 'auction';

interface SearchResult {
  id: string;
  title: string;
  gradient: string;
  type: ListingType;
  price: number;
  currentBid?: number;
  rating: number;
  reviewCount: number;
  shipping: 'free' | 'local' | 'calculated';
  endsIn?: string;
  condition: string;
}

/* ── Mock data (12 results, 1 page) ─────────────────────────────── */

const ALL_RESULTS: SearchResult[] = [
  { id: '1', title: 'Leica M3 Chrome Rangefinder Body Only (Excellent...', gradient: 'from-zinc-300 to-zinc-500',   type: 'buy-now',  price: 1450,  rating: 4.9, reviewCount: 128, shipping: 'free',       condition: 'Like New' },
  { id: '2', title: 'Hasselblad 500C/M + 80mm f/2.8 Planar T* Lens',     gradient: 'from-stone-700 to-stone-900', type: 'auction',  price: 0,     currentBid: 2150, rating: 5.0, reviewCount: 42,  shipping: 'calculated', endsIn: '2h 15m', condition: 'Good' },
  { id: '3', title: 'Canon AE-1 Program 35mm SLR Camera w/ 50mm f/1.8',  gradient: 'from-slate-300 to-slate-500', type: 'buy-now',  price: 225,   rating: 4.7, reviewCount: 210, shipping: 'local',      condition: 'Good' },
  { id: '4', title: 'Nikon F3 HP Professional Film SLR — Black Body',     gradient: 'from-gray-800 to-gray-950',   type: 'buy-now',  price: 480,   rating: 4.8, reviewCount: 77,  shipping: 'free',       condition: 'Like New' },
  { id: '5', title: 'Olympus OM-1n 35mm Film Camera + 50mm f/1.4',       gradient: 'from-neutral-300 to-neutral-500', type: 'auction', price: 0, currentBid: 320, rating: 4.6, reviewCount: 31, shipping: 'calculated', endsIn: '1d 3h', condition: 'Good' },
  { id: '6', title: 'Polaroid SX-70 Alpha 1 Instant Film Camera',         gradient: 'from-amber-300 to-amber-600',  type: 'buy-now',  price: 195,   rating: 4.5, reviewCount: 156, shipping: 'free',       condition: 'Used' },
  { id: '7', title: 'Contax T2 35mm Point & Shoot — Titanium',            gradient: 'from-teal-200 to-teal-500',    type: 'auction',  price: 0,     currentBid: 875, rating: 5.0, reviewCount: 19, shipping: 'calculated', endsIn: '4h 50m', condition: 'Like New' },
  { id: '8', title: 'Minolta X-700 SLR Kit w/ MD 50mm f/1.7 Lens',       gradient: 'from-rose-300 to-rose-600',    type: 'buy-now',  price: 145,   rating: 4.4, reviewCount: 88,  shipping: 'local',      condition: 'Good' },
  { id: '9', title: 'Voigtlander Bessa R2M Black Chrome + 35mm f/2.5',   gradient: 'from-sky-400 to-sky-700',      type: 'buy-now',  price: 780,   rating: 4.9, reviewCount: 44,  shipping: 'free',       condition: 'Like New' },
];

const CATEGORIES = ['Electronics', 'Fashion', 'Collectibles', 'Home & Garden', 'Sports', 'Books'];
const CONDITIONS  = ['New', 'Like New', 'Good', 'Used'];

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Relevance' },
  { value: 'price-asc',   label: 'Price: Low to High' },
  { value: 'price-desc',  label: 'Price: High to Low' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'newest',      label: 'Newest First' },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────── */

interface FilterState {
  categories: string[];
  conditions: string[];
  minPrice: string;
  maxPrice: string;
}

function Sidebar({
  filters,
  onChange,
  onClear,
  onApply,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
  onApply: () => void;
}) {
  function toggleCategory(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  }

  function toggleCondition(cond: string) {
    const next = filters.conditions.includes(cond)
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onChange({ ...filters, conditions: next });
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );

  return (
    <aside className="w-52 shrink-0">
      <div className="sticky top-[88px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {/* header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-base font-bold text-foreground">Filters</span>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">
          {/* Categories */}
          <Section title="Categories">
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Price Range */}
          <Section title="Price Range">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </Section>

          {/* Condition */}
          <Section title="Condition">
            <div className="flex flex-col gap-2">
              {CONDITIONS.map((cond) => (
                <label key={cond} className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">{cond}</span>
                </label>
              ))}
            </div>
          </Section>

          <Button onClick={onApply} className="w-full rounded-xl font-bold">
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}

/* ── Result card (grid) ──────────────────────────────────────────── */

function GridCard({ item }: { item: SearchResult }) {
  const [wishlisted, setWishlisted] = useState(false);

  const displayPrice =
    item.type === 'auction'
      ? item.currentBid ?? 0
      : item.price;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className={cn('relative h-48 bg-gradient-to-br', item.gradient)}>
        {/* Heart */}
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          className="absolute left-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground',
            )}
          />
        </button>

        {/* Type badge */}
        {item.type === 'buy-now' ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow">
            Buy It Now
          </span>
        ) : (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
            Auction
          </span>
        )}

        {/* Countdown for auction */}
        {item.endsIn && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              Ending in {item.endsIn}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <Link
          to="/listing-detail/$id"
          params={{ id: item.id }}
          className="line-clamp-2 text-sm font-bold leading-snug text-foreground no-underline hover:text-primary"
        >
          {item.title}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={item.rating} />
          <span className="text-xs font-semibold text-amber-600">{item.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {item.type === 'buy-now' ? (
            <p className="text-lg font-extrabold text-foreground">
              ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          ) : (
            <div>
              <p className="text-[11px] text-muted-foreground">Current Bid:</p>
              <p className="text-lg font-extrabold text-foreground">
                ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {/* Shipping */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          {item.shipping === 'free' && (
            <>
              <Truck className="h-3 w-3 text-emerald-500" />
              <span className="font-medium text-emerald-600">Free Shipping</span>
            </>
          )}
          {item.shipping === 'local' && (
            <>
              <MapPin className="h-3 w-3" />
              <span>Local Pickup</span>
            </>
          )}
          {item.shipping === 'calculated' && (
            <>
              <Truck className="h-3 w-3" />
              <span>Calculated Shipping</span>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4">
          {item.type === 'buy-now' ? (
            <Link to="/listing-detail/$id" params={{ id: item.id }} className="no-underline">
              <Button variant="outline" className="w-full rounded-xl font-bold">
                View Details
              </Button>
            </Link>
          ) : (
            <Link to="/listing-detail/$id" params={{ id: item.id }} className="no-underline">
              <Button className="w-full rounded-xl font-bold">
                Place Bid
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Result card (list) ──────────────────────────────────────────── */

function ListCard({ item }: { item: SearchResult }) {
  const [wishlisted, setWishlisted] = useState(false);

  const displayPrice = item.type === 'auction' ? item.currentBid ?? 0 : item.price;

  return (
    <div className="flex gap-5 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className={cn('relative h-28 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br', item.gradient)}>
        {item.endsIn && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold text-white">
              <Clock className="h-2.5 w-2.5" />
              {item.endsIn}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start gap-2">
            <Link
              to="/listing-detail/$id"
              params={{ id: item.id }}
              className="text-sm font-bold leading-snug text-foreground no-underline hover:text-primary"
            >
              {item.title}
            </Link>
            {item.type === 'buy-now' ? (
              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                Buy It Now
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                Auction
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <StarRating rating={item.rating} />
            <span className="text-xs font-semibold text-amber-600">{item.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            {item.type === 'buy-now' ? (
              <p className="text-lg font-extrabold text-foreground">
                ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            ) : (
              <div>
                <p className="text-[11px] text-muted-foreground">Current Bid:</p>
                <p className="text-lg font-extrabold text-foreground">
                  ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {item.shipping === 'free' && (
                <>
                  <Truck className="h-3 w-3 text-emerald-500" />
                  <span className="font-medium text-emerald-600">Free Shipping</span>
                </>
              )}
              {item.shipping === 'local' && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>Local Pickup</span>
                </>
              )}
              {item.shipping === 'calculated' && (
                <>
                  <Truck className="h-3 w-3" />
                  <span>Calculated Shipping</span>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setWishlisted((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-rose-50"
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  wishlisted ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground',
                )}
              />
            </button>

            {item.type === 'buy-now' ? (
              <Link to="/listing-detail/$id" params={{ id: item.id }} className="no-underline">
                <Button variant="outline" size="sm" className="rounded-xl font-bold">
                  View Details
                </Button>
              </Link>
            ) : (
              <Link to="/listing-detail/$id" params={{ id: item.id }} className="no-underline">
                <Button size="sm" className="rounded-xl font-bold">
                  Place Bid
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ──────────────────────────────────────────────────── */

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    const result: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) result.push(i);
    } else {
      result.push(1);
      if (current > 3) result.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        result.push(i);
      }
      if (current < total - 2) result.push('...');
      result.push(total);
    }
    return result;
  }, [current, total]);

  const BtnBase = 'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors';

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className={cn(BtnBase, 'text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className={cn(BtnBase, 'cursor-default text-muted-foreground')}>
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              BtnBase,
              p === current
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground hover:bg-muted',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className={cn(BtnBase, 'text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

const RESULTS_PER_PAGE = 6;
const TOTAL_PAGES = 12;

function SearchPage() {
  const { q = '', sort: initialSort = 'relevance', page: initialPage = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [viewMode,    setViewMode]    = useState<'grid' | 'list'>('grid');
  const [sort,        setSort]        = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState<FilterState>({
    categories: ['Collectibles'],
    conditions: ['Used'],
    minPrice: '',
    maxPrice: '',
  });

  const displayQuery = q || 'All Items';

  function handleApplyFilters() {
    void navigate({
      search: (prev) => ({ ...prev, page: 1 }),
    });
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setFilters({ categories: [], conditions: [], minPrice: '', maxPrice: '' });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    void navigate({ search: (prev) => ({ ...prev, page }) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSortChange(value: string) {
    setSort(value);
    void navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) });
    setCurrentPage(1);
  }

  const visibleResults = ALL_RESULTS.slice(0, RESULTS_PER_PAGE);
  const totalItems = 124;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <Sidebar
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />

          {/* ── Main ── */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">

            {/* Top bar */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Results for{' '}
                  <span className="text-foreground">"{displayQuery}"</span>
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {totalItems.toLocaleString()} items found
                  {filters.categories.length === 1 && (
                    <> in <span className="font-semibold text-foreground">{filters.categories[0]}</span></>
                  )}
                </p>

                {/* Active filter pills */}
                {(filters.categories.length > 0 || filters.conditions.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {filters.categories.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) }))
                          }
                          className="ml-0.5"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                    {filters.conditions.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setFilters((f) => ({ ...f, conditions: f.conditions.filter((x) => x !== c) }))
                          }
                          className="ml-0.5"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="flex overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center transition-colors',
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center transition-colors',
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleResults.map((item) => (
                  <GridCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visibleResults.map((item) => (
                  <ListCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center">
              <div className="overflow-hidden rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                <Pagination
                  current={currentPage}
                  total={TOTAL_PAGES}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
