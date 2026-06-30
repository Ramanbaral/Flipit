import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

const AUTH_PATHS = ['/login', '/signup'];

function RootComponent() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

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
