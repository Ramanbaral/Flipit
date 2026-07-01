import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Edit2,
  Eye,
  Package,
  PenLine,
  RotateCcw,
  Store,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

/* ── Types ───────────────────────────────────────────────────────── */

type BidStatus = 'winning' | 'outbid';
type ListingStatus = 'active' | 'ended' | 'draft';
type OrderStatus = 'delivered' | 'processing' | 'shipped';

interface BidItem {
  id: string;
  title: string;
  gradient: string;
  yourBid: number;
  currentBid?: number;
  status: BidStatus;
  endsIn: string;
}

interface ListingItem {
  id: string;
  title: string;
  gradient: string;
  price: number;
  type: 'fixed' | 'auction';
  status: ListingStatus;
  views: number;
  bids?: number;
}

interface PurchaseItem {
  id: string;
  title: string;
  gradient: string;
  price: number;
  date: string;
  status: OrderStatus;
}

/* ── Mock data ───────────────────────────────────────────────────── */

const MY_BIDS: BidItem[] = [
  {
    id: '1',
    title: 'Vintage Leica M3',
    gradient: 'from-slate-500 to-slate-700',
    yourBid: 1250,
    status: 'winning',
    endsIn: '2h 15m',
  },
  {
    id: '2',
    title: "First Edition 'Dune'",
    gradient: 'from-stone-600 to-stone-800',
    yourBid: 450,
    currentBid: 500,
    status: 'outbid',
    endsIn: '5h 40m',
  },
  {
    id: '3',
    title: 'Custom Mechanical Keyboard',
    gradient: 'from-gray-700 to-gray-900',
    yourBid: 185,
    status: 'winning',
    endsIn: '1d 4h',
  },
];

const MY_LISTINGS: ListingItem[] = [
  {
    id: '1',
    title: 'Roland Juno-60 Synthesizer',
    gradient: 'from-teal-400 to-cyan-600',
    price: 2450,
    type: 'auction',
    status: 'active',
    views: 312,
    bids: 12,
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Headphones',
    gradient: 'from-slate-300 to-slate-500',
    price: 220,
    type: 'fixed',
    status: 'active',
    views: 88,
  },
  {
    id: '3',
    title: 'Canon EF 50mm f/1.4 Lens',
    gradient: 'from-amber-400 to-orange-600',
    price: 175,
    type: 'fixed',
    status: 'ended',
    views: 204,
  },
  {
    id: '4',
    title: 'Levi\'s 501 Original Jeans',
    gradient: 'from-blue-500 to-indigo-700',
    price: 55,
    type: 'fixed',
    status: 'draft',
    views: 0,
  },
];

const PURCHASES: PurchaseItem[] = [
  {
    id: '1',
    title: 'MacBook Air M1 (2020)',
    gradient: 'from-gray-200 to-gray-400',
    price: 680,
    date: 'Jun 28, 2026',
    status: 'delivered',
  },
  {
    id: '2',
    title: 'Fujifilm X100V Camera',
    gradient: 'from-stone-400 to-stone-600',
    price: 1100,
    date: 'Jun 21, 2026',
    status: 'shipped',
  },
  {
    id: '3',
    title: 'Vintage Seiko Watch',
    gradient: 'from-amber-200 to-yellow-400',
    price: 340,
    date: 'Jun 14, 2026',
    status: 'delivered',
  },
];

/* ── Stat card ───────────────────────────────────────────────────── */

function StatCard({
  title,
  value,
  sub,
  subIcon: SubIcon,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number | string;
  sub: string;
  subIcon: React.ElementType;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', accent)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-4xl font-extrabold tracking-tight text-foreground">{value}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <SubIcon className="h-3.5 w-3.5 text-primary" />
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ── Status helpers ─────────────────────────────────────────────── */

function BidStatusBadge({ status }: { status: BidStatus }) {
  return status === 'winning' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      Winning
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
      <TriangleAlert className="h-3 w-3" />
      Outbid
    </span>
  );
}

function TimerBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
      Ends in {label}
    </span>
  );
}

function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    ended:  'bg-gray-100 text-gray-500',
    draft:  'bg-amber-100 text-amber-700',
  };
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold capitalize', map[status])}>
      {status}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    delivered:  'bg-emerald-100 text-emerald-700',
    shipped:    'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold capitalize', map[status])}>
      {status}
    </span>
  );
}

/* ── Thumbnail ───────────────────────────────────────────────────── */

