import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CategorySidebar } from '@/components/common/category-sidebar';
import { HomeBanner } from '@/components/common/home-banner';
import { TrendingAuctions } from '@/components/common/trending-auctions';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('home');

  return (
    <div className="flex flex-1">
      <div className="sticky top-14 h-[calc(100vh-56px)] self-start overflow-hidden">
        <CategorySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <HomeBanner />
          <TrendingAuctions />
        </div>
      </main>
    </div>
  );
}
