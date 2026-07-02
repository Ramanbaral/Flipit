import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ShieldCheck,
  BadgeCheck,
  MessageCircleWarning,
  Gavel,
  Eye,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/trust-and-safety')({
  component: TrustAndSafetyPage,
});

const PRINCIPLES = [
  {
    icon: BadgeCheck,
    title: 'Identity verification',
    body: 'Every account is verified before it can list an item, place a bid, or message another user. Verified accounts carry a visible badge.',
  },
  {
    icon: Eye,
    title: 'Listing review',
    body: 'Listings are screened for prohibited items, misleading descriptions, and stolen or counterfeit goods before they go live.',
  },
  {
    icon: Gavel,
    title: 'Auction integrity',
    body: 'Bid histories are monitored for shill bidding and manipulation. Winning bids are enforced — sellers are guaranteed that amount.',
  },
  {
    icon: MessageCircleWarning,
    title: 'Chat moderation',
    body: 'In-app chat is monitored for scam patterns, harassment, and attempts to move deals off-platform to avoid accountability.',
  },
];

const SAFETY_TIPS = [
  {
    title: 'Keep conversations on FlipIt',
    body: "Chat, negotiate, and confirm details inside the app. If a deal goes wrong, we can only review what happened on FlipIt — we have no visibility into off-platform messages or side deals.",
  },
  {
    title: 'Verify before you commit',
    body: "Check the other party's verification badge, account age, and past listing or bidding history before agreeing to a deal.",
  },
  {
    title: 'Be cautious with payment requests',
    body: "FlipIt never processes payment for you, so treat any payment request the same way you would with a stranger — confirm identity, use traceable methods, and be wary of pressure to pay unusual ways (gift cards, wire transfers, crypto).",
  },
  {
    title: 'Agree on delivery terms clearly',
    body: 'Since shipping is arranged directly between you and the other party, put the courier, tracking, and timeline in writing over chat before anything ships.',
  },
  {
    title: 'Report early, not after the fact',
    body: "If something feels off — vague answers, pressure to rush, requests to leave the app — report it right away rather than after money has changed hands.",
  },
];

const ENFORCEMENT = [
  'Warning issued for a first minor violation',
  'Listing removal for prohibited or misleading items',
  'Temporary suspension for repeated policy violations',
  'Permanent ban for fraud, harassment, or refusing to honor a winning bid',
];

const FAQ = [
  {
    id: 1,
    q: 'How does FlipIt verify accounts?',
    a: "New accounts go through an identity check before they can list items or message other users. This reduces fake accounts and makes every interaction traceable to a real, verified person.",
  },
  {
    id: 2,
    q: 'What happens when I report a user or listing?',
    a: "Our Trust & Safety team reviews the listing details, auction record, and chat history within 24 hours and takes action ranging from a warning to a permanent ban, depending on severity.",
  },
  {
    id: 3,
    q: "Can FlipIt see my chat messages?",
    a: "Chat is monitored for policy violations like scam patterns, harassment, and off-platform payment requests. It exists to keep both parties accountable and safe, and is reviewed if a report is filed.",
  },
  {
    id: 4,
    q: 'What items are prohibited?',
    a: 'Stolen goods, counterfeit items, weapons, hazardous materials, and anything illegal to sell in your region are not allowed. Listings that violate this are removed and the account is reviewed.',
  },
  {
    id: 5,
    q: 'How is this different from Buyer Protection?',
    a: "Trust & Safety covers platform-wide integrity — verification, moderation, and enforcement. Buyer Protection is specifically about what happens when your individual purchase or auction goes wrong.",
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

function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
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
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-3 w-3" />
            Trust & Safety
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            A marketplace
            <br className="hidden lg:block" /> built on accountability.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            FlipIt connects real, verified people to trade directly. Since
            you settle payment and shipping on your own terms, we focus
            everything we control — verification, listing quality, auction
            integrity, and moderation — on keeping that trade honest.
          </p>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="border-b border-border bg-white px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            What we enforce
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety tips ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Trading safely, since deals are direct
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            FlipIt gets you to a verified, trustworthy match — these habits
            keep the deal itself safe too.
          </p>

          <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-white">
            {SAFETY_TIPS.map(({ title, body }, i) => (
              <div key={title} className="flex gap-5 p-6">
                <span className="font-mono text-2xl font-black text-muted/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enforcement ── */}
      <section className="border-t border-border bg-muted/40 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-10 ring-1 ring-border lg:p-14">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
                Enforcement
              </h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Violations are handled proportionally, escalating with
              severity and repetition.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ENFORCEMENT.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
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
            Curious about a specific purchase or auction?{' '}
            <Link to="/buyer-protection" className="text-primary hover:underline">
              See Buyer Protection
            </Link>
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
            Spotted something wrong?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Report it and our team reviews it within 24 hours.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Report an issue
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
