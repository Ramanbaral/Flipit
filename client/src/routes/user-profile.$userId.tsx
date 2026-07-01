import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/user-profile/$userId')({
  component: UserProfilePage,
});

/* ── Types ───────────────────────────────────────────────────────── */

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalListings: number;
  responseRate: number;
}

interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  type: 'buyer' | 'seller';
}

interface RecentListing {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'sold';
  gradient: string;
}

/* ── Mock data ───────────────────────────────────────────────────── */

const INITIAL_PROFILE: ProfileData = {
  name: 'Alex Thorne',
  username: 'alex.thorne',
  bio: "Passionate entrepreneur and tech enthusiast. I've been trading high-end electronics and collectibles on FlipIt for over 3 years. Always looking for unique finds and fair deals. I take extra care with packaging and ship within 24 hours.",
  email: 'alex.thorne@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  joinedDate: 'March 2021',
  verified: true,
  rating: 4.9,
  reviewCount: 128,
  totalSales: 87,
  totalListings: 12,
  responseRate: 98,
};

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    author: 'Jordan M.',
    initials: 'JM',
    rating: 5,
    text: 'Incredible seller. Item was exactly as described, super fast shipping with excellent packaging. Would buy from again without hesitation.',
    date: 'Jun 18, 2026',
    type: 'buyer',
  },
  {
    id: '2',
    author: 'Priya K.',
    initials: 'PK',
    rating: 5,
    text: 'Very responsive, honest about the condition, and the camera arrived in perfect shape. This is what great selling looks like.',
    date: 'May 30, 2026',
    type: 'buyer',
  },
  {
    id: '3',
    author: 'Marcus L.',
    initials: 'ML',
    rating: 4,
    text: 'Good transaction overall. Minor delay in dispatch but communicated proactively. Item matched listing perfectly.',
    date: 'May 12, 2026',
    type: 'buyer',
  },
];

const RECENT_LISTINGS: RecentListing[] = [
  { id: '1', title: 'Roland Juno-60 Synthesizer',   price: 2450, status: 'active', gradient: 'from-teal-400 to-cyan-600'    },
  { id: '2', title: 'Leica M3 Chrome Rangefinder',   price: 1450, status: 'sold',   gradient: 'from-zinc-300 to-zinc-600'    },
  { id: '3', title: 'Canon AE-1 Program 35mm SLR',   price: 225,  status: 'sold',   gradient: 'from-slate-300 to-slate-500'  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'h-4 w-4' : 'h-3 w-3';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(sz, i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200')}
        />
      ))}
    </div>
  );
}

/* ── Editable field ──────────────────────────────────────────────── */

function EditField({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const base =
    'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30';
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, 'resize-none')}
        />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </div>
  );
}

/* ── Avatar ──────────────────────────────────────────────────────── */

function Avatar({
  initials,
  editing,
  onUpload,
}: {
  initials: string;
  editing: boolean;
  onUpload?: () => void;
}) {
  return (
    <div className="relative">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-extrabold text-white shadow-lg ring-4 ring-white">
        {initials}
      </div>
      {/* online dot */}
      <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      {editing && (
        <button
          type="button"
          onClick={onUpload}
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity hover:opacity-100"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

function UserProfilePage() {
  const { userId } = Route.useParams();
  const isOwnProfile = userId === 'me' || userId === '1';

  const [profile, setProfile]   = useState<ProfileData>(INITIAL_PROFILE);
  const [draft,   setDraft]     = useState<ProfileData>(INITIAL_PROFILE);
  const [editing, setEditing]   = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'listings'>('reviews');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function startEditing() {
    setDraft({ ...profile });
    setEditing(true);
  }

  function cancelEditing() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function saveEditing() {
    setProfile({ ...draft });
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-8">

        {/* ── Hero card ── */}
        <div className="relative overflow-hidden rounded-3xl shadow-sm">
          {/* Banner */}
          <div
            className="h-40 w-full"
            style={{
              background:
                'linear-gradient(135deg, #0037b0 0%, #0060c7 40%, #006591 75%, #0a8b6e 100%)',
            }}
          >
            {/* subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* White lower half */}
          <div className="bg-white px-6 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar (overlaps banner) */}
              <div className="-mt-12">
                <Avatar initials={initials} editing={editing} onUpload={() => fileInputRef.current?.click()} />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pb-1">
                {isOwnProfile && !editing && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                )}
                {editing && (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveEditing}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </button>
                  </>
                )}
                {!isOwnProfile && (
                  <Button className="rounded-full px-5 font-bold">Follow</Button>
                )}
              </div>
            </div>

            {/* Name + meta */}
            <div className="mt-3">
              {editing ? (
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full max-w-xs rounded-xl border border-border bg-background px-3 py-1.5 text-xl font-extrabold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              )}

              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>@{profile.username}</span>
                <span>·</span>
                <span>Joined {profile.joinedDate}</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Stars rating={profile.rating} />
                  <span className="font-semibold text-amber-600">{profile.rating}</span>
                  <span className="text-muted-foreground">({profile.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">{profile.totalSales}</span>
            <span className="text-xs font-medium text-muted-foreground">Completed Sales</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">{profile.totalListings}</span>
            <span className="text-xs font-medium text-muted-foreground">Active Listings</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">{profile.responseRate}%</span>
            <span className="text-xs font-medium text-muted-foreground">Response Rate</span>
          </div>
        </div>

        {/* ── About + Contact ── */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
          {/* About */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-extrabold text-foreground">About</h2>
            <div className="mt-4">
              {editing ? (
                <EditField
                  label="Bio"
                  value={draft.bio}
                  onChange={(v) => setDraft({ ...draft, bio: v })}
                  multiline
                />
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Trust badges */}
            {!editing && (
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: CheckCircle2, label: 'ID Verified',       color: 'text-emerald-600 bg-emerald-50'   },
                  { icon: ShieldCheck,  label: 'Buyer Protection',   color: 'text-blue-600 bg-blue-50'         },
                  { icon: Star,         label: 'Top Seller',         color: 'text-amber-600 bg-amber-50'       },
                ].map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                      color,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-extrabold text-foreground">Contact Info</h2>

            {editing ? (
              <div className="mt-4 flex flex-col gap-4">
                <EditField
                  label="Email"
                  value={draft.email}
                  onChange={(v) => setDraft({ ...draft, email: v })}
                  type="email"
                />
                <EditField
                  label="Phone"
                  value={draft.phone}
                  onChange={(v) => setDraft({ ...draft, phone: v })}
                  type="tel"
                />
                <EditField
                  label="Location"
                  value={draft.location}
                  onChange={(v) => setDraft({ ...draft, location: v })}
                />
              </div>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {[
                  { icon: Mail,  value: profile.email,    href: `mailto:${profile.email}` },
                  { icon: Phone, value: profile.phone,    href: `tel:${profile.phone}`    },
                  { icon: MapPin, value: profile.location, href: undefined                 },
                ].map(({ icon: Icon, value, href }) => (
                  <li key={value} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-foreground hover:text-primary hover:underline">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Tabs: Reviews / Listings ── */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {/* Tab bar */}
          <div className="flex border-b border-border px-4">
            {(['reviews', 'listings'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  '-mb-px border-b-2 px-5 py-4 text-sm font-semibold capitalize transition-colors',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab === 'reviews' ? `Reviews (${profile.reviewCount})` : 'Recent Listings'}
              </button>
            ))}
          </div>

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="divide-y divide-border">
              {/* Summary row */}
              <div className="flex items-center gap-8 px-6 py-5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-foreground">
                    {profile.rating}
                  </span>
                  <Stars rating={profile.rating} size="md" />
                  <span className="text-xs text-muted-foreground">{profile.reviewCount} reviews</span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 82 : star === 4 ? 12 : star === 3 ? 4 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-4 text-right text-xs text-muted-foreground">{star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual reviews */}
              {REVIEWS.map((review) => (
                <div key={review.id} className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-foreground">
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{review.author}</span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground capitalize">
                            {review.type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <Stars rating={review.rating} />
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Listings */}
          {activeTab === 'listings' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {RECENT_LISTINGS.map((listing) => (
                  <Link
                    key={listing.id}
                    to="/listing-detail/$id"
                    params={{ id: listing.id }}
                    className="group overflow-hidden rounded-xl border border-border no-underline transition-shadow hover:shadow-md"
                  >
                    {/* Image */}
                    <div className={cn('relative h-36 bg-gradient-to-br', listing.gradient)}>
                      {listing.status === 'sold' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-foreground">
                            SOLD
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="bg-white p-3">
                      <p className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary">
                        {listing.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-foreground">
                          ${listing.price.toLocaleString()}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link to="/dashboard" className="text-sm font-semibold text-primary hover:underline no-underline">
                  View all listings in dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
