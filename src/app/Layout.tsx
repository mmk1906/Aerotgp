import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Starfield } from './components/Starfield';
import { ScrollToTop } from './components/ScrollToTop';
import { memo } from 'react';

// Memoize Starfield to prevent unnecessary re-renders
const MemoizedStarfield = memo(Starfield);

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <MemoizedStarfield />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}