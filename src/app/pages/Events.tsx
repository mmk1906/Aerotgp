import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Calendar, MapPin, Users, Clock, Phone, User, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getAllEvents, createEventRegistration, Event } from '../services/databaseService';
import { uploadToCloudinary } from '../services/cloudinaryService';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Registration form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    collegeName: '',
    city: '',
    isInternalStudent: 'yes',
    teamName: '',
    numberOfParticipants: 1,
    transactionId: '',
    paymentReceiptUrl: '',
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Load events from Firebase
  useEffect(() => {
    loadEvents();
  }, []);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

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
    setSelectedEvent(event);
    setFormData(prev => ({
      ...prev,
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }));
    setReceiptFile(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'department', 'year', 'collegeName', 'city'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // For paid events, validate payment fields
    if (selectedEvent?.isPaid) {
      if (!formData.transactionId) {
        toast.error('Please enter transaction ID');
        return false;
      }
      if (!receiptFile && !formData.paymentReceiptUrl) {
        toast.error('Please upload payment receipt');
        return false;
      }
    }

    return true;
  };

  const handleSubmitRegistration = async () => {
    if (!selectedEvent) return;

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      let receiptUrl = formData.paymentReceiptUrl;

      // Upload payment receipt if it's a paid event and file is selected
      if (selectedEvent.isPaid && receiptFile) {
        setUploadingReceipt(true);
        receiptUrl = await uploadToCloudinary(receiptFile, 'event-receipts');
        setUploadingReceipt(false);
      }

      // Create registration
      await createEventRegistration({
        eventId: selectedEvent.id!,
        userId: user?.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        collegeName: formData.collegeName,
        city: formData.city,
        isInternalStudent: formData.isInternalStudent === 'yes',
        teamName: formData.teamName || undefined,
        numberOfParticipants: formData.numberOfParticipants || 1,
        transactionId: selectedEvent.isPaid ? formData.transactionId : undefined,
        paymentReceiptUrl: selectedEvent.isPaid ? receiptUrl : undefined,
        status: 'pending',
        paymentStatus: selectedEvent.isPaid ? 'pending' : undefined,
        registrationDate: new Date().toISOString(),
      });

      toast.success('Registration submitted successfully! Awaiting admin approval.');
      
      // Reset form
      setSelectedEvent(null);
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: '',
        year: '',
        collegeName: '',
        city: '',
        isInternalStudent: 'yes',
        teamName: '',
        numberOfParticipants: 1,
        transactionId: '',
        paymentReceiptUrl: '',
      });
      setReceiptFile(null);
      
      // Reload events
      loadEvents();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingReceipt(false);
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
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No events found</div>
        ) : (
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
                        event.bannerImage || event.imageUrl || event.image || 
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
                    <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        {event.time && <span className="ml-2">• {event.time}</span>}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{event.venue}</span>
                      </div>
                      {event.coordinatorName && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>{event.coordinatorName}</span>
                        </div>
                      )}
                      {event.coordinatorContact && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span>{event.coordinatorContact}</span>
                        </div>
                      )}
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
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Event Registration</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Banner */}
            {selectedEvent?.bannerImage && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={selectedEvent.bannerImage} 
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Event Info */}
            <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Event:</span>
                <span className="font-semibold">{selectedEvent?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Time:</span>
                <span>
                  {selectedEvent && new Date(selectedEvent.date).toLocaleDateString()}
                  {selectedEvent?.time && ` • ${selectedEvent.time}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Venue:</span>
                <span>{selectedEvent?.venue}</span>
              </div>
              {selectedEvent?.coordinatorName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Coordinator:</span>
                  <span>{selectedEvent.coordinatorName}</span>
                </div>
              )}
              {selectedEvent?.coordinatorContact && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Contact:</span>
                  <span>{selectedEvent.coordinatorContact}</span>
                </div>
              )}
              {selectedEvent?.isPaid && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="font-semibold text-blue-400">₹{selectedEvent.price}</span>
                </div>
              )}
            </div>

            {/* Registration Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="e.g., Aeronautical Engineering"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Year *</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>College Name *</Label>
                  <Input
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    placeholder="Your college name"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Your city"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label>Are you from this college? *</Label>
                  <Select 
                    value={formData.isInternalStudent} 
                    onValueChange={(value) => handleInputChange('isInternalStudent', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Team Information */}
              <h3 className="text-lg font-semibold text-blue-400 mt-6">Team Information (Optional)</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Team Name</Label>
                  <Input
                    value={formData.teamName}
                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                    placeholder="Leave blank if individual"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label>Number of Participants</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.numberOfParticipants}
                    onChange={(e) => handleInputChange('numberOfParticipants', parseInt(e.target.value) || 1)}
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              {/* Payment Section for Paid Events */}
              {selectedEvent?.isPaid && (
                <>
                  <h3 className="text-lg font-semibold text-blue-400 mt-6">Payment Information</h3>
                  
                  {/* Payment QR Code */}
                  {selectedEvent.paymentQRImage && (
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 mb-3">
                        Scan the QR code below to make payment of ₹{selectedEvent.price}
                      </p>
                      <div className="flex justify-center">
                        <img 
                          src={selectedEvent.paymentQRImage} 
                          alt="Payment QR Code"
                          className="max-w-xs rounded-lg border border-slate-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label>Transaction ID / Reference Number *</Label>
                      <Input
                        value={formData.transactionId}
                        onChange={(e) => handleInputChange('transactionId', e.target.value)}
                        placeholder="Enter transaction ID from payment app"
                        className="bg-slate-800 border-slate-700 mt-1"
                      />
                    </div>

                    <div>
                      <Label>Upload Payment Receipt *</Label>
                      <div className="mt-1">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Choose File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {receiptFile && (
                            <span className="text-sm text-gray-400 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {receiptFile.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Upload a screenshot of your payment confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedEvent(null)} 
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitRegistration} 
                className="flex-1"
                disabled={submitting || uploadingReceipt}
              >
                {uploadingReceipt ? 'Uploading Receipt...' : submitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
