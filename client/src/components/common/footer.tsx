import { Link } from '@tanstack/react-router';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Marketplace: [
    { label: 'Auctions', href: '#' },
    { label: 'Instant buy', href: '#' },
    { label: 'Categories', href: '#' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Trust & safety', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'Help center', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Buyer protection', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-8 py-12">
        <div className="flex gap-16">
          {/* Brand */}
          <div className="w-56 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-extrabold text-primary-foreground">
                  F
                </span>
              </div>
              <span className="text-lg font-extrabold text-foreground">
                Flip<span className="text-primary">It</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The trusted marketplace for premium secondhand goods — bid live or
              buy instantly.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-1 justify-end gap-20">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-sm font-bold text-foreground">{heading}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground no-underline transition-colors hover:text-primary/80"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Account */}
            <div>
              <h3 className="text-sm font-bold text-foreground">Account</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-8 py-4">
          <p className="font-mono text-xs text-muted-foreground">
            © 2026 FlipIt · trusted secondhand marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
