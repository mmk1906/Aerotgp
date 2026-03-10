import { Outlet } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" />
      </AuthProvider>
    </ErrorBoundary>
  );
}