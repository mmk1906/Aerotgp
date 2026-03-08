import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  FileText, 
  GraduationCap,
  Plane,
  LogOut,
  Menu,
  X,
  BookOpen,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { Starfield } from './Starfield';
import { ScrollToTop } from './ScrollToTop';

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const portalLinks = [
    { name: 'Dashboard', path: '/portal', icon: LayoutDashboard },
    { name: 'Profile', path: '/portal/profile', icon: User },
    { name: 'My Events', path: '/portal/my-events', icon: Calendar },
    { name: 'My Clubs', path: '/portal/my-clubs', icon: Users },
    { name: 'MCQ Tests', path: '/portal/tests', icon: GraduationCap },
    { name: 'Aero Club', path: '/portal/aero-club', icon: Plane },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Safety check - ProtectedRoute should prevent this, but just in case
  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#0a0e1a]">
      <ScrollToTop />
      <Starfield />
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold">AeroTGP Portal</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Public Site
              </Button>
            </Link>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 280 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0f172a]/95 backdrop-blur-lg border-r border-gray-800 overflow-hidden z-40`}
        >
          <nav className="p-4 space-y-2">
            {portalLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`flex-1 relative z-10 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-[280px]' : ''
          }`}
        >
          <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}