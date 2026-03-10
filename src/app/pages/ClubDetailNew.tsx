import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  ArrowLeft,
  Users,
  Trophy,
  Star,
  Mail,
  Loader2,
  Image as ImageIcon,
  Plus,
  Check,
  X,
  Upload,
  Rocket,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  getClubBySlug, 
  getClubMembers,
  getFeaturedMembers,
  getClubProjects,
  getUserClubMemberships,
  isUserClubMember,
  canUserJoinClub,
  submitJoinRequest,
  getUserJoinRequests,
  Club,
  ClubMember,
  ClubProject,
  ClubJoinRequest,
} from '../services/clubService';
import { getAllEvents, Event, GalleryItem, getApprovedGalleryPhotos } from '../services/databaseService';
import { getUserProfile } from '../services/authService';
import { Starfield } from '../components/Starfield';
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { UserAvatar } from '../components/UserAvatar';

export function ClubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<ClubMember[]>([]);
  const [coreMembers, setCoreMembers] = useState<ClubMember[]>([]);
  const [projects, setProjects] = useState<ClubProject[]>([]);
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Join state
  const [joiningClub, setJoiningClub] = useState(false);

  // User state
  const [canJoin, setCanJoin] = useState(false);
  const [canJoinReason, setCanJoinReason] = useState('');
  const [userRequest, setUserRequest] = useState<ClubJoinRequest | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (slug) {
      loadClubData();
    }
  }, [slug]);

  useEffect(() => {
    if (user && club) {
      checkUserStatus();
    }
  }, [user, club]);

  const loadClubData = async () => {
    try {
      setLoading(true);

      const clubData = await getClubBySlug(slug!);
      if (!clubData) {
        toast.error('Club not found');
        navigate('/clubs');
        return;
      }

      setClub(clubData);

      // Load members with error handling
      try {
        const [allMembers, featured] = await Promise.all([
          getClubMembers(clubData.id!),
          getFeaturedMembers(clubData.id!)
        ]);

        setMembers(allMembers || []);
        setFeaturedMembers(featured || []);
        
        // Load core members
        const core = (allMembers || []).filter(member => member?.role === 'Core Member');
        setCoreMembers(core);
      } catch (memberError) {
        console.error('Error fetching club members:', memberError);
        setMembers([]);
        setFeaturedMembers([]);
        setCoreMembers([]);
      }

      // Load projects with error handling
      try {
        const clubProjects = await getClubProjects(clubData.id!);
        setProjects(clubProjects || []);
      } catch (projectError: any) {
        console.error('Error fetching club projects:', projectError);
        setProjects([]);
      }

      // Load photos with error handling
      try {
        const allPhotos = await getApprovedGalleryPhotos();
        setPhotos(allPhotos || []);
      } catch (photoError) {
        console.error('Error fetching photos:', photoError);
        setPhotos([]);
      }

      // Load events with error handling
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents || []);
      } catch (eventError) {
        console.error('Error fetching events:', eventError);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading club:', error);
      toast.error('Failed to load club details');
      navigate('/clubs');
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!user || !club || !club.id) return;

    try {
      // Check if member
      const memberStatus = await isUserClubMember(user.id, club.id);
      setIsMember(memberStatus);

      if (memberStatus) {
        setCanJoin(false);
        setCanJoinReason('Already a member');
        return;
      }

      // Get user's requests for this club
      const requests = await getUserJoinRequests(user.id);
      const clubRequest = requests.find(r => r.clubId === club.id && r.status === 'pending');
      setUserRequest(clubRequest || null);

      if (clubRequest) {
        setCanJoin(false);
        setCanJoinReason('Request pending');
        return;
      }

      // Check if can join
      const { canJoin: canJoinClub, reason } = await canUserJoinClub(user.id, club.id);
      setCanJoin(canJoinClub);
      setCanJoinReason(reason || '');
    } catch (error) {
      console.error('Error checking user status:', error);
      // Set safe defaults on error
      setCanJoin(false);
      setCanJoinReason('Error checking status');
    }
  };

  const handleQuickJoin = async () => {
    if (!user) {
      toast.error('Please login to join clubs');
      navigate('/login');
      return;
    }

    if (!club || !club.id) return;

    try {
      setJoiningClub(true);

      // Get user profile
      const userProfile = await getUserProfile(user.id);
      if (!userProfile) {
        toast.error('Please complete your profile first to join clubs.', {
          duration: 5000,
          action: {
            label: 'Go to Profile',
            onClick: () => navigate('/portal/profile')
          }
        });
        return;
      }

      // Check if profile is complete
      if (!userProfile.name || !userProfile.email) {
        toast.error('Please complete your profile with name and email before joining clubs.', {
          duration: 5000,
          action: {
            label: 'Complete Profile',
            onClick: () => navigate('/portal/profile')
          }
        });
        return;
      }

      // Submit join request with auto-generated reason
      await submitJoinRequest(
        club.id,
        user.id,
        {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          department: userProfile.department,
          year: userProfile.year,
          profilePhoto: userProfile.profilePhoto,
        },
        `I am interested in joining ${club.name} to participate in club activities and contribute to the aerospace community.`
      );

      toast.success(`Join request sent for ${club.name}! Wait for admin approval.`);
      await checkUserStatus();
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast.error(error.message || 'Failed to submit join request');
    } finally {
      setJoiningClub(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <Rocket className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Club Not Found</h3>
            <p className="text-gray-400 mb-8">The club you're looking for doesn't exist.</p>
            <Link to="/clubs">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Clubs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/clubs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clubs
            </Button>
          </Link>
        </motion.div>

        {/* Club Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden">
            {/* Banner */}
            <div className="relative h-64 md:h-80">
              {club.banner ? (
                <img
                  src={club.banner}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Rocket className="w-32 h-32 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

              {/* Logo */}
              {club.logo && (
                <div className="absolute bottom-6 left-6">
                  <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-700 overflow-hidden">
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">{club.name}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                    {club.establishedYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>Established {club.establishedYear}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{club.memberCount || 0} members</span>
                    </div>
                    {club.featuredCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>{club.featuredCount} featured</span>
                      </div>
                    )}
                  </div>

                  {club.category && (
                    <Badge variant="outline" className="mb-6">
                      {club.category}
                    </Badge>
                  )}

                  {club.facultyCoordinator && (
                    <p className="text-gray-400 mb-2">
                      <span className="font-semibold">Faculty Coordinator:</span> {club.facultyCoordinator}
                    </p>
                  )}
                </div>

                {/* Join Button */}
                <div className="flex-shrink-0">
                  {user ? (
                    isMember ? (
                      <Button disabled className="w-full md:w-auto bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Joined
                      </Button>
                    ) : userRequest ? (
                      <Button disabled className="w-full md:w-auto bg-yellow-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Request Pending
                      </Button>
                    ) : canJoin ? (
                      <Button 
                        onClick={handleQuickJoin} 
                        className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                        disabled={joiningClub}
                      >
                        {joiningClub ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Club
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full md:w-auto">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {canJoinReason}
                      </Button>
                    )
                  ) : (
                    <Link to="/login">
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Login to Join
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {club.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Members */}
        {featuredMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Featured Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <UserAvatar 
                          photoUrl={member.userPhoto} 
                          userName={member.userName} 
                          size="xl"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1">{member.userName}</h4>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {member.role}
                          </Badge>
                          {member.contribution && (
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {member.contribution}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Core Members */}
        {coreMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Core Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <UserAvatar 
                              photoUrl={member.userPhoto} 
                              userName={member.userName} 
                              size="lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg mb-1">{member.userName}</h4>
                              <Badge variant="outline" className="mb-2 text-xs">
                                {member.role}
                              </Badge>
                              {member.contribution && (
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {member.contribution}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* All Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="w-6 h-6 mr-2 text-blue-500" />
                All Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No members yet. Be the first to join!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3">
                          <UserAvatar 
                            photoUrl={member.userPhoto} 
                            userName={member.userName} 
                            size="lg"
                          />
                        </div>
                        <h5 className="font-semibold text-sm mb-1">{member.userName}</h5>
                        <Badge variant="secondary" className="text-xs mb-1">
                          {member.role}
                        </Badge>
                        {member.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                          {project.imageUrl ? (
                            <img src={project.imageUrl} alt={project.title || 'Project'} className="w-full h-full object-cover" />
                          ) : (
                            (project.title && project.title.charAt(0).toUpperCase()) || 'P'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1">{project.title || 'Untitled Project'}</h4>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {project.status || 'Unknown'}
                          </Badge>
                          {project.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <ImageIcon className="w-6 h-6 mr-2 text-yellow-500" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                          {photo.url ? (
                            <img src={photo.url} alt={photo.description || 'Photo'} className="w-full h-full object-cover" />
                          ) : (
                            (photo.description && photo.description.charAt(0).toUpperCase()) || 'P'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1">{photo.description || 'Untitled Photo'}</h4>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {photo.date || 'No date'}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Calendar className="w-6 h-6 mr-2 text-yellow-500" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                          {event.logo ? (
                            <img src={event.logo} alt={event.name || 'Event'} className="w-full h-full object-cover" />
                          ) : (
                            (event.name && event.name.charAt(0).toUpperCase()) || 'E'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1">{event.name || 'Untitled Event'}</h4>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {event.date || 'No date'}
                          </Badge>
                          {event.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}