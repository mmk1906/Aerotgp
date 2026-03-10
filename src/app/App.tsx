import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { initializeErrorHandlers } from './utils/errorHandlers';

// Updated: 2026-03-10 - Added global error handlers
export default function App() {
  useEffect(() => {
    // Initialize global error handlers
    initializeErrorHandlers();
  }, []);

  return <RouterProvider router={router} />;
}