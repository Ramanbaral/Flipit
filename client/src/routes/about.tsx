import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronDown, ShieldCheck, Zap, Leaf, BadgeCheck, Truck, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

const STATS = [
  { value: '240K+', label: 'Active traders' },
  { value: '$4.2M', label: 'Items sold' },
  { value: '98%', label: 'Satisfaction rate' },
  { value: '< 6 hrs', label: 'Avg. time to first bid' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'List your item',
    body: 'Snap a few photos, write a short description, and choose between auction or instant buy. Listing takes under two minutes.',
  },
  {
    step: '02',
    title: 'We verify it',
    body: 'Our team checks condition, authenticity, and pricing to make sure buyers get exactly what they expect — no surprises.',
  },
  {
    step: '03',
    title: 'Get paid fast',
    body: 'Once your item sells, funds hit your account within 24 hours. No hidden fees, no waiting around.',
  },
];

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Verified-seller badges',
    body: 'Every seller goes through identity and track-record checks before earning a verified badge.',
  },
  {
    icon: ShieldCheck,
    title: 'Buyer protection',
    body: "If an item isn't as described, we'll make it right — full refund, no questions asked.",
  },
  {
    icon: Zap,
    title: 'Live bidding',
    body: 'Real-time auction engine with instant bid confirmation. No stale refreshes, no lost wins.',
  },
  {
    icon: Leaf,
    title: 'Circular economy',
    body: 'Every transaction keeps a product in use longer, cutting landfill waste and carbon footprint.',
  },
  {
    icon: Truck,
    title: 'Insured shipping',
    body: 'Every parcel is fully insured and tracked end-to-end. If it gets lost, you get refunded.',
  },
  {
    icon: Headphones,
    title: 'Human support',
    body: 'A real person — not a bot — responds to every dispute within 4 business hours.',
  },
];

const FAQ = [
  {
    id: 1,
    q: 'What makes FlipIt different from other secondhand platforms?',
    a: 'We combine live auctions with instant-buy listings in one place, and every seller is identity-verified before they can list. That means less scam risk, faster sales, and a more consistent buyer experience.',
  },
  {
    id: 2,
    q: 'How does the auction process work?',
    a: "Sellers set a starting price and a duration (1–7 days). Buyers place bids in real time. When the timer hits zero, the highest bidder wins and payment is collected automatically. You'll receive a confirmation email within seconds.",
  },
  {
    id: 3,
    q: 'What are the seller fees?',
    a: "Listing is always free. We charge a 4% success fee only when your item sells — no monthly subscriptions, no upfront costs. For high-volume sellers, volume discounts kick in automatically.",
  },
  {
    id: 4,
    q: 'How long does shipping take?',
    a: 'Sellers dispatch within 48 hours of a sale. Standard delivery is 3–5 business days; express is 1–2. All packages come with full tracking and insurance included at no extra cost.',
  },
  {
    id: 5,
    q: "What if the item I receive doesn't match the listing?",
    a: "Open a dispute within 72 hours of delivery. Our team reviews photos and listing details and resolves most cases in under 24 hours. If the item is misrepresented, you get a full refund — including original shipping.",
  },
];

function FAQRow({ q, a }: { q: string; a: string }) {
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
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#060d1a] px-6 py-24 lg:px-20">
        {/* grid */}
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
        {/* glows */}
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-96 rounded-full bg-indigo-700/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
            About FlipIt
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            The marketplace built<br className="hidden lg:block" /> on trust.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            FlipIt started with a simple idea: buying and selling secondhand goods
            should feel as safe and smooth as buying new. We built the infrastructure
            to make that real — verified sellers, live auctions, and human support.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Start selling
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-border bg-white px-6 py-12 lg:px-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            How FlipIt works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            From listing to payout in three straightforward steps.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-4 bg-white p-8">
                <span className="font-mono text-4xl font-black text-muted/80">
                  {step}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border bg-muted/40 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Everything you'd expect — and then some
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sweat the details so buyers and sellers don't have to.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission callout ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-10 ring-1 ring-border lg:p-14">
            <p className="max-w-2xl text-2xl font-extrabold leading-snug tracking-tight text-foreground lg:text-3xl">
              "Every product bought secondhand is one that didn't need to be manufactured. That matters."
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              We're working toward a world where circular commerce is the default,
              not the exception. FlipIt donates 1% of gross revenue to verified
              climate-action nonprofits each year.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Common questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Can't find what you need?{' '}
            <a href="#" className="text-primary hover:underline">
              Contact support
            </a>
            .
          </p>

          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-background px-6">
            {FAQ.map(({ id, q, a }) => (
              <FAQRow key={id} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-[#060d1a] px-6 py-20 text-center lg:px-20">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
            Ready to trade?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Join 240,000+ buyers and sellers who've already made FlipIt their
            go-to marketplace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Create free account
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              Explore listings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
