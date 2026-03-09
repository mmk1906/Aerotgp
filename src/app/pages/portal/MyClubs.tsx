import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Rocket, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Calendar,
  Star,
  ArrowRight,
  UserMinus,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import {
  getUserClubMemberships,
  getUserJoinRequests,
  getActiveClubs,
  removeMember,
  ClubMember,
  ClubJoinRequest,
  Club
} from '../../services/clubService';

export function MyClubs() {
  const { user } = useAuth();
  
  const [myClubs, setMyClubs] = useState<ClubMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<ClubJoinRequest[]>([]);
  const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Load user's clubs and requests in parallel
      const [memberships, requests, allClubs] = await Promise.all([
        getUserClubMemberships(user!.id),
        getUserJoinRequests(user!.id),
        getActiveClubs()
      ]);

      setMyClubs(memberships);
      setJoinRequests(requests);

      // Filter available clubs (not already a member and no pending request)
      const memberClubIds = new Set(memberships.map(m => m.clubId));
      const pendingClubIds = new Set(
        requests.filter(r => r.status === 'pending').map(r => r.clubId)
      );

      const available = allClubs.filter(
        club => !memberClubIds.has(club.id!) && !pendingClubIds.has(club.id!)
      );

      setAvailableClubs(available);
    } catch (error) {
      console.error('Error loading clubs data:', error);
      toast.error('Failed to load clubs data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
    toast.success('Refreshed clubs data');
  };

  const handleLeaveClub = async (membership: ClubMember) => {
    if (!confirm(`Are you sure you want to leave ${membership.clubName}?`)) {
      return;
    }

    try {
      await removeMember(membership.id!);
      toast.success(`You have left ${membership.clubName}`);
      await loadData();
    } catch (error) {
      console.error('Error leaving club:', error);
      toast.error('Failed to leave club');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Clubs</h1>
          <p className="text-gray-400">Manage your club memberships and discover new clubs</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Joined Clubs</p>
                  <p className="text-3xl font-bold text-blue-500">{myClubs.length}</p>
                </div>
                <Rocket className="w-12 h-12 text-blue-500/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Requests</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {joinRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available Clubs</p>
                  <p className="text-3xl font-bold text-purple-500">{availableClubs.length}</p>
                </div>
                <Users className="w-12 h-12 text-purple-500/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="my-clubs" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="my-clubs">
              My Clubs ({myClubs.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({joinRequests.length})
            </TabsTrigger>
            <TabsTrigger value="discover">
              Discover ({availableClubs.length})
            </TabsTrigger>
          </TabsList>

          {/* My Clubs Tab */}
          <TabsContent value="my-clubs">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>Clubs You've Joined</CardTitle>
              </CardHeader>
              <CardContent>
                {myClubs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Rocket className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="mb-4">You haven't joined any clubs yet</p>
                    <Link to="/clubs">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Browse Clubs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {myClubs.map((membership, index) => (
                      <motion.div
                        key={membership.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                  {membership.clubName}
                                  {membership.isFeatured && (
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                  )}
                                </h3>
                                <Badge variant="outline" className="mb-3">
                                  {membership.role}
                                </Badge>
                              </div>
                            </div>

                            {membership.contribution && (
                              <p className="text-sm text-gray-400 mb-4">
                                {membership.contribution}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Joined {new Date(membership.joinedDate.seconds * 1000).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link to={`/clubs/${membership.clubId}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  View Club
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleLeaveClub(membership)}
                                title="Leave Club"
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>Join Requests History</CardTitle>
              </CardHeader>
              <CardContent>
                {joinRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No join requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {joinRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2">{request.clubName}</h4>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant={
                                  request.status === 'approved'
                                    ? 'default'
                                    : request.status === 'rejected'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {request.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Submitted {new Date(request.submittedAt.seconds * 1000).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="bg-slate-900/50 p-3 rounded-lg mb-3">
                              <p className="text-sm text-gray-400">
                                <span className="font-semibold text-gray-300">Reason: </span>
                                {request.reason}
                              </p>
                            </div>

                            {request.status === 'rejected' && request.rejectionReason && (
                              <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-lg">
                                <p className="text-sm text-red-400">
                                  <span className="font-semibold">Rejection Reason: </span>
                                  {request.rejectionReason}
                                </p>
                              </div>
                            )}

                            {request.status === 'approved' && (
                              <div className="bg-green-900/20 border border-green-700/50 p-3 rounded-lg mt-3">
                                <p className="text-sm text-green-400">
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  Your request has been approved! You are now a member of this club.
                                </p>
                              </div>
                            )}

                            {request.reviewedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Reviewed on {new Date(request.reviewedAt.seconds * 1000).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>Discover Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                {availableClubs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="mb-2">You've joined all available clubs!</p>
                    <p className="text-sm">Check back later for new clubs</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableClubs.map((club, index) => (
                      <motion.div
                        key={club.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all h-full">
                          <div className="relative h-32 overflow-hidden rounded-t-lg">
                            {club.banner ? (
                              <img
                                src={club.banner}
                                alt={club.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <Rocket className="w-12 h-12 text-white/20" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-2">{club.name}</h4>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                              {club.shortDescription || club.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                              <Users className="w-3 h-3" />
                              <span>{club.memberCount || 0} members</span>
                            </div>
                            <Link to={`/clubs/${club.slug}`}>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                View & Join
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}