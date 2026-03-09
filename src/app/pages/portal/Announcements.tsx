import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Bell, 
  Pin,
  Calendar,
  AlertCircle,
  Info,
  Megaphone,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

export function PortalAnnouncements() {
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Mid-Term Examination Schedule Released',
      content: 'The mid-term examination schedule for all courses has been published. Please check your course pages for detailed timings and venues. Examinations will begin from March 15, 2026.',
      type: 'important',
      date: '2026-03-09',
      time: '10:30 AM',
      pinned: true,
      read: false,
      author: 'Academic Office',
    },
    {
      id: 2,
      title: 'Guest Lecture on Advanced Propulsion Systems',
      content: 'Dr. Robert Martinez from NASA will be delivering a guest lecture on "Future of Space Propulsion" on March 12, 2026, at 2:00 PM in the Main Auditorium. All students are encouraged to attend.',
      type: 'event',
      date: '2026-03-08',
      time: '3:45 PM',
      pinned: true,
      read: false,
      author: 'Department of Aeronautical Engineering',
    },
    {
      id: 3,
      title: 'Library Hours Extended During Exam Week',
      content: 'The central library will be open 24/7 during the examination week (March 15-22, 2026). Additional study spaces have been arranged in Room 301 and 302.',
      type: 'info',
      date: '2026-03-08',
      time: '11:20 AM',
      pinned: false,
      read: true,
      author: 'Library Administration',
    },
    {
      id: 4,
      title: 'Project Submission Deadline Reminder',
      content: 'This is a reminder that the final project submissions for AE301 and AE302 are due on March 25, 2026. Late submissions will incur a penalty as per the course policy.',
      type: 'deadline',
      date: '2026-03-07',
      time: '9:15 AM',
      pinned: false,
      read: true,
      author: 'Course Coordinator',
    },
    {
      id: 5,
      title: 'New Research Lab Inauguration',
      content: 'The new Computational Fluid Dynamics Lab will be inaugurated on March 14, 2026, at 11:00 AM. The lab is equipped with high-performance computing systems and advanced simulation software.',
      type: 'event',
      date: '2026-03-06',
      time: '2:30 PM',
      pinned: false,
      read: true,
      author: 'Department Head',
    },
    {
      id: 6,
      title: 'Campus Internet Maintenance Notice',
      content: 'Scheduled maintenance on the campus network will take place on March 11, 2026, from 2:00 AM to 6:00 AM. Internet services may be temporarily unavailable during this period.',
      type: 'info',
      date: '2026-03-05',
      time: '4:50 PM',
      pinned: false,
      read: true,
      author: 'IT Services',
    },
    {
      id: 7,
      title: 'Student Chapter Meeting - AIAA',
      content: 'The AIAA Student Chapter will hold its monthly meeting on March 13, 2026, at 4:00 PM in Room 205. Agenda includes discussion on upcoming design competitions and workshop planning.',
      type: 'event',
      date: '2026-03-05',
      time: '1:15 PM',
      pinned: false,
      read: true,
      author: 'AIAA Student Chapter',
    },
    {
      id: 8,
      title: 'Fee Payment Reminder',
      content: 'Students who have not yet cleared their semester fees are requested to do so by March 20, 2026. Failure to pay fees may result in restricted access to examination halls.',
      type: 'important',
      date: '2026-03-04',
      time: '10:00 AM',
      pinned: false,
      read: true,
      author: 'Accounts Section',
    },
  ]);

  // Reset filter when navigating to this page
  useEffect(() => {
    setFilter('all');
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const markAsRead = (id: number) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, read: true } : ann
      )
    );
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'important':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'Important',
        };
      case 'event':
        return {
          icon: Calendar,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          label: 'Event',
        };
      case 'deadline':
        return {
          icon: Clock,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          label: 'Deadline',
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          label: 'Info',
        };
      default:
        return {
          icon: Bell,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          label: 'General',
        };
    }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  const unreadCount = announcements.filter(a => !a.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-500" />
              Announcements
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-gray-400">
              Stay updated with the latest news and announcements
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({announcements.length})
              </Button>
              <Button
                variant={filter === 'important' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('important')}
              >
                Important ({announcements.filter(a => a.type === 'important').length})
              </Button>
              <Button
                variant={filter === 'event' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('event')}
              >
                Events ({announcements.filter(a => a.type === 'event').length})
              </Button>
              <Button
                variant={filter === 'deadline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('deadline')}
              >
                Deadlines ({announcements.filter(a => a.type === 'deadline').length})
              </Button>
              <Button
                variant={filter === 'info' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('info')}
              >
                Info ({announcements.filter(a => a.type === 'info').length})
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement, index) => {
          const typeConfig = getTypeConfig(announcement.type);
          const Icon = typeConfig.icon;
          
          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card 
                className={`bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all ${
                  announcement.pinned ? 'border-yellow-500/30' : ''
                } ${
                  !announcement.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg ${typeConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${typeConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {announcement.pinned && (
                            <Pin className="w-4 h-4 text-yellow-500" />
                          )}
                          <h3 className="text-lg font-semibold">{announcement.title}</h3>
                          {!announcement.read && (
                            <Badge variant="default" className="bg-blue-500">
                              New
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className={`${typeConfig.bgColor} ${typeConfig.color} border ${typeConfig.borderColor}`}>
                          {typeConfig.label}
                        </Badge>
                      </div>

                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {announcement.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Megaphone className="w-4 h-4" />
                            {announcement.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {announcement.time}
                          </span>
                        </div>

                        {!announcement.read && (
                          <Button size="sm" variant="ghost" onClick={() => markAsRead(announcement.id)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredAnnouncements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No announcements found</p>
        </motion.div>
      )}
    </div>
  );
}