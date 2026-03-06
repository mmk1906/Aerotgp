import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Faculty } from './pages/Faculty';
import { Clubs } from './pages/Clubs';
import { Academics } from './pages/Academics';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { JoinAeroClub } from './pages/JoinAeroClub';
import { Blogs } from './pages/Blogs';
import { BlogCreate } from './pages/BlogCreate';
import { BlogView } from './pages/BlogView';
import { PortalLayout } from './components/PortalLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfileManagement } from './pages/ProfileManagement';
import { MyEvents } from './pages/MyEvents';
import { MyBlogs } from './pages/MyBlogs';
import { PortalTests } from './pages/PortalTests';
import { PortalAeroClub } from './pages/PortalAeroClub';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'faculty', Component: Faculty },
      { path: 'clubs', Component: Clubs },
      { path: 'academics', Component: Academics },
      { path: 'contact', Component: Contact },
      { path: 'events', Component: Events },
      { path: 'blogs', Component: Blogs },
      { path: 'blogs/create', Component: BlogCreate },
      { path: 'blogs/edit/:id', Component: BlogCreate },
      { path: 'blogs/:id', Component: BlogView },
      { path: 'login', Component: Login },
      { path: 'admin', Component: AdminDashboard },
      { path: 'join-aero-club', Component: JoinAeroClub },
    ],
  },
  {
    path: '/portal',
    Component: PortalLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: 'profile', Component: ProfileManagement },
      { path: 'my-events', Component: MyEvents },
      { path: 'my-blogs', Component: MyBlogs },
      { path: 'tests', Component: PortalTests },
      { path: 'aero-club', Component: PortalAeroClub },
    ],
  },
]);