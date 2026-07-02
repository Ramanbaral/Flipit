import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Rocket,
  HeartHandshake,
  Globe2,
  Sparkles,
  Code2,
  Megaphone,
  Headset,
  ShieldCheck,
} from 'lucide-react';

export const Route = createFileRoute('/careers')({
  component: CareersPage,
});

const VALUES = [
  {
    icon: Rocket,
    title: 'Move with purpose',
    body: 'We ship fast and own outcomes. Small team, real impact — every release reaches hundreds of thousands of traders.',
  },
  {
    icon: HeartHandshake,
    title: 'Trust is the product',
    body: "Buyers and sellers stake real money on us getting it right. We build like that trust is the whole business, because it is.",
  },
  {
    icon: Globe2,
    title: 'Remote-first, always',
    body: 'Work from wherever you do your best thinking. We hire across time zones and meet in the overlap.',
  },
];

const DEPARTMENTS = [
  {
    icon: Code2,
    name: 'Engineering',
    roles: [
      { title: 'Senior Backend Engineer', location: 'Remote', type: 'Full-time' },
      { title: 'Frontend Engineer, React', location: 'Remote', type: 'Full-time' },
      { title: 'Real-time Systems Engineer', location: 'Remote', type: 'Full-time' },
    ],
  },
  {
    icon: ShieldCheck,
    name: 'Trust & Safety',
    roles: [
      { title: 'Seller Verification Lead', location: 'Remote', type: 'Full-time' },
      { title: 'Fraud Analyst', location: 'Remote', type: 'Contract' },
    ],
  },
  {
    icon: Megaphone,
    name: 'Marketing',
    roles: [
      { title: 'Growth Marketing Manager', location: 'Remote', type: 'Full-time' },
    ],
  },
  {
    icon: Headset,
    name: 'Support',
    roles: [
      { title: 'Customer Support Specialist', location: 'Remote', type: 'Full-time' },
    ],
  },
];

const BENEFITS = [
  'Fully remote, flexible hours',
  'Equity for every full-time hire',
  'Health coverage stipend',
  'Annual team offsite',
  '1% of revenue to climate nonprofits',
  'Home office setup budget',
];

function CareersPage() {
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
            <Sparkles className="h-3 w-3" />
            We're hiring
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            Help build the future
            <br className="hidden lg:block" /> of secondhand trade.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            We're a small, remote-first team building the marketplace we
            wished existed. If you care about trust, craft, and shipping
            things that matter — we'd love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#open-roles"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              View open roles
            </a>
            <Link
              to="/about"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              Learn about FlipIt
            </Link>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-b border-border bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            How we work
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A few things that stay true no matter how big we get.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-10 ring-1 ring-border lg:p-14">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
              Benefits & perks
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Open roles ── */}
      <section
        id="open-roles"
        className="border-t border-border bg-muted/40 px-6 py-20 lg:px-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Open roles
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't see the right fit?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Reach out anyway
            </Link>
            .
          </p>

          <div className="mt-10 space-y-10">
            {DEPARTMENTS.map(({ icon: Icon, name, roles }) => (
              <div key={name}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-foreground">{name}</h3>
                </div>
                <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
                  {roles.map((role) => (
                    <a
                      key={role.title}
                      href="#"
                      className="flex flex-col gap-1 p-5 no-underline transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {role.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {role.location} · {role.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-[#060d1a] px-6 py-20 text-center lg:px-20">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
            Don't see your role?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            We're always open to hearing from people who believe in what
            we're building. Send us a note anyway.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Get in touch
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
