import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Users, 
  Award, 
  Calendar, 
  TrendingUp, 
  Star,
  ArrowLeft,
  UserPlus,
  Loader2,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  getClubBySlug,
  getClubMembers,
  getClubProjects,
  getClubMemberProgress,
  createClubApplication,
  getUserClubMemberships,
  getAllEvents,
  Club,
  ClubMember,
  ClubProject,
  MemberProgress,
  Event
} from '../services/databaseService';

export function ClubDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<ClubMember[]>([]);
  const [projects, setProjects] = useState<ClubProject[]>([]);
  const [progress, setProgress] = useState<MemberProgress[]>([]);
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    skills: '',
    experience: '',
    motivation: '',
    portfolio: '',
  });

  useEffect(() => {
    if (slug) {
      loadClubData();
    }
  }, [slug]);

  useEffect(() => {
    if (user && club) {
      checkMembership();
    }
  }, [user, club]);

  const loadClubData = async () => {
    try {
      setLoading(true);
      
      // Fetch club details
      const clubData = await getClubBySlug(slug!);
      if (!clubData) {
        toast.error('Club not found');
        navigate('/clubs');
        return;
      }
      setClub(clubData);

      // Fetch members
      const membersData = await getClubMembers(clubData.id!);
      setMembers(membersData.filter(m => m.status === 'active'));
      setFeaturedMembers(membersData.filter(m => m.status === 'active' && m.isFeatured));

      // Fetch projects with fallback
      try {
        const projectsData = await getClubProjects(clubData.id!);
        setProjects(projectsData);
      } catch (projectError) {
        console.warn('Could not load club projects (Firebase permissions may need updating):', projectError);
        setProjects([]); // Fallback to empty array
      }

      // Fetch member progress with fallback
      try {
        const progressData = await getClubMemberProgress(clubData.id!);
        setProgress(progressData);
      } catch (progressError) {
        console.warn('Could not load member progress (Firebase permissions may need updating):', progressError);
        setProgress([]); // Fallback to empty array
      }

      // Fetch related events (simplified - could filter by club tag)
      const allEvents = await getAllEvents();
      setClubEvents(allEvents.slice(0, 3)); // Show latest 3 events

    } catch (error) {
      console.error('Error loading club data:', error);
      // Don't show error toast if it's just permissions for optional data
      if (error instanceof Error && !error.message.includes('permission')) {
        toast.error('Failed to load club details');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    if (!user || !club) return;
    
    try {
      const memberships = await getUserClubMemberships(user.uid);
      const isMember = memberships.some(m => m.clubId === club.id && m.status === 'active');
      setIsAlreadyMember(isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleJoinClub = () => {
    if (!user) {
      toast.error('Please login to join the club');
      navigate('/login');
      return;
    }

    setFormData({
      fullName: user.displayName || '',
      email: user.email || '',
      phone: '',
      department: '',
      year: '',
      skills: '',
      experience: '',
      motivation: '',
      portfolio: '',
    });
    setShowJoinDialog(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.motivation) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      await createClubApplication({
        clubId: club!.id!,
        clubName: club!.name,
        userId: user!.uid,
        ...formData,
        status: 'pending',
      });

      toast.success('Application submitted successfully! Admin will review it soon.');
      setShowJoinDialog(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        year: '',
        skills: '',
        experience: '',
        motivation: '',
        portfolio: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Club not found</p>
          <Button onClick={() => navigate('/clubs')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/clubs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Button>

        {/* Club Header with Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          {club.banner && (
            <div className="h-64 rounded-2xl overflow-hidden mb-6">
              <img 
                src={club.banner} 
                alt={club.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>
          )}

          <div className="flex items-start gap-6">
            {club.logo && (
              <img 
                src={club.logo} 
                alt={club.name}
                className="w-24 h-24 rounded-xl shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {club.name}
              </h1>
              {club.shortDescription && (
                <p className="text-xl text-gray-400 mb-4">{club.shortDescription}</p>
              )}
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  {members.length} Members
                </Badge>
                {club.establishedYear && (
                  <Badge variant="outline" className="px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Est. {club.establishedYear}
                  </Badge>
                )}
                {club.category && (
                  <Badge variant="outline" className="px-4 py-2">
                    {club.category}
                  </Badge>
                )}
              </div>
            </div>

            {!isAlreadyMember && (
              <Button 
                size="lg" 
                onClick={handleJoinClub}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join Club
              </Button>
            )}
            {isAlreadyMember && (
              <Badge className="bg-green-600 px-6 py-3 text-base">
                ✓ Member
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Club Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: 'Active Members', value: members.length, color: 'text-blue-500' },
            { icon: Target, label: 'Active Projects', value: projects.filter(p => p.status === 'ongoing').length, color: 'text-green-500' },
            { icon: Trophy, label: 'Achievements', value: club.achievements?.length || 0, color: 'text-yellow-500' },
            { icon: Zap, label: 'Events', value: clubEvents.length, color: 'text-purple-500' },
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
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-12 h-12 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Club Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">About {club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {club.description}
              </p>
              {club.facultyCoordinator && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Faculty Coordinator</p>
                  <p className="text-lg font-semibold text-blue-400">{club.facultyCoordinator}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        {club.achievements && club.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {club.achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg"
                    >
                      <Trophy className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-300">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Featured Members */}
        {featuredMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-blue-700/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Featured Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredMembers.map((member) => (
                    <Card key={member.id} className="bg-slate-900/50 border-slate-700">
                      <CardContent className="p-6 text-center">
                        <div className="relative inline-block mb-4">
                          <img 
                            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userName)}&background=3b82f6&color=fff&size=128`}
                            alt={member.userName}
                            className="w-24 h-24 rounded-full object-cover mx-auto"
                          />
                          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
                            <Star className="w-4 h-4 text-slate-900 fill-current" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{member.userName}</h3>
                        <p className="text-blue-400 text-sm mb-2">{member.role}</p>
                        {member.contribution && (
                          <p className="text-sm text-gray-400">{member.contribution}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Members */}
        {members.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-500" />
                  Active Members ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <div 
                      key={member.id}
                      className="text-center group"
                    >
                      <img 
                        src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userName)}&background=3b82f6&color=fff&size=128`}
                        alt={member.userName}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-slate-700 group-hover:border-blue-500 transition-colors"
                      />
                      <h3 className="font-semibold text-sm mb-1">{member.userName}</h3>
                      <p className="text-xs text-blue-400">{member.role}</p>
                      {member.department && (
                        <p className="text-xs text-gray-500 mt-1">{member.department}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Projects */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-500" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold">{project.title}</h3>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{project.description}</p>
                        {project.progress !== undefined && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-blue-400 font-semibold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Join Club Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Join {club.name}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitApplication} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="year">Year of Study</Label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="List your relevant skills (e.g., CAD, Programming, Design)"
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <Label htmlFor="motivation">Why do you want to join? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Tell us what motivates you to join this club"
                rows={4}
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio/LinkedIn (Optional)</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}