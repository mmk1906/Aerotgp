import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { mockEvents, mockRegistrations, Event } from '../data/mockData';
import { Users, Calendar, DollarSign, TrendingUp, Plus, Edit, Trash2, Download, CheckCircle, XCircle, Rocket, Eye, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Quiz, Question } from '../components/MCQTest';
import { mockQuizzes } from '../data/quizData';
import { BlogManagementTab } from '../components/BlogManagementTab';

interface AeroClubApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: string;
  prn: string;
  areasOfInterest: string[];
  technicalSkills: string;
  projectExperience: string;
  motivation: string;
  portfolio: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [applications, setApplications] = useState<AeroClubApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<AeroClubApplication | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateQuizDialogOpen, setIsCreateQuizDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
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

  useEffect(() => {
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
  }, []);

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
    clubApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    totalQuizzes: quizzes.length,
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
            <TabsTrigger value="quizzes">MCQ Tests</TabsTrigger>
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="applications">
              Club Applications
              {stats.pendingApplications > 0 && (
                <Badge className="ml-2 bg-red-500">{stats.pendingApplications}</Badge>
              )}
            </TabsTrigger>
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

          <TabsContent value="quizzes">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Quizzes</p>
                      <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                    </div>
                    <BookOpen className="w-12 h-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Test Attempts</p>
                      <p className="text-2xl font-bold">{stats.totalTestAttempts}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Quiz Management</CardTitle>
                  <Button onClick={() => toast.info('Quiz creation coming soon!')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz) => {
                    const quizAttempts = testAttempts.filter(a => a.quizId === quiz.id);
                    const avgScore = quizAttempts.length > 0
                      ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
                      : 0;

                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{quiz.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{quiz.subject}</span>
                            <Badge variant="secondary">{quiz.difficulty}</Badge>
                            <span>{quiz.questions.length} Questions</span>
                            <span><Clock className="w-3 h-3 inline mr-1" />{quiz.timeLimit} min</span>
                            <span>{quizAttempts.length} Attempts</span>
                            {quizAttempts.length > 0 && (
                              <span className="text-blue-400">Avg: {avgScore.toFixed(1)}%</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info('Edit functionality coming soon!')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => toast.info('Delete functionality coming soon!')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Student Test Results</CardTitle>
                  <Button variant="outline" onClick={() => toast.success('Results exported to CSV!')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testAttempts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                          No test attempts yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      testAttempts.map((attempt) => {
                        const quiz = quizzes.find(q => q.id === attempt.quizId);
                        return (
                          <TableRow key={attempt.id}>
                            <TableCell>
                              <div className="text-sm text-gray-400">{attempt.studentEmail}</div>
                            </TableCell>
                            <TableCell>{quiz?.title || 'Unknown Quiz'}</TableCell>
                            <TableCell>
                              <span className={`font-semibold ${
                                attempt.score >= 60 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {attempt.score.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(attempt.completedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={attempt.score >= 60 ? 'default' : 'destructive'}
                              >
                                {attempt.score >= 60 ? 'Passed' : 'Failed'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <BlogManagementTab />
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
    </div>
  );
}
