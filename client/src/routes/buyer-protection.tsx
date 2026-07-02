import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ShieldCheck,
  MessageCircle,
  Gavel,
  Flag,
  Info,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/buyer-protection')({
  component: BuyerProtectionPage,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Verified members',
    body: 'Every buyer and seller passes an identity check before they can list or message on FlipIt.',
  },
  {
    icon: MessageCircle,
    title: 'Direct, secure chat',
    body: 'Negotiate price, condition, and payment method directly with the other party — no middleman reading over your shoulder.',
  },
  {
    icon: Gavel,
    title: 'Auction price guarantee',
    body: 'When an auction ends, we guarantee the seller is entitled to the final winning bid. Winners who back out are held accountable.',
  },
  {
    icon: Flag,
    title: 'Report & moderation',
    body: 'Fake listings, abusive messages, or sellers refusing to honor a winning bid can be reported and reviewed by our team.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Browse verified listings',
    body: "Every listing shows the seller's verification badge, item condition, and photos so you know exactly what you're bidding or buying.",
  },
  {
    step: '02',
    title: 'Chat to agree on terms',
    body: "Once you've bought instantly or won an auction, you and the seller connect through FlipIt chat to work out payment method and delivery — on whatever terms suit you both.",
  },
  {
    step: '03',
    title: 'Auction amount is guaranteed',
    body: 'If you win an auction, that price is locked in. FlipIt guarantees the seller is owed that exact amount and can hold you to it.',
  },
  {
    step: '04',
    title: 'Handle payment & shipping yourselves',
    body: "FlipIt doesn't process payments or arrange shipping — you and the other party settle those directly, however works best for you.",
  },
];

const COVERED = [
  'Listings that are fake, counterfeit, or materially misrepresented',
  'A seller refusing to honor the final winning auction bid',
  'A buyer backing out of a won auction without reason',
  'Harassment, scams, or abusive behavior in chat',
  'Fraudulent or impersonated accounts',
];

const NOT_COVERED = [
  "Payment disputes between buyer and seller — FlipIt is not a party to your payment",
  'Lost, delayed, or damaged shipments — FlipIt does not handle or insure shipping',
  "Buyer's remorse after receiving an item as described",
  'Deals or communication that happened outside FlipIt chat',
];

const FAQ = [
  {
    id: 1,
    q: 'Does FlipIt process my payment?',
    a: 'No. FlipIt is a recommerce marketplace where you connect with the other party through chat and settle payment directly, on terms you both agree to. We never hold or process funds on your behalf.',
  },
  {
    id: 2,
    q: 'What does "auction price guarantee" actually mean?',
    a: 'When an auction closes, the winning bid becomes a binding commitment. FlipIt guarantees the seller is entitled to receive that exact amount from the winning bidder, and backing out without reason can affect your account standing.',
  },
  {
    id: 3,
    q: 'Who arranges shipping?',
    a: "You and the other party do, directly. FlipIt does not manage, track, or insure shipments — that's handled entirely between buyer and seller, on whatever courier and terms you agree on in chat.",
  },
  {
    id: 4,
    q: "What happens if a seller won't honor the winning bid?",
    a: 'Report it to us. Our team reviews the auction record and chat history, and sellers who repeatedly refuse to honor winning bids face account penalties, including suspension.',
  },
  {
    id: 5,
    q: 'What if I never hear from the seller after winning?',
    a: 'Give it a reasonable window, then report the listing. Verified sellers are expected to respond to winning bidders — unresponsive accounts get flagged for review.',
  },
  {
    id: 6,
    q: 'Is Buyer Protection free?',
    a: "Yes — verification, auction enforcement, chat, and reporting tools are all included automatically. There's no separate fee or opt-in.",
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

function BuyerProtectionPage() {
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
            Buyer protection
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            Trade directly,
            <br className="hidden lg:block" /> backed by FlipIt.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            FlipIt connects verified buyers and sellers through chat so you
            can settle payment on your own terms. Auction wins are
            guaranteed, listings are moderated, and bad actors get reported —
            even though the deal itself happens between you two.
          </p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="border-b border-border bg-white px-6 py-16 lg:px-20">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
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
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            FlipIt is where you find each other and agree on a price — the
            deal itself happens between you.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {STEPS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3 bg-white p-8">
                <span className="font-mono text-4xl font-black text-muted/80">
                  {step}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              FlipIt does not handle, arrange, or insure shipping. Buyers and
              sellers coordinate delivery directly, on whatever method and
              courier they agree to in chat.
            </p>
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="border-t border-border bg-muted/40 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            What's covered
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6">
              <h3 className="text-sm font-bold text-foreground">Covered</h3>
              <ul className="mt-4 space-y-3">
                {COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-white p-6">
              <h3 className="text-sm font-bold text-foreground">
                Not covered
              </h3>
              <ul className="mt-4 space-y-3">
                {NOT_COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
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
            Still unsure?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact support
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
            Need to report an issue?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Our Trust & Safety team reviews reports within 24 hours.
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
