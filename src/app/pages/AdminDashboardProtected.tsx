import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminDashboard } from './AdminDashboard';

export function AdminDashboardProtected() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
