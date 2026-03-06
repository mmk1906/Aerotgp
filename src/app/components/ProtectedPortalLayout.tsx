import { ProtectedRoute } from '../components/ProtectedRoute';
import { PortalLayout } from '../components/PortalLayout';

export function ProtectedPortalLayout() {
  return (
    <ProtectedRoute>
      <PortalLayout />
    </ProtectedRoute>
  );
}
