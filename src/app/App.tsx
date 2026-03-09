import { RouterProvider } from 'react-router';
import { router } from './routes';

// Updated: 2026-03-09 - AuthProvider now inside router via RootLayout
export default function App() {
  return <RouterProvider router={router} />;
}