import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
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
  RefreshCw,
  Award,
  TrendingUp,
  Target,
  Zap,
  Plus,
  Image as ImageIcon,
  Upload,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import {
  getUserClubMemberships,
  getUserJoinRequests,
  getActiveClubs,
  ClubMember,
  ClubJoinRequest,
  Club,
  getClubProjects,
  ClubProject,
  createClubProject,
  updateClubProject,
  getMemberProgressByUser,
  MemberProgress,
  createMemberProgress,
  updateMemberProgress
} from '../../services/clubService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function MyClubsEnhanced() {
  const { user } = useAuth();
  
  const [myClubs, setMyClubs] = useState<ClubMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<ClubJoinRequest[]>([]);
  const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
  const [clubProjects, setClubProjects] = useState<Record<string, ClubProject[]>>({});
  const [memberProgress, setMemberProgress] = useState<Record<string, MemberProgress>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedClubForProject, setSelectedClubForProject] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // New project form
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    status: 'ongoing' as 'ongoing' | 'completed',
    progress: 0,
    teamMembers: [] as string[],
    startDate: new Date().toISOString().split('T')[0]
  });

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

      // Load projects for each club
      const projectsData: Record<string, ClubProject[]> = {};
      const progressData: Record<string, MemberProgress> = {};
      
      for (const membership of memberships) {
        if (membership.clubId) {
          const projects = await getClubProjects(membership.clubId);
          projectsData[membership.clubId] = projects;
          
          // Load member progress
          const progressList = await getMemberProgressByUser(user!.id, membership.clubId);
          if (progressList.length > 0) {
            progressData[membership.clubId] = progressList[0];
          }
        }
      }
      
      setClubProjects(projectsData);
      setMemberProgress(progressData);

      // Filter available clubs
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(file, 'club-projects');
      setNewProject({ ...newProject, imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProject = async () => {
    if (!selectedClubForProject || !newProject.title || !newProject.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createClubProject({
        clubId: selectedClubForProject,
        ...newProject,
        teamMembers: [user!.name],
        startDate: newProject.startDate
      });

      toast.success('Project created successfully!');
      setShowNewProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        imageUrl: '',
        status: 'ongoing',
        progress: 0,
        teamMembers: [],
        startDate: new Date().toISOString().split('T')[0]
      });
      loadData(true);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProjectProgress = async (projectId: string, clubId: string, newProgress: number) => {
    try {
      await updateClubProject(projectId, {
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'ongoing'
      });
      toast.success('Project progress updated');
      loadData(true);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  const totalProgress = Object.values(memberProgress).reduce((sum, p) => sum + p.projectsCompleted, 0);
  const totalEvents = Object.values(memberProgress).reduce((sum, p) => sum + p.eventsParticipated.length, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
              <Rocket className="w-10 h-10" />
              My Clubs Dashboard
            </h1>
            <p className="text-blue-100 text-lg">
              Track your journey, showcase your projects, and grow with your clubs
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="secondary"
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1 font-medium">Joined Clubs</p>
                  <p className="text-4xl font-bold">{myClubs.length}</p>
                </div>
                <Rocket className="w-14 h-14 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1 font-medium">Projects Completed</p>
                  <p className="text-4xl font-bold">{totalProgress}</p>
                </div>
                <Target className="w-14 h-14 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 mb-1 font-medium">Events Participated</p>
                  <p className="text-4xl font-bold">{totalEvents}</p>
                </div>
                <Award className="w-14 h-14 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1 font-medium">Available Clubs</p>
                  <p className="text-4xl font-bold">{availableClubs.length}</p>
                </div>
                <Sparkles className="w-14 h-14 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="my-clubs" className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-gray-800 p-1">
            <TabsTrigger value="my-clubs" className="data-[state=active]:bg-blue-600">
              <Rocket className="w-4 h-4 mr-2" />
              My Clubs ({myClubs.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-600">
              <GitBranch className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-yellow-600">
              <Clock className="w-4 h-4 mr-2" />
              Requests ({joinRequests.length})
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-green-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover ({availableClubs.length})
            </TabsTrigger>
          </TabsList>

          {/* My Clubs Tab - Enhanced */}
          <TabsContent value="my-clubs">
            {myClubs.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="text-center py-16">
                  <Rocket className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">No Clubs Yet</h3>
                  <p className="text-gray-400 mb-6">Join a club to start your journey!</p>
                  <Link to="/clubs">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Browse Clubs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map((membership, index) => {
                  const progress = memberProgress[membership.clubId];
                  const projects = clubProjects[membership.clubId] || [];
                  
                  return (
                    <motion.div
                      key={membership.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all h-full group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <CardContent className="p-6 relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                {membership.clubName}
                                {membership.isFeatured && (
                                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                                )}
                              </h3>
                              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                                {membership.role}
                              </Badge>
                            </div>
                          </div>

                          {membership.contribution && (
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                              {membership.contribution}
                            </p>
                          )}

                          {/* Progress Stats */}
                          {progress && (
                            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Projects:</span>
                                <span className="font-semibold text-blue-400">{progress.projectsCompleted}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Tasks:</span>
                                <span className="font-semibold text-purple-400">{progress.tasksContributed}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Events:</span>
                                <span className="font-semibold text-pink-400">{progress.eventsParticipated.length}</span>
                              </div>
                            </div>
                          )}

                          {/* Active Projects Count */}
                          {projects.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 bg-gray-800/30 rounded-lg p-2">
                              <GitBranch className="w-4 h-4 text-green-500" />
                              <span>{projects.filter(p => p.status === 'ongoing').length} active project(s)</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(membership.joinedDate?.seconds ? membership.joinedDate.seconds * 1000 : membership.joinedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <Link to={`/clubs/${membership.clubId}`} className="w-full block">
                            <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                              <ArrowRight className="w-4 h-4 mr-2" />
                              View Club
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab - NEW! */}
          <TabsContent value="projects">
            <div className="space-y-6">
              {/* Add Project Button */}
              {myClubs.length > 0 && (
                <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all"
                  onClick={() => {
                    setShowNewProjectModal(true);
                    setSelectedClubForProject(myClubs[0].clubId);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Add New Project</h3>
                        <p className="text-purple-100">Showcase what you're working on</p>
                      </div>
                      <Plus className="w-10 h-10" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects Grid */}
              {Object.keys(clubProjects).length === 0 ? (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="text-center py-16">
                    <GitBranch className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-gray-400">Start your first project!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(clubProjects).flatMap(([clubId, projects]) =>
                    projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all overflow-hidden group">
                          {project.imageUrl && (
                            <div className="relative h-48 overflow-hidden">
                              <ImageWithFallback
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                              <Badge className={`absolute top-4 right-4 ${
                                project.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                              } border-0`}>
                                {project.status === 'completed' ? '✓ Completed' : '⚡ Ongoing'}
                              </Badge>
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-gray-400 mb-4 text-sm line-clamp-2">{project.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="font-semibold text-purple-400">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>

                            {/* Team Members */}
                            {project.teamMembers && project.teamMembers.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <Users className="w-4 h-4" />
                                <span>{project.teamMembers.length} team member(s)</span>
                              </div>
                            )}

                            {/* Update Progress */}
                            {project.status === 'ongoing' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateProjectProgress(project.id!, clubId, Math.min((project.progress || 0) + 10, 100))}
                                  className="flex-1"
                                >
                                  <TrendingUp className="w-4 h-4 mr-2" />
                                  +10% Progress
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* New Project Modal */}
            {showNewProjectModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select Club</Label>
                      <select
                        className="w-full mt-2 bg-gray-800 border-gray-700 rounded-lg p-3 text-white"
                        value={selectedClubForProject || ''}
                        onChange={(e) => setSelectedClubForProject(e.target.value)}
                      >
                        {myClubs.map(club => (
                          <option key={club.clubId} value={club.clubId}>
                            {club.clubName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Project Title *</Label>
                      <Input
                        className="mt-2 bg-gray-800 border-gray-700"
                        placeholder="Enter project title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        className="mt-2 bg-gray-800 border-gray-700 min-h-[100px]"
                        placeholder="Describe your project..."
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Project Image</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="project-image"
                        />
                        <label
                          htmlFor="project-image"
                          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : newProject.imageUrl ? (
                            <div className="text-center">
                              <ImageIcon className="w-6 h-6 mx-auto mb-2 text-green-500" />
                              <span className="text-sm text-green-500">Image uploaded ✓</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm">Click to upload image</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => setShowNewProjectModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateProject}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Create Project
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </TabsContent>

          {/* Requests Tab - Keep existing */}
          <TabsContent value="requests">
            <Card className="bg-gray-900/50 border-gray-800">
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
                        className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2">{request.clubName}</h4>
                            <div className="space-y-1 text-sm text-gray-400">
                              <p>Applied: {new Date(request.submittedDate?.seconds ? request.submittedDate.seconds * 1000 : request.submittedDate).toLocaleDateString()}</p>
                              {request.motivation && <p className="line-clamp-2">{request.motivation}</p>}
                            </div>
                          </div>
                          <Badge
                            variant={
                              request.status === 'approved' ? 'default' :
                              request.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                            className="ml-4"
                          >
                            {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {request.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discover Tab - Keep existing but enhanced */}
          <TabsContent value="discover">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Discover New Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                {availableClubs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No available clubs to join</p>
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
                        <Link to={`/clubs/${club.slug}`}>
                          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all h-full group">
                            {club.banner && (
                              <div className="relative h-40 overflow-hidden">
                                <ImageWithFallback
                                  src={club.banner}
                                  alt={club.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                              </div>
                            )}
                            <CardContent className="p-6">
                              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                {club.name}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                {club.shortDescription || club.description}
                              </p>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        </Link>
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
