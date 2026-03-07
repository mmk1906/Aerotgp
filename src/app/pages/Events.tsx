import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Calendar, MapPin, Users, DollarSign, Clock, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getAllEvents, createEventRegistration, updateEventRegistration, Event } from '../services/databaseService';
import { initiateRazorpayPayment, createRazorpayOrder, formatAmountForRazorpay, RazorpayPaymentResponse } from '../services/razorpayService';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load events from Firebase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter((e) => e.status === filter);

  const handleRegister = async (event: Event) => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setSelectedEvent(event);
  };

  const confirmRegistration = async () => {
    if (!selectedEvent || !user) return;

    try {
      // For free events, register directly
      if (!selectedEvent.isPaid) {
        await createEventRegistration({
          userId: user.id,
          eventId: selectedEvent.id!,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          status: 'pending',
          paymentStatus: 'completed',
          registrationDate: new Date().toISOString(),
        });

        toast.success('Registration submitted! Awaiting admin approval.');
        setSelectedEvent(null);
        loadEvents();
      } else {
        // For paid events, initiate payment
        await handlePayment();
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!selectedEvent || !user) return;

    try {
      setProcessingPayment(true);

      // Create order
      const order = await createRazorpayOrder({
        amount: selectedEvent.price,
        currency: 'INR',
        receipt: `event_${selectedEvent.id}_${user.id}`,
        notes: {
          eventId: selectedEvent.id,
          userId: user.id,
          eventTitle: selectedEvent.title,
        },
      });

      // Initiate Razorpay payment
      await initiateRazorpayPayment(
        {
          amount: formatAmountForRazorpay(selectedEvent.price),
          currency: 'INR',
          name: 'Aeronautical Department',
          description: selectedEvent.title,
          order_id: order.id,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          notes: {
            eventId: selectedEvent.id,
            userId: user.id,
          },
        },
        async (response: RazorpayPaymentResponse) => {
          // Payment success
          try {
            const registrationId = await createEventRegistration({
              userId: user.id,
              eventId: selectedEvent.id!,
              userName: user.name,
              userEmail: user.email,
              userPhone: user.phone,
              status: 'pending',
              paymentStatus: 'completed',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentSignature: response.razorpay_signature,
              registrationDate: new Date().toISOString(),
            });

            toast.success('Payment successful! Registration confirmed.');
            setSelectedEvent(null);
            setProcessingPayment(false);
            loadEvents();
          } catch (error) {
            console.error('Error saving registration:', error);
            toast.error('Payment successful but registration failed. Please contact admin.');
            setProcessingPayment(false);
          }
        },
        (error: any) => {
          // Payment failure
          console.error('Payment failed:', error);
          toast.error(error.message || 'Payment failed. Please try again.');
          setProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
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
                      event.imageUrl || event.image || 
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
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
                        {event.registeredCount || 0}/{event.maxParticipants} registered
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
                      (event.registeredCount || 0) >= event.maxParticipants
                    }
                    className="w-full"
                  >
                    {event.status === 'completed'
                      ? 'Event Completed'
                      : (event.registeredCount || 0) >= event.maxParticipants
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
              <Button onClick={selectedEvent?.isPaid ? handlePayment : confirmRegistration} className="flex-1">
                {selectedEvent?.isPaid ? 'Proceed to Payment' : 'Confirm Registration'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}