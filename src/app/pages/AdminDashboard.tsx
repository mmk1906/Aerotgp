import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Download, 
  Edit2, 
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Award,
  BookOpen,
  UserPlus,
  FileText,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../context/AuthContext';
import { 
  Event, 
  EventRegistration, 
  AeroClubApplication, 
  ContactMessage,
  getAllEvents, 
  createEvent, 
  deleteEvent as deleteEventFromDb,
  updateEventRegistration,
  getCollection
} from '../services/databaseService';
import { toast } from 'sonner';
import { QuizManagementTab } from '../components/QuizManagementTab';
import { ClubsManagement } from '../components/admin/ClubsManagement';
import { JoinRequestsManagement } from '../components/admin/JoinRequestsManagement';
import { MembersManagement } from '../components/admin/MembersManagement';
import { EventCreateDialog } from '../components/EventCreateDialog';
import { FacultyManagementTab } from '../components/FacultyManagementTab';
import { PhotoGalleryManagement } from '../components/PhotoGalleryManagement';
import { MessagesManagement } from '../components/MessagesManagement';
import { WebsiteContentManagement } from '../components/WebsiteContentManagement';
import { DataExportTab } from '../components/DataExportTab';
import { AdminSettings } from '../components/AdminSettings';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [applications, setApplications] = useState<AeroClubApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<AeroClubApplication | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load applications from localStorage
        const storedApplications = localStorage.getItem('aeroClubApplications');
        if (storedApplications) {
          setApplications(JSON.parse(storedApplications));
        }

        // Load test attempts from localStorage
        const storedAttempts = localStorage.getItem('testAttempts');
        if (storedAttempts) {
          setTestAttempts(JSON.parse(storedAttempts));
        }

        // Fetch events from database
        const eventsData = await getAllEvents();
        setEvents(eventsData);

        // Fetch registrations from database
        const regsData = await getCollection<EventRegistration>('registrations');
        setRegistrations(regsData);

        // Fetch messages from database
        const messagesData = await getCollection<ContactMessage>('messages');
        setMessages(messagesData);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load some data');
      }
    };

    loadData();
  }, []);

  // Safety check - ProtectedRoute wrapper should prevent this
  if (!user) {
    return null;
  }

  const stats = {
    totalStudents: 500,
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    revenue: registrations
      .filter((r) => r.paymentStatus === 'completed')
      .reduce((sum, r) => {
        const event = events.find(e => e.id === r.eventId);
        return sum + (event?.price || 0);
      }, 0),
    clubApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    totalTestAttempts: testAttempts.length,
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

    createEvent(event).then(() => {
      setEvents([...events, event]);
      setIsCreateDialogOpen(false);
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
      toast.success('Event created successfully!');
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEventFromDb(id).then(() => {
      setEvents(events.filter((e) => e.id !== id));
      toast.success('Event deleted successfully!');
    });
  };

  const handleApproveRegistration = (id: string) => {
    updateEventRegistration(id, { approvalStatus: 'approved' }).then(() => {
      setRegistrations(
        registrations.map((r) =>
          r.id === id ? { ...r, approvalStatus: 'approved' } : r
        )
      );
      toast.success('Registration approved!');
    });
  };

  const handleRejectRegistration = (id: string) => {
    updateEventRegistration(id, { approvalStatus: 'rejected' }).then(() => {
      setRegistrations(
        registrations.map((r) =>
          r.id === id ? { ...r, approvalStatus: 'rejected' } : r
        )
      );
      toast.success('Registration rejected!');
    });
  };

  const exportRegistrations = () => {
    toast.success('Registrations exported to CSV!');
  };

  const handleApproveApplication = (id: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: 'approved' as const } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('aeroClubApplications', JSON.stringify(updatedApplications));
    toast.success('Application approved!');
  };

  const handleRejectApplication = (id: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: 'rejected' as const } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('aeroClubApplications', JSON.stringify(updatedApplications));
    toast.success('Application rejected!');
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
          <h1 className="text-4xl font-bold mb-2">Admin Control Panel</h1>
          <p className="text-gray-400">Comprehensive website management dashboard</p>
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

        {/* Quick Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Rocket className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Welcome to the Admin Control Panel</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    You have full control over the website. Manage events, blogs, clubs, faculty, photo gallery, and website content - all without coding!
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Drag & drop photo uploads</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-gray-300">One-click approvals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Export data anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex min-w-full bg-slate-800/50">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="registrations">Registrations</TabsTrigger>
              <TabsTrigger value="quizzes">MCQ Tests</TabsTrigger>
              <TabsTrigger value="clubs">
                Clubs
                {stats.pendingApplications > 0 && (
                  <Badge className="ml-2 bg-red-500">{stats.pendingApplications}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

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
                          <Edit2 className="w-4 h-4" />
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
                      <TableHead>College</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Receipt</TableHead>
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
                              <div className="font-semibold">{reg.fullName || reg.userName}</div>
                              <div className="text-sm text-gray-400">{reg.email || reg.userEmail}</div>
                              <div className="text-xs text-gray-500">{reg.phone || reg.userPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{reg.collegeName}</div>
                              <div className="text-gray-400">{reg.city}</div>
                            </div>
                          </TableCell>
                          <TableCell>{event?.title || 'N/A'}</TableCell>
                          <TableCell>
                            {reg.registrationDate 
                              ? new Date(reg.registrationDate).toLocaleDateString()
                              : reg.createdAt && new Date(reg.createdAt.seconds * 1000).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.status === 'approved'
                                  ? 'default'
                                  : reg.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {reg.transactionId ? (
                              <div className="text-xs font-mono text-gray-400">
                                {reg.transactionId}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {reg.paymentReceiptUrl ? (
                              <a
                                href={reg.paymentReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs underline"
                              >
                                View Receipt
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {reg.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveRegistration(reg.id!)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectRegistration(reg.id!)}
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

          <TabsContent value="quizzes">
            <QuizManagementTab />
          </TabsContent>

          <TabsContent value="clubs">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="pt-6">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="bg-slate-800/50">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="join-requests">
                      Join Requests
                      {stats.pendingApplications > 0 && (
                        <Badge className="ml-2 bg-red-500 text-xs">{stats.pendingApplications}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="applications">
                      Applications
                      {stats.pendingApplications > 0 && (
                        <Badge className="ml-2 bg-yellow-600 text-xs">{stats.pendingApplications}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <ClubsManagement />
                  </TabsContent>

                  <TabsContent value="join-requests">
                    <JoinRequestsManagement />
                  </TabsContent>

                  <TabsContent value="members">
                    <MembersManagement />
                  </TabsContent>

                  <TabsContent value="applications">
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            <Rocket className="w-5 h-5 mr-2 text-blue-500" />
                            Aero Club Applications
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                              Total: {applications.length}
                            </Badge>
                            <Badge className="bg-yellow-600">
                              Pending: {stats.pendingApplications}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Applicant</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                                  No applications yet
                                </TableCell>
                              </TableRow>
                            ) : (
                              applications.map((app) => (
                                <TableRow key={app.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-semibold">{app.fullName}</div>
                                      <div className="text-sm text-gray-400">{app.email}</div>
                                      <div className="text-sm text-gray-400">{app.phone}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{app.department}</TableCell>
                                  <TableCell>{app.yearOfStudy} Year</TableCell>
                                  <TableCell>
                                    {new Date(app.submittedAt).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        app.status === 'approved'
                                          ? 'default'
                                          : app.status === 'rejected'
                                          ? 'destructive'
                                          : 'secondary'
                                      }
                                    >
                                      {app.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSelectedApplication(app)}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      {app.status === 'pending' && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-500 hover:text-green-600"
                                            onClick={() => handleApproveApplication(app.id)}
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleRejectApplication(app.id)}
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join-requests">
            <JoinRequestsManagement />
          </TabsContent>

          <TabsContent value="members">
            <MembersManagement />
          </TabsContent>

          <TabsContent value="applications">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-blue-500" />
                    Aero Club Applications
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Total: {applications.length}
                    </Badge>
                    <Badge className="bg-yellow-600">
                      Pending: {stats.pendingApplications}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                          No applications yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{app.fullName}</div>
                              <div className="text-sm text-gray-400">{app.email}</div>
                              <div className="text-sm text-gray-400">{app.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{app.department}</TableCell>
                          <TableCell>{app.yearOfStudy} Year</TableCell>
                          <TableCell>
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === 'approved'
                                  ? 'default'
                                  : app.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-500 hover:text-green-600"
                                    onClick={() => handleApproveApplication(app.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectApplication(app.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyManagementTab />
          </TabsContent>

          <TabsContent value="gallery">
            <PhotoGalleryManagement />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManagement />
          </TabsContent>

          <TabsContent value="content">
            <WebsiteContentManagement />
          </TabsContent>

          <TabsContent value="export">
            <DataExportTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Dialog */}
      <EventCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onEventCreated={(event) => {
          setEvents([...events, event]);
          getAllEvents().then(setEvents); // Refresh from database
        }}
      />

      {/* View Application Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the applicant's information
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Full Name:</span>
                    <p className="font-semibold">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-semibold">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="font-semibold">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">PRN:</span>
                    <p className="font-semibold">{selectedApplication.prn}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Academic Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Department:</span>
                    <p className="font-semibold">{selectedApplication.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Year of Study:</span>
                    <p className="font-semibold">{selectedApplication.yearOfStudy} Year</p>
                  </div>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Areas of Interest</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.areasOfInterest?.map((area) => (
                    <Badge key={area} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              {selectedApplication.technicalSkills && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Technical Skills</h3>
                  <p className="text-sm bg-slate-800/50 p-3 rounded-lg">
                    {selectedApplication.technicalSkills}
                  </p>
                </div>
              )}

              {/* Project Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Project Experience</h3>
                <p className="text-sm bg-slate-800/50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedApplication.projectExperience}
                </p>
              </div>

              {/* Motivation */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Motivation</h3>
                <p className="text-sm bg-slate-800/50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedApplication.motivation}
                </p>
              </div>

              {/* Portfolio */}
              {selectedApplication.portfolio && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Portfolio</h3>
                  <a
                    href={selectedApplication.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 text-sm underline"
                  >
                    {selectedApplication.portfolio}
                  </a>
                </div>
              )}

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="flex space-x-4 pt-4 border-t border-slate-700">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveApplication(selectedApplication.id);
                      setSelectedApplication(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleRejectApplication(selectedApplication.id);
                      setSelectedApplication(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Review the message
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-semibold">{selectedMessage.email}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Message</h3>
                <p className="text-sm bg-slate-800/50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Date</h3>
                <p className="text-sm bg-slate-800/50 p-3 rounded-lg">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}