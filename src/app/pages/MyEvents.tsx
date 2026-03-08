import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { mockEvents } from '../data/mockData';

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'completed' | 'failed';
  registeredAt: string;
}

export function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    // Load user registrations from localStorage
    const allRegistrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    const userRegs = allRegistrations.filter((r: Registration) => r.userId === user?.id);
    setRegistrations(userRegs);
  }, [user]);

  const getEventById = (eventId: string) => {
    return mockEvents.find((e) => e.id === eventId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const filterRegistrations = (filter: string) => {
    if (filter === 'all') return registrations;
    return registrations.filter((r) => r.status === filter);
  };

  const EventCard = ({ registration }: { registration: Registration }) => {
    const event = getEventById(registration.eventId);
    if (!event) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-4">
                {getStatusIcon(registration.status)}
                <Badge className={getStatusColor(registration.status)}>
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  Registered {new Date(registration.registeredAt).toLocaleDateString()}
                </span>
              </div>
              {event.isPaid && (
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">₹{event.price}</span>
                  <Badge className={getPaymentStatusColor(registration.paymentStatus)}>
                    {registration.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                {registration.status === 'approved' && registration.paymentStatus === 'completed' && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    Certificate Available
                  </Badge>
                )}
              </div>
              <div className="flex space-x-2">
                {registration.status === 'approved' && registration.paymentStatus === 'completed' && (
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Certificate
                  </Button>
                )}
                <Link to="/events">
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Event
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">My Events</h1>
        <p className="text-gray-400">
          Track your event registrations and download certificates
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrations', value: registrations.length, color: 'text-blue-400' },
          { label: 'Approved', value: filterRegistrations('approved').length, color: 'text-green-400' },
          { label: 'Pending', value: filterRegistrations('pending').length, color: 'text-yellow-400' },
          { label: 'Rejected', value: filterRegistrations('rejected').length, color: 'text-red-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className={`text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {['all', 'approved', 'pending', 'rejected'].map((filter) => (
            <TabsContent key={filter} value={filter} className="mt-6">
              <div className="space-y-4">
                {filterRegistrations(filter).length > 0 ? (
                  filterRegistrations(filter).map((registration) => (
                    <EventCard key={registration.id} registration={registration} />
                  ))
                ) : (
                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
                      <p className="text-gray-400 mb-6">
                        {filter === 'all'
                          ? "You haven't registered for any events yet."
                          : `You don't have any ${filter} registrations.`}
                      </p>
                      <Link to="/events">
                        <Button>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Browse Events
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}