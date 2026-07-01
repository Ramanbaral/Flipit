import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Bell, LogOut, Plus, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Explore', to: '/' as const },
  { label: 'Dashboard', to: '/dashboard' as const },
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({ to: '/search', search: { q: searchQuery.trim() } });
    }
  };

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email ?? '';
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : email.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="flex h-14 items-center gap-4 px-10">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-lg font-extrabold text-foreground no-underline"
        >
          FlipIt
        </Link>

        {/* Nav links */}
        <nav className="flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                'px-3 py-1 text-sm font-medium text-muted-foreground transition-colors no-underline hover:text-foreground'
              )}
              activeProps={{
                className:
                  'text-foreground underline underline-offset-4 decoration-primary',
              }}
              activeOptions={{ exact: link.to === '/' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for treasures..."
              className="h-9 rounded-full pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link to="/create-listing" className="no-underline">
            <Button size="lg" className="rounded-md px-4 text-sm font-semibold">
              Create Listing
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {!loading && user && (
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
          )}

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 focus:outline-none">
                {initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold text-foreground">
                    {fullName ?? 'Account'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void navigate({ to: '/user-profile/$userId', params: { userId: user?.id ?? 'me' } })}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
