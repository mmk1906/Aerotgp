import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Rocket,
  Users,
  Calendar,
  Star,
  Award,
  ArrowLeft,
  Loader2,
  UserPlus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  getClubBySlug,
  getClubMembers,
  getFeaturedMembers,
  submitJoinRequest,
  canUserJoinClub,
  getUserJoinRequests,
  Club,
  ClubMember,
  ClubJoinRequest
} from '../services/clubService';
import { getUserProfile } from '../services/authService';

export function ClubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Join dialog state
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinReason, setJoinReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // User state
  const [canJoin, setCanJoin] = useState(false);
  const [canJoinReason, setCanJoinReason] = useState('');
  const [userRequest, setUserRequest] = useState<ClubJoinRequest | null>(null);

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
        return;
      }

      setClub(clubData);

      // Load members
      const [allMembers, featured] = await Promise.all([
        getClubMembers(clubData.id!),
        getFeaturedMembers(clubData.id!)
      ]);

      setMembers(allMembers);
      setFeaturedMembers(featured);
    } catch (error) {
      console.error('Error loading club:', error);
      toast.error('Failed to load club details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!user || !club) return;

    try {
      // Check if can join
      const { canJoin: canJoinClub, reason } = await canUserJoinClub(user.uid, club.id!);
      setCanJoin(canJoinClub);
      setCanJoinReason(reason || '');

      // Get user's requests for this club
      const requests = await getUserJoinRequests(user.uid);
      const clubRequest = requests.find(r => r.clubId === club.id && r.status === 'pending');
      setUserRequest(clubRequest || null);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const handleJoinClick = () => {
    if (!user) {
      toast.error('Please login to join clubs');
      return;
    }

    setShowJoinDialog(true);
  };

  const handleSubmitJoinRequest = async () => {
    if (!user || !club) return;

    if (!joinReason.trim()) {
      toast.error('Please provide a reason for joining');
      return;
    }

    try {
      setSubmitting(true);

      // Get user profile
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        toast.error('User profile not found. Please update your profile first.');
        return;
      }

      await submitJoinRequest(
        club.id!,
        user.uid,
        {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          department: userProfile.department,
          year: userProfile.year,
        },
        joinReason
      );

      toast.success('Join request submitted successfully! Wait for admin approval.');
      setShowJoinDialog(false);
      setJoinReason('');
      await checkUserStatus();
    } catch (error: any) {
      console.error('Error submitting join request:', error);
      toast.error(error.message || 'Failed to submit join request');
    } finally {
      setSubmitting(false);
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
                    userRequest ? (
                      <Button disabled className="w-full md:w-auto">
                        <Clock className="w-4 h-4 mr-2" />
                        Request Pending
                      </Button>
                    ) : canJoin ? (
                      <Button onClick={handleJoinClick} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Club
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
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                          {member.userPhoto ? (
                            <img src={member.userPhoto} alt={member.userName} className="w-full h-full object-cover" />
                          ) : (
                            member.userName.charAt(0).toUpperCase()
                          )}
                        </div>
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mb-3 overflow-hidden">
                          {member.userPhoto ? (
                            <img src={member.userPhoto} alt={member.userName} className="w-full h-full object-cover" />
                          ) : (
                            member.userName.charAt(0).toUpperCase()
                          )}
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
      </div>

      {/* Join Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl">Join {club.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tell us why you want to join this club. Your request will be reviewed by the admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Why do you want to join?</Label>
              <Textarea
                value={joinReason}
                onChange={(e) => setJoinReason(e.target.value)}
                rows={5}
                placeholder="Share your interest, experience, and what you hope to achieve..."
                className="bg-slate-800 border-slate-700 mt-2"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitJoinRequest}
                disabled={submitting || !joinReason.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
