import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AuctionCardProps {
  image?: string;
  timer: string;
  title: string;
  description: string;
  currentBid: number;
  onBidNow?: () => void;
}

export function AuctionCard({
  image,
  timer,
  title,
  description,
  currentBid,
  onBidNow,
}: AuctionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative h-44 bg-muted">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1">
          <Clock className="h-3 w-3 text-primary-foreground" />
          <span className="font-mono text-xs font-semibold text-primary-foreground">
            {timer}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Current Bid
            </p>
            <p className="text-xl font-bold text-foreground">
              ${currentBid.toLocaleString()}
            </p>
          </div>
          <Button onClick={onBidNow} className="shrink-0 rounded-lg">
            Bid Now
          </Button>
        </div>
      </div>
    </div>
  );
}
