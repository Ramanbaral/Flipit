import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair';

export interface ListingCardProps {
  image?: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  seller: string;
  onBuyNow?: () => void;
}

const CONDITION_STYLES: Record<ListingCondition, string> = {
  'new': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'like-new': 'bg-blue-100 text-blue-700 border-blue-200',
  'good': 'bg-amber-100 text-amber-700 border-amber-200',
  'fair': 'bg-gray-100 text-gray-600 border-gray-200',
};

const CONDITION_LABELS: Record<ListingCondition, string> = {
  'new': 'New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
};

export function ListingCard({
  image,
  title,
  description,
  price,
  condition,
  seller,
  onBuyNow,
}: ListingCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative h-44 bg-muted">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-400" />
        )}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-semibold',
              CONDITION_STYLES[condition],
            )}
          >
            {CONDITION_LABELS[condition]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-1 flex items-center gap-1">
          <ShoppingBag className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{seller}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Price
            </p>
            <p className="text-xl font-bold text-foreground">
              ${price.toLocaleString()}
            </p>
          </div>
          <Button onClick={onBuyNow} className="shrink-0 rounded-lg">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
