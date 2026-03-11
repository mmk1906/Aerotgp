import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminDashboard } from './AdminDashboard';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function AdminDashboardProtected() {
  return (
    <ErrorBoundary>
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}