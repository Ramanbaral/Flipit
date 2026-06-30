import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
