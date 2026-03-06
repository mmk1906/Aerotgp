import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Starfield } from './components/Starfield';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <Starfield />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}