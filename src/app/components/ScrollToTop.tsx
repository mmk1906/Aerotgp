import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame to avoid blocking the main thread
    const scrollTimeout = requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    });

    return () => {
      cancelAnimationFrame(scrollTimeout);
    };
  }, [pathname]);

  return null;
}