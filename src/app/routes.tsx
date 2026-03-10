import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
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
import { MyClubsEnhanced } from './pages/portal/MyClubsEnhanced';
import { PortalAnnouncements } from './pages/portal/Announcements';
import { ActivityHistory } from './pages/portal/ActivityHistory';
import { ProtectedRoute } from './components/ProtectedRoute';
import React from 'react';

// Error Boundary Component
function ErrorBoundary({ error }: { error: Error }) {
  console.error('Router Error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

// Updated: 2026-03-09 - Cleaned up portal routes, removed unused sections
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary error={new Error('Page not found')} />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'faculty', element: <Faculty /> },
          { path: 'clubs', element: <Clubs /> },
          { path: 'clubs/:slug', element: <ClubDetail /> },
          { path: 'academics', element: <Academics /> },
          { path: 'contact', element: <Contact /> },
          { path: 'events', element: <Events /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'login', element: <Login /> },
          { path: 'admin', element: <AdminDashboardProtected /> },
        ],
      },
      {
        path: '/portal',
        element: <ProtectedPortalLayout />,
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: 'profile', element: <ProfileManagement /> },
          { path: 'my-events', element: <MyEvents /> },
          { path: 'my-clubs', element: <MyClubsEnhanced /> },
          { path: 'tests', element: <PortalTests /> },
          { path: 'announcements', element: <PortalAnnouncements /> },
          { path: 'activity-history', element: <ActivityHistory /> },
        ],
      },
    ],
  },
]);