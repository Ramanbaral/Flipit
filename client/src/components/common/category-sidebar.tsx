import { useState } from 'react';
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Gem,
  HelpCircle,
  Home,
  Monitor,
  Settings,
  Shirt,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'home', label: 'Home', icon: Home, count: null },
  { id: 'electronics', label: 'Electronics', icon: Monitor, count: 284 },
  { id: 'fashion', label: 'Fashion', icon: Shirt, count: 512 },
  { id: 'home-garden', label: 'Home & Garden', icon: Flower2, count: 173 },
  { id: 'collectibles', label: 'Collectibles', icon: Gem, count: 96 },
  { id: 'vehicles', label: 'Vehicles', icon: Car, count: 41 },
];

const UTILITIES = [
  { icon: HelpCircle, label: 'Help Center' },
  { icon: Settings, label: 'Settings' },
];

interface CategorySidebarProps {
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export function CategorySidebar({
  activeCategory = 'home',
  onCategoryChange,
}: CategorySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-52',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b border-sidebar-border px-3 py-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Categories
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/60">
              Filter your search
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Category nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map(({ id, label, icon: Icon, count }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => onCategoryChange?.(id)}
                className={cn(
                  'group relative flex w-full items-center rounded-md transition-all duration-150',
                  collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'shrink-0 transition-transform duration-150',
                    collapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4',
                    isActive && !collapsed && 'drop-shadow-sm',
                  )}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium leading-none">
                      {label}
                    </span>
                    {count != null && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                          isActive
                            ? 'bg-white/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip in collapsed mode */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {label}
                    {count != null && (
                      <span className="ml-1.5 opacity-60">{count}</span>
                    )}
                    <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-foreground" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Advanced Filters */}
      <div
        className={cn(
          'border-t border-sidebar-border px-2 py-3',
          collapsed && 'flex justify-center',
        )}
      >
        {collapsed ? (
          <button
            title="Advanced Filters"
            className="group relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Advanced Filters
              <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-foreground" />
            </span>
          </button>
        ) : (
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Advanced Filters
          </Button>
        )}
      </div>

      {/* Utility links */}
      <div
        className={cn(
          'border-t border-sidebar-border px-2 py-3',
          collapsed ? 'flex flex-col items-center gap-1' : 'flex flex-col gap-0.5',
        )}
      >
        {UTILITIES.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={collapsed ? label : undefined}
            className={cn(
              'group relative flex items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
              collapsed ? 'h-9 w-9 justify-center' : 'w-full gap-2.5 px-3 py-2',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
            {collapsed && (
              <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
                <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-foreground" />
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
