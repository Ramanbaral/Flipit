import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@flipit.com',
    href: 'mailto:contact@flipit.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+977 9803066408',
    href: 'tel: 041687123',
  },
  {
    icon: MessageCircle,
    label: 'Live chat',
    value: 'Available in-app, 9am–5pm NPT',
    href: '#',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Anamnagar, Kathmandu, Nepal',
    href: '#',
  },
];

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Please pick a topic'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SUBJECTS = [
  'General inquiry',
  'Careers',
  'Buyer support',
  'Seller support',
  'Trust & safety',
  'Press',
];

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    // No backend wiring yet — simulate a submit so the form is usable end-to-end.
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('Contact form submitted:', data);
    toast.success("Message sent — we'll get back to you soon.");
    reset();
  };

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
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
            Contact us
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
            We'd love to
            <br className="hidden lg:block" /> hear from you.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            Questions about buying, selling, or joining the team — reach out
            any way that's convenient. A real person replies within one
            business day.
          </p>
        </div>
      </section>

      {/* ── Contact methods ── */}
      <section className="border-b border-border bg-white px-6 py-16 lg:px-20">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="rounded-xl border border-border bg-white p-6 no-underline shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-foreground">
                {label}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {value}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form + hours ── */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill this out and we'll route it to the right team.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={cn(
                      'mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary',
                      errors.name && 'border-destructive'
                    )}
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={cn(
                      'mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary',
                      errors.email && 'border-destructive'
                    )}
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="text-sm font-semibold text-foreground"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  {...register('subject')}
                  className={cn(
                    'mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary',
                    errors.subject && 'border-destructive'
                  )}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a topic
                  </option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message')}
                  className={cn(
                    'mt-1.5 w-full resize-none rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary',
                    errors.message && 'border-destructive'
                  )}
                  placeholder="How can we help?"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>

          {/* Hours / side info */}
          <div className="h-fit rounded-xl border border-border bg-muted/40 p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Support hours
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Monday–Friday, 9am–5pm NPT. Messages sent outside these hours are
              answered the next business day.
            </p>
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-bold text-foreground">
                Looking to join the team?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Check our open roles instead.
              </p>
              <Link
                to="/careers"
                className="mt-3 inline-block text-sm font-semibold text-primary no-underline hover:underline"
              >
                View careers →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
