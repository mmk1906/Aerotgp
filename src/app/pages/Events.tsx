import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { mockEvents } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredEvents =
    filter === 'all'
      ? mockEvents
      : mockEvents.filter((e) => e.status === filter);

  const handleRegister = (event: typeof mockEvents[0]) => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
  };

  const confirmRegistration = () => {
    if (selectedEvent) {
      toast.success(`Successfully registered for ${selectedEvent.title}!`);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-xl text-gray-400">
            Participate in workshops, seminars, and competitions
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full transition-all capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48">
                  <img
                    src={
                      event.title === 'Cadthon'
                        ? 'https://images.unsplash.com/photo-1581094485546-7910e5a5a599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDQUQlMjBkZXNpZ24lMjBjb21wZXRpdGlvbiUyMGVuZ2luZWVyaW5nfGVufDF8fHx8MTc3MjcyNzAyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
                        : event.title === 'Aero Modelling'
                        ? 'https://images.unsplash.com/photo-1735081011574-cac2f06771ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJvJTIwbW9kZWxpbmclMjBhaXJjcmFmdHxlbnwxfHx8fDE3NzI3MjcwMjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
                        : event.title === 'Slide war'
                        ? 'https://images.unsplash.com/photo-1733222765056-b0790217baa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZXNob3clMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NzI3MjcwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080'
                        : event.title === 'E-Sports'
                        ? 'https://images.unsplash.com/photo-1772587003187-65b32c91df91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwY29tcGV0aXRpb258ZW58MXx8fHwxNzcyNjQzNDIzfDA&ixlib=rb-4.1.0&q=80&w=1080'
                        : event.image
                    }
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={
                        event.status === 'upcoming'
                          ? 'bg-green-600'
                          : event.status === 'ongoing'
                          ? 'bg-yellow-600'
                          : 'bg-gray-600'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  {event.isPaid && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{event.price}
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>
                        {event.registeredCount}/{event.maxParticipants} registered
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>
                        Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRegister(event)}
                    disabled={
                      event.status === 'completed' ||
                      event.registeredCount >= event.maxParticipants
                    }
                    className="w-full"
                  >
                    {event.status === 'completed'
                      ? 'Event Completed'
                      : event.registeredCount >= event.maxParticipants
                      ? 'Fully Booked'
                      : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              Confirm your registration for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Event:</span>
                <span className="font-semibold">{selectedEvent?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date:</span>
                <span>{selectedEvent && new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Venue:</span>
                <span>{selectedEvent?.venue}</span>
              </div>
              {selectedEvent?.isPaid && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee:</span>
                  <span className="font-semibold text-blue-400">₹{selectedEvent.price}</span>
                </div>
              )}
            </div>
            {selectedEvent?.isPaid && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">
                  This is a paid event. After clicking Register, you'll be redirected to the
                  payment gateway.
                </p>
              </div>
            )}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setSelectedEvent(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmRegistration} className="flex-1">
                {selectedEvent?.isPaid ? 'Proceed to Payment' : 'Confirm Registration'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
