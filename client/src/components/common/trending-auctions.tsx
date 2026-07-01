import { MoveLeftIcon } from 'lucide-react';
import { AuctionCard, type AuctionCardProps } from './auction-card';

const TRENDING: (Omit<AuctionCardProps, 'onBidNow'> & { id: string })[] = [
  {
    id: '1',
    timer: '04:12:30',
    title: 'Vintage Leica M3',
    description:
      'Pristine condition, recently serviced. Includes original leather case.',
    currentBid: 1250,
  },
  {
    id: '2',
    timer: '12:45:00',
    title: "Fender Stratocaster '89",
    description: 'Midnight blue, minor wear on fretboard. Sounds incredible.',
    currentBid: 850,
  },
  {
    id: '2',
    timer: '12:45:00',
    title: "Fender Stratocaster '89",
    description: 'Midnight blue, minor wear on fretboard. Sounds incredible.',
    currentBid: 850,
  },
  {
    id: '2',
    timer: '12:45:00',
    title: "Fender Stratocaster '89",
    description: 'Midnight blue, minor wear on fretboard. Sounds incredible.',
    currentBid: 850,
  },
];

export function TrendingAuctions() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Trending Auctions</h2>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All <MoveLeftIcon className="inline-block h-4 w-4 rotate-180" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {TRENDING.map(({ id, ...props }) => (
          <AuctionCard key={id} {...props} />
        ))}
      </div>
    </section>
  );
}
