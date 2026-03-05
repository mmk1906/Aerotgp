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
      { path: 'login', Component: Login },
      { path: 'admin', Component: AdminDashboard },
      { path: 'join-aero-club', Component: JoinAeroClub },
    ],
  },
]);
