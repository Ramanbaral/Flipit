import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Search,
  Package,
  ShoppingCart,
  ShieldCheck,
  CreditCard,
  Truck,
  UserCog,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/help-center')({
  component: HelpCenterPage,
});

const CATEGORIES = [
  { icon: ShoppingCart, name: 'Buying', count: 12 },
  { icon: Package, name: 'Selling', count: 9 },
  { icon: CreditCard, name: 'Payments', count: 7 },
  { icon: Truck, name: 'Shipping', count: 8 },
  { icon: ShieldCheck, name: 'Trust & safety', count: 6 },
  { icon: UserCog, name: 'Account', count: 5 },
];

const ARTICLES = [
  {
    id: 1,
    category: 'Buying',
    q: 'How do I place a bid on an auction?',
    a: 'Open the listing and enter an amount above the current highest bid, then confirm. You\'ll get a notification if you\'re outbid so you can respond before the auction closes.',
  },
  {
    id: 2,
    category: 'Buying',
    q: 'What\'s the difference between auction and instant buy?',
    a: 'Auctions run for a set duration and go to the highest bidder when the timer ends. Instant buy listings sell immediately at a fixed price, no waiting.',
  },
  {
    id: 3,
    category: 'Selling',
    q: 'How do I list an item for sale?',
    a: 'From your dashboard, choose "Create listing," add photos and a description, set your price or starting bid, and publish. Listings typically go live within minutes.',
  },
  {
    id: 4,
    category: 'Selling',
    q: 'What fees does FlipIt charge sellers?',
    a: 'Listing is free. We take a 4% success fee only when your item actually sells — no monthly costs or upfront charges.',
  },
  {
    id: 5,
    category: 'Payments',
    q: 'When do sellers get paid?',
    a: 'Funds are released to the seller once the buyer confirms delivery, or automatically 72 hours after delivery is confirmed by the carrier if no dispute is opened.',
  },
  {
    id: 6,
    category: 'Payments',
    q: 'What payment methods are accepted?',
    a: 'FlipIt accepts major credit and debit cards, plus popular digital wallets. All payments are processed securely and held in escrow until delivery is confirmed.',
  },
  {
    id: 7,
    category: 'Shipping',
    q: 'How long does shipping take?',
    a: 'Sellers are required to dispatch within 48 hours of a sale. Standard delivery takes 3–5 business days; express options are 1–2 days.',
  },
  {
    id: 8,
    category: 'Shipping',
    q: 'Is shipping insured?',
    a: 'Yes, every package is tracked and insured end-to-end at no extra cost. If an item is lost or damaged in transit, you\'re automatically covered.',
  },
  {
    id: 9,
    category: 'Trust & safety',
    q: 'How are sellers verified?',
    a: 'Every seller completes an identity check and track-record review before they can publish their first listing. Verified sellers display a badge on their profile.',
  },
  {
    id: 10,
    category: 'Trust & safety',
    q: 'What do I do if an item isn\'t as described?',
    a: 'Open a dispute within 72 hours of delivery from your order page. Our Trust & Safety team reviews the case and typically resolves it within 24 hours.',
  },
  {
    id: 11,
    category: 'Account',
    q: 'How do I reset my password?',
    a: 'Go to the login page and select "Forgot password." We\'ll send a reset link to your registered email address.',
  },
  {
    id: 12,
    category: 'Account',
    q: 'Can I have both a buyer and seller profile?',
    a: 'Yes, every FlipIt account can buy and sell — there\'s no separate seller registration required.',
  },
];

function ArticleRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}

function HelpCenterPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        !activeCategory || article.category === activeCategory;
      const matchesQuery =
        !query.trim() ||
        article.q.toLowerCase().includes(query.trim().toLowerCase()) ||
        article.a.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero + search ── */}
      <section className="relative overflow-hidden bg-[#060d1a] px-6 py-24 lg:px-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-96 rounded-full bg-indigo-700/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
            Help center
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            How can we help?
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            Search our knowledge base or browse by topic below.
          </p>

          <div className="relative mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="border-b border-border bg-white px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                activeCategory === null
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              )}
            >
              All topics
            </button>
            {CATEGORIES.map(({ icon: Icon, name, count }) => (
              <button
                key={name}
                onClick={() =>
                  setActiveCategory((cur) => (cur === name ? null : name))
                }
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  activeCategory === name
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {name}
                <span
                  className={cn(
                    'text-xs',
                    activeCategory === name
                      ? 'text-white/70'
                      : 'text-muted-foreground/60'
                  )}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            {activeCategory ?? 'All'} articles
            <span className="ml-2 text-base font-medium text-muted-foreground">
              ({filtered.length})
            </span>
          </h2>

          {filtered.length > 0 ? (
            <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-white px-6">
              {filtered.map(({ id, q, a }) => (
                <ArticleRow key={id} q={q} a={a} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No articles match "{query}". Try a different search or{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  contact support
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-[#060d1a] px-6 py-20 text-center lg:px-20">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
            Still stuck?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Our support team replies within one business day.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Contact support
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
