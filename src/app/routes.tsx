import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Faculty } from './pages/Faculty';
import { Clubs } from './pages/Clubs';
import { ClubDetail } from './pages/ClubDetailNew';
import { Academics } from './pages/Academics';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminDashboardProtected } from './pages/AdminDashboardProtected';
import { ProtectedPortalLayout } from './components/ProtectedPortalLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfileManagement } from './pages/ProfileManagementNew';
import { MyEvents } from './pages/MyEvents';
import { PortalTests } from './pages/PortalTests';
import { MyClubs } from './pages/portal/MyClubs';
import { ProtectedRoute } from './components/ProtectedRoute';

// Updated: 2026-03-08 - Clubs module completely rebuilt with new architecture
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'faculty', Component: Faculty },
      { path: 'clubs', Component: Clubs },
      { path: 'clubs/:slug', Component: ClubDetail },
      { path: 'academics', Component: Academics },
      { path: 'contact', Component: Contact },
      { path: 'events', Component: Events },
      { path: 'gallery', Component: Gallery },
      { path: 'login', Component: Login },
      { path: 'admin', Component: AdminDashboardProtected },
    ],
  },
  {
    path: '/portal',
    Component: ProtectedPortalLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: 'profile', Component: ProfileManagement },
      { path: 'my-events', Component: MyEvents },
      { path: 'my-clubs', Component: MyClubs },
      { path: 'tests', Component: PortalTests },
    ],
  },
]);