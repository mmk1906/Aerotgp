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
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Announcement } from '../../services/databaseService';

export function PortalAnnouncements() {
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('readAnnouncements') || '[]'))
  );

  useEffect(() => {
    // Set up real-time listener for announcements
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Announcement[];
        
        // Sort: pinned first, then by date
        const sorted = data.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
        setAnnouncements(sorted);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading announcements:', error);
        toast.error('Failed to load announcements');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Reset filter when navigating to this page
  useEffect(() => {
    setFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const markAsRead = (id: string) => {
    const newReadSet = new Set(readAnnouncements);
    newReadSet.add(id);
    setReadAnnouncements(newReadSet);
    localStorage.setItem('readAnnouncements', JSON.stringify(Array.from(newReadSet)));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // The real-time listener will automatically update the data
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Announcements refreshed');
    }, 500);
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

  const unreadCount = announcements.filter(a => !readAnnouncements.has(a.id)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

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
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
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
                  !readAnnouncements.has(announcement.id) ? 'border-l-4 border-l-blue-500' : ''
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
                          {!readAnnouncements.has(announcement.id) && (
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
                            {announcement.createdAt?.toDate ? 
                              announcement.createdAt.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }) :
                              new Date(announcement.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {announcement.createdAt?.toDate ? 
                              announcement.createdAt.toDate().toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }) :
                              new Date(announcement.createdAt || Date.now()).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            }
                          </span>
                        </div>

                        {!readAnnouncements.has(announcement.id) && (
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