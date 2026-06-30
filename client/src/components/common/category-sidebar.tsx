import { Car, Flower2, Gem, HelpCircle, Home, Monitor, Settings, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'electronics', label: 'Electronics', icon: Monitor },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'home-garden', label: 'Home & Garden', icon: Flower2 },
  { id: 'collectibles', label: 'Collectibles', icon: Gem },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
];

interface CategorySidebarProps {
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export function CategorySidebar({
  activeCategory = 'home',
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <aside className="flex h-full w-48 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex-1 px-3 py-5">
        <div className="mb-4 px-2">
          <h2 className="text-sm font-bold text-foreground">Categories</h2>
          <p className="text-xs text-muted-foreground">Filter your search</p>
        </div>

        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onCategoryChange?.(id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeCategory === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-4">
        <Button variant="outline" size="sm" className="w-full text-xs">
          Advanced Filters
        </Button>
      </div>

      <div className="flex flex-col gap-0.5 border-t border-sidebar-border px-3 py-3">
        <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <HelpCircle className="h-4 w-4 shrink-0" />
          Help Center
        </button>
        <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </button>
      </div>
    </aside>
  );
}
