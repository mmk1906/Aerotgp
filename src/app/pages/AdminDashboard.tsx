import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { mockEvents, mockRegistrations, Event } from '../data/mockData';
import { Users, Calendar, DollarSign, TrendingUp, Plus, Edit, Trash2, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    isPaid: false,
    price: 0,
    maxParticipants: 50,
    registrationDeadline: '',
  });

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const stats = {
    totalStudents: 500,
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    revenue: events
      .filter((e) => e.isPaid)
      .reduce((sum, e) => sum + (e.price || 0) * e.registeredCount, 0),
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      toast.error('Please fill all required fields');
      return;
    }

    const event: Event = {
      id: (events.length + 1).toString(),
      ...newEvent,
      status: 'upcoming',
      registeredCount: 0,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    };

    setEvents([...events, event]);
    setIsCreateDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      venue: '',
      isPaid: false,
      price: 0,
      maxParticipants: 50,
      registrationDeadline: '',
    });
    toast.success('Event created successfully!');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success('Event deleted successfully!');
  };

  const handleApproveRegistration = (id: string) => {
    setRegistrations(
      registrations.map((r) =>
        r.id === id ? { ...r, approvalStatus: 'approved' } : r
      )
    );
    toast.success('Registration approved!');
  };

  const handleRejectRegistration = (id: string) => {
    setRegistrations(
      registrations.map((r) =>
        r.id === id ? { ...r, approvalStatus: 'rejected' } : r
      )
    );
    toast.success('Registration rejected!');
  };

  const exportRegistrations = () => {
    toast.success('Registrations exported to CSV!');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage events and registrations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Students', value: stats.totalStudents, color: 'text-blue-500' },
            { icon: Calendar, label: 'Total Events', value: stats.totalEvents, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Registrations', value: stats.totalRegistrations, color: 'text-purple-500' },
            { icon: DollarSign, label: 'Revenue', value: `₹${stats.revenue}`, color: 'text-yellow-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-12 h-12 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Events</CardTitle>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>{event.venue}</span>
                          <Badge variant={event.isPaid ? 'default' : 'secondary'}>
                            {event.isPaid ? `₹${event.price}` : 'Free'}
                          </Badge>
                          <span>
                            {event.registeredCount}/{event.maxParticipants} registered
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Registration Management</CardTitle>
                  <Button variant="outline" onClick={exportRegistrations}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => {
                      const event = events.find((e) => e.id === reg.eventId);
                      return (
                        <TableRow key={reg.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{reg.studentName}</div>
                              <div className="text-sm text-gray-400">{reg.studentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{event?.title}</TableCell>
                          <TableCell>
                            {new Date(reg.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.approvalStatus === 'approved'
                                  ? 'default'
                                  : reg.approvalStatus === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {reg.approvalStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.paymentStatus === 'paid'
                                  ? 'default'
                                  : reg.paymentStatus === 'pending'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {reg.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {reg.approvalStatus === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveRegistration(reg.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectRegistration(reg.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Event Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Workshop on..."
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description..."
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Event Date</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Registration Deadline</label>
                <Input
                  type="date"
                  value={newEvent.registrationDeadline}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, registrationDeadline: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Venue</label>
              <Input
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                placeholder="Lab A-101"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Event Type</label>
                <Select
                  value={newEvent.isPaid ? 'paid' : 'free'}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, isPaid: value === 'paid' })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
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
                  <label className="block text-sm mb-2">Price (₹)</label>
                  <Input
                    type="number"
                    value={newEvent.price}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, price: Number(e.target.value) })
                    }
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2">Max Participants</label>
              <Input
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, maxParticipants: Number(e.target.value) })
                }
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
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
    </div>
  );
}