function Thumbnail({ gradient, size = 'md' }: { gradient: string; size?: 'sm' | 'md' }) {
  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-xl bg-gradient-to-br',
        gradient,
        size === 'md' ? 'h-14 w-14' : 'h-10 w-10',
      )}
    />
  );
}

/* ── Tab content: My Bids ────────────────────────────────────────── */

function MyBidsTab() {
  return (
    <div className="divide-y divide-border">
      {MY_BIDS.map((item) => (
        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
          <Thumbnail gradient={item.gradient} />

          <div className="min-w-0 flex-1">
            <Link
              to="/listing-detail/$id"
              params={{ id: item.id }}
              className="text-sm font-bold text-foreground no-underline hover:text-primary"
            >
              {item.title}
            </Link>
            <p
              className={cn(
                'mt-0.5 text-xs text-muted-foreground',
                item.status === 'outbid' && 'line-through',
              )}
            >
              Your Bid:{' '}
              <span className="font-semibold">
                ${item.yourBid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </p>
            {item.status === 'outbid' && item.currentBid && (
              <p className="text-xs font-semibold text-foreground">
                Current: ${item.currentBid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <BidStatusBadge status={item.status} />
            {item.status === 'winning' && <TimerBadge label={item.endsIn} />}
            {item.status === 'outbid' && (
              <Button size="sm" className="h-7 rounded-full px-3 text-xs font-bold">
                Increase Bid
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Tab content: My Listings ────────────────────────────────────── */

function MyListingsTab() {
  return (
    <div className="divide-y divide-border">
      {MY_LISTINGS.map((item) => (
        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
          <Thumbnail gradient={item.gradient} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-foreground">{item.title}</span>
              <ListingStatusBadge status={item.status} />
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-xs font-semibold text-foreground">
                ${item.price.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
              {item.type === 'auction' && item.bids !== undefined && (
                <span className="text-xs text-muted-foreground">{item.bids} bids</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {item.views.toLocaleString()} views
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link to="/create-listing" className="no-underline">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
            </Link>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}

      <div className="px-6 py-4">
        <Link to="/create-listing" className="no-underline">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <PenLine className="h-4 w-4" />
            Create new listing
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Tab content: Purchase History ──────────────────────────────── */

function PurchaseHistoryTab() {
  return (
    <div className="divide-y divide-border">
      {PURCHASES.map((item) => (
        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
          <Thumbnail gradient={item.gradient} />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.date}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-sm font-bold text-foreground">
              ${item.price.toLocaleString()}
            </span>
            <OrderStatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'bids' as const,      label: 'My Bids' },
  { id: 'listings' as const,  label: 'My Listings' },
  { id: 'purchases' as const, label: 'Purchase History' },
];

type TabId = (typeof TABS)[number]['id'];

function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('bids');

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Activity Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your bids, listings, and purchases.
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Active Bids"
            value={MY_BIDS.length}
            sub="+3 this week"
            subIcon={TrendingUp}
            icon={ArrowUpRight}
            accent="bg-primary/10 text-primary"
          />
          <StatCard
            title="Active Listings"
            value={MY_LISTINGS.filter((l) => l.status === 'active').length}
            sub="1.2k total views"
            subIcon={Eye}
            icon={Store}
            accent="bg-secondary/10 text-secondary"
          />
          <StatCard
            title="Won Items"
            value={8}
            sub="2 pending payment"
            subIcon={Package}
            icon={Trophy}
            accent="bg-amber-100 text-amber-600"
          />
        </div>

        {/* ── Tabs + Content ── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

          {/* Tab bar */}
          <div className="flex border-b border-border px-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  '-mb-px border-b-2 px-4 py-4 text-sm font-semibold transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'bids'      && <MyBidsTab />}
          {activeTab === 'listings'  && <MyListingsTab />}
          {activeTab === 'purchases' && <PurchaseHistoryTab />}

          {/* Quick nav to listing detail */}
          {activeTab === 'bids' && (
            <div className="border-t border-border px-6 py-3">
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View all bid activity
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="border-t border-border px-6 py-3">
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View full purchase history
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: RotateCcw, label: 'Relist ended items', sub: '1 item eligible' },
            { icon: Package,   label: 'Track shipments',    sub: '1 item in transit' },
            { icon: ArrowUpRight, label: 'Boost listings',  sub: 'Increase visibility' },
          ].map(({ icon: Icon, label, sub }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:bg-muted/40"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
