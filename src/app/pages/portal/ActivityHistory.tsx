import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Activity,
  Calendar, 
  Users,
  GraduationCap,
  Award,
  UserCircle,
  Download,
  Clock,
  TrendingUp,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getUserActivityLogs,
  getUserRegistrations,
  getUserCertificates,
  ActivityLog,
  EventRegistration,
  EventCertificate
} from '../../services/databaseService';
import { getUserClubMemberships, ClubMember } from '../../services/clubService';

export function ActivityHistory() {
  const { user } = useAuth();
  
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [certificates, setCertificates] = useState<EventCertificate[]>([]);
  const [clubMemberships, setClubMemberships] = useState<ClubMember[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadActivityData();
    }
  }, [user]);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      
      // Load all activity-related data
      const [logs, regs, certs, clubs] = await Promise.all([
        getUserActivityLogs(user!.id),
        getUserRegistrations(user!.id),
        getUserCertificates(user!.id),
        getUserClubMemberships(user!.id)
      ]);

      setActivities(logs);
      setRegistrations(regs);
      setCertificates(certs);
      setClubMemberships(clubs);

      // Load quiz attempts from localStorage
      const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
      setTestAttempts(attempts.filter((a: any) => a.userId === user?.id));
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event_registration':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'club_join':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'quiz_attempt':
        return <GraduationCap className="w-5 h-5 text-green-400" />;
      case 'profile_update':
        return <UserCircle className="w-5 h-5 text-orange-400" />;
      case 'certificate_download':
        return <Download className="w-5 h-5 text-yellow-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'event_registration':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'club_join':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'quiz_attempt':
        return 'bg-green-500/10 border-green-500/20';
      case 'profile_update':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'certificate_download':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    
    if (date?.toDate) {
      return date.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate statistics
  const stats = [
    {
      label: 'Total Activities',
      value: activities.length + registrations.length + clubMemberships.length + testAttempts.length,
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Events Registered',
      value: registrations.length,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Clubs Joined',
      value: clubMemberships.length,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Tests Taken',
      value: testAttempts.length,
      icon: GraduationCap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Activity History</h1>
        <p className="text-gray-400">
          Track your journey and engagement across the platform
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-gray-900/50 border border-gray-800 mb-6">
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        {/* All Activity Tab */}
        <TabsContent value="all">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 && registrations.length === 0 && clubMemberships.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No activities yet. Start exploring!</p>
                  </div>
                ) : (
                  <>
                    {/* Activity Logs */}
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border ${getActivityColor(activity.type)} flex items-start gap-3`}
                      >
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{activity.action}</h4>
                          <p className="text-sm text-gray-400 mb-2">{activity.details}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(activity.createdAt)}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Event Registrations */}
                    {registrations.map((reg) => (
                      <motion.div
                        key={reg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20 flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Event Registration</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            Registered for an event
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <Badge variant={reg.status === 'approved' ? 'default' : 'secondary'}>
                              {reg.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatDate(reg.createdAt)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Club Memberships */}
                    {clubMemberships.map((membership) => (
                      <motion.div
                        key={membership.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg border bg-purple-500/10 border-purple-500/20 flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Joined {membership.clubName}</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            Role: {membership.role}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(membership.joinedDate)}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Quiz Attempts */}
                    {testAttempts.map((attempt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg border bg-green-500/10 border-green-500/20 flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <GraduationCap className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Quiz Completed</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {attempt.quizTitle || 'Aerospace Quiz'}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <Badge variant={attempt.score >= 60 ? 'default' : 'secondary'}>
                              Score: {attempt.score}%
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatDate(attempt.completedAt)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Event History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No event registrations yet</p>
                  </div>
                ) : (
                  registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">Event Registration</h4>
                          <p className="text-sm text-gray-400">
                            {reg.fullName} • {reg.email}
                          </p>
                        </div>
                        <Badge variant={reg.status === 'approved' ? 'default' : 'secondary'}>
                          {reg.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Department:</span>
                          <span className="ml-2 text-gray-300">{reg.department}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Year:</span>
                          <span className="ml-2 text-gray-300">{reg.year}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Registered:</span>
                          <span className="ml-2 text-gray-300">{formatDate(reg.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clubs Tab */}
        <TabsContent value="clubs">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Club Memberships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clubMemberships.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No club memberships yet</p>
                  </div>
                ) : (
                  clubMemberships.map((membership) => (
                    <div
                      key={membership.id}
                      className="p-4 rounded-lg border bg-purple-500/10 border-purple-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{membership.clubName}</h4>
                          <p className="text-sm text-gray-400">
                            {membership.role}
                          </p>
                        </div>
                        <Badge variant={membership.status === 'active' ? 'default' : 'secondary'}>
                          {membership.status}
                        </Badge>
                      </div>
                      {membership.contribution && (
                        <p className="text-sm text-gray-400 mb-2">{membership.contribution}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Joined on {formatDate(membership.joinedDate)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-400" />
                Quiz History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testAttempts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No quiz attempts yet</p>
                  </div>
                ) : (
                  testAttempts.map((attempt, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-green-500/10 border-green-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{attempt.quizTitle}</h4>
                          <p className="text-sm text-gray-400">
                            {attempt.correctAnswers} / {attempt.totalQuestions} correct
                          </p>
                        </div>
                        <Badge variant={attempt.score >= 60 ? 'default' : 'secondary'}>
                          {attempt.score}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Time Taken:</span>
                          <span className="ml-2 text-gray-300">
                            {Math.floor((attempt.timeTaken || 0) / 60)}m {(attempt.timeTaken || 0) % 60}s
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <span className="ml-2 text-gray-300">{formatDate(attempt.completedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
