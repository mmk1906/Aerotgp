import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';
import { createEvent, Event } from '../services/databaseService';
import { toast } from 'sonner';

interface EventCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (event: Event) => void;
}

export function EventCreateDialog({ open, onOpenChange, onEventCreated }: EventCreateDialogProps) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    isPaid: false,
    price: 0,
    maxParticipants: 50,
    registrationDeadline: '',
    bannerImage: '',
    paymentQRImage: '',
    coordinatorName: '',
    coordinatorContact: '',
  });

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const event: Omit<Event, 'id'> = {
        ...newEvent,
        status: 'upcoming',
        registeredCount: 0,
      };

      const eventId = await createEvent(event);
      const createdEvent = { ...event, id: eventId };
      
      toast.success('Event created successfully!');
      onEventCreated(createdEvent as Event);
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        isPaid: false,
        price: 0,
        maxParticipants: 50,
        registrationDeadline: '',
        bannerImage: '',
        paymentQRImage: '',
        coordinatorName: '',
        coordinatorContact: '',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Basic Information</h3>
            
            <div>
              <Label>Event Title *</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Workshop on Aerodynamics"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Detailed event description..."
                rows={4}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Event Date *</Label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label>Event Time</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Venue *</Label>
                <Input
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  placeholder="Lab A-101"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label>Registration Deadline *</Label>
                <Input
                  type="date"
                  value={newEvent.registrationDeadline}
                  onChange={(e) => setNewEvent({ ...newEvent, registrationDeadline: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Max Participants *</Label>
              <Input
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
          </div>

          {/* Coordinator Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Coordinator Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Coordinator Name</Label>
                <Input
                  value={newEvent.coordinatorName}
                  onChange={(e) => setNewEvent({ ...newEvent, coordinatorName: e.target.value })}
                  placeholder="Dr. John Doe"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label>Coordinator Contact</Label>
                <Input
                  value={newEvent.coordinatorContact}
                  onChange={(e) => setNewEvent({ ...newEvent, coordinatorContact: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Payment Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Event Type *</Label>
                <Select
                  value={newEvent.isPaid ? 'paid' : 'free'}
                  onValueChange={(value) => setNewEvent({ ...newEvent, isPaid: value === 'paid' })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newEvent.isPaid && (
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    placeholder="500"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              )}
            </div>

            {newEvent.isPaid && (
              <div>
                <Label>Payment QR Code Image</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload a QR code or payment details image that students will use for payment
                </p>
                <CloudinaryImageUploader
                  category="event-payment-qr"
                  onUploadComplete={(result) => {
                    setNewEvent({ ...newEvent, paymentQRImage: result.url });
                    toast.success('Payment QR image uploaded');
                  }}
                  onUploadError={(error) => {
                    toast.error('Failed to upload payment QR image');
                  }}
                  existingImageUrl={newEvent.paymentQRImage}
                  buttonText="Upload Payment QR"
                />
              </div>
            )}
          </div>

          {/* Event Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Event Images</h3>
            
            <div>
              <Label>Event Banner Image</Label>
              <p className="text-xs text-gray-500 mb-2">
                Upload a banner image for the event (recommended: 1200x600px)
              </p>
              <CloudinaryImageUploader
                category="event-banners"
                onUploadComplete={(result) => {
                  setNewEvent({ ...newEvent, bannerImage: result.url });
                  toast.success('Banner image uploaded');
                }}
                onUploadError={(error) => {
                  toast.error('Failed to upload banner image');
                }}
                existingImageUrl={newEvent.bannerImage}
                buttonText="Upload Event Banner"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} className="flex-1">
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
