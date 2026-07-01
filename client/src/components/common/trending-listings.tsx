import { MoveLeftIcon } from 'lucide-react';
import { ListingCard, type ListingCardProps, type ListingCondition } from './listing-card';

const TRENDING: (Omit<ListingCardProps, 'onBuyNow'> & { id: string })[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5',
    description: 'Barely used, full box with all accessories. Noise cancellation works perfectly.',
    price: 220,
    condition: 'like-new' as ListingCondition,
    seller: 'AudioGearPro',
  },
  {
    id: '2',
    title: 'Canon EF 50mm f/1.4',
    description: 'Sharp prime lens, minor dust inside but no effect on image quality.',
    price: 175,
    condition: 'good' as ListingCondition,
    seller: 'SnapSeller',
  },
  {
    id: '3',
    title: 'MacBook Air M1 (2020)',
    description: '8GB RAM, 256GB SSD. Battery health at 91%. Comes with original charger.',
    price: 680,
    condition: 'good' as ListingCondition,
    seller: 'TechFlip',
  },
  {
    id: '4',
    title: 'Levi\'s 501 Original — W32 L32',
    description: 'Classic straight cut, stonewash blue. Worn twice, washed once.',
    price: 55,
    condition: 'like-new' as ListingCondition,
    seller: 'DenimDepot',
  },
];

export function TrendingListings() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Trending Listings</h2>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All <MoveLeftIcon className="inline-block h-4 w-4 rotate-180" />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {TRENDING.map(({ id, ...props }) => (
          <ListingCard key={id} {...props} />
        ))}
      </div>
    </section>
  );
}
