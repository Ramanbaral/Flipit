import { Link } from '@tanstack/react-router';
import { Bell, CircleUser, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Explore', to: '/' as const },
  { label: 'Dashboard', to: '/about' as const },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="flex h-14 items-center gap-4 px-10">
        {/* Logo */}
        <Link to="/" className="shrink-0 text-lg font-extrabold text-foreground no-underline">
          FlipIt
        </Link>

        {/* Nav links */}
        <nav className="flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                'px-3 py-1 text-sm font-medium text-muted-foreground transition-colors no-underline hover:text-foreground',
              )}
              activeProps={{ className: 'text-foreground underline underline-offset-4 decoration-primary' }}
              activeOptions={{ exact: link.to === '/' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for treasures..."
              className="h-9 rounded-full pl-9 text-sm"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-lg px-4 text-sm font-semibold">
            Create Listing
          </Button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <CircleUser className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
