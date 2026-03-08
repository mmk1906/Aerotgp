import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Bell,
  Rocket
} from 'lucide-react';
import { 
  getCollection, 
  getAllEvents,
  EventRegistration,
  Event
} from '../services/databaseService';

export function StudentDashboard() {
  const { user } = useAuth();
  const [myRegistrations, setMyRegistrations] = useState<EventRegistration[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load registrations from Firebase
      const allRegistrations = await getCollection<EventRegistration>('registrations');
      const userRegistrations = allRegistrations.filter(r => r.userId === user?.id);
      setMyRegistrations(userRegistrations);

      // Load test attempts from localStorage (not yet in Firebase)
      const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
      setTestAttempts(attempts.filter((a: any) => a.studentEmail === user?.email));

      // Load upcoming events
      const events = await getAllEvents();
      const upcoming = events
        .filter((event) => new Date(event.date) > new Date() && event.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setUpcomingEvents(upcoming);

      // Generate notifications based on real data
      const newNotifications = [];
      
      if (userRegistrations.some(r => r.status === 'approved')) {
        newNotifications.push({
          id: 'reg-approved',
          type: 'event',
          message: 'Your event registration was approved',
          time: 'Recently',
        });
      }

      if (upcoming.length > 0) {
        newNotifications.push({
          id: 'upcoming-event',
          type: 'event',
          message: `Upcoming: ${upcoming[0].title}`,
          time: new Date(upcoming[0].date).toLocaleDateString(),
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Events Registered',
      value: myRegistrations.length,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Tests Completed',
      value: testAttempts.length,
      icon: GraduationCap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Average Score',
      value: testAttempts.length > 0
        ? `${Math.round(testAttempts.reduce((sum, a) => sum + a.score, 0) / testAttempts.length)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100">
            Here's your activity overview. Keep up the great work!
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <Badge variant={event.isPaid ? 'default' : 'secondary'}>
                            {event.isPaid ? `₹${event.price}` : 'Free'}
                          </Badge>
                        </div>
                      </div>
                      <Link to="/portal/my-events">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Link to="/events">
                  <Button variant="outline" className="w-full">
                    Browse All Events
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-purple-500" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/events">
                <Button variant="outline" className="w-full h-full py-6 justify-start">
                  <div className="text-left">
                    <Calendar className="w-6 h-6 mb-2 text-blue-400" />
                    <p className="font-semibold">Register for Events</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Explore upcoming workshops and seminars
                    </p>
                  </div>
                </Button>
              </Link>
              <Link to="/portal/tests">
                <Button variant="outline" className="w-full h-full py-6 justify-start">
                  <div className="text-left">
                    <GraduationCap className="w-6 h-6 mb-2 text-purple-400" />
                    <p className="font-semibold">Take a Test</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Test your aerospace knowledge
                    </p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}