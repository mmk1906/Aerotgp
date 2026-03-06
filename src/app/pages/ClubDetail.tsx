import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Rocket, 
  Calendar, 
  Mail,
  Upload,
  Plus 
} from 'lucide-react';
import { 
  getClubBySlug, 
  getClubProjects,
  getActiveClubMembers,
  getAllEvents,
  getApprovedGalleryPhotos,
  createClubApplication,
  Club,
  ClubProject,
  ClubMember,
  Event,
  GalleryPhoto
} from '../services/databaseService';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ClubMemberCard } from '../components/ClubMemberCard';
import { ImageLightbox } from '../components/ImageLightbox';

export function ClubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [projects, setProjects] = useState<ClubProject[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [applicationForm, setApplicationForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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
    if (user) {
      setApplicationForm(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email,
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const loadClubData = async () => {
    try {
      setLoading(true);
      
      // Load club data
      const clubData = await getClubBySlug(slug!);
      if (!clubData) {
        toast.error('Club not found');
        navigate('/clubs');
        return;
      }
      setClub(clubData);

      // Load club projects
      const projectsData = await getClubProjects(clubData.id!);
      setProjects(projectsData);

      // Load club members (for now, all active members - you can filter by clubId later)
      const membersData = await getActiveClubMembers();
      setMembers(membersData);

      // Load club events (filter by club category if needed)
      const eventsData = await getAllEvents();
      setEvents(eventsData.filter(e => e.status === 'upcoming').slice(0, 3));

      // Load gallery photos (filter by club category if needed)
      const photosData = await getApprovedGalleryPhotos();
      // Filter photos for this club - assuming category matches club name
      setGalleryPhotos(photosData.filter(p => 
        p.category?.toLowerCase().includes(clubData.name.toLowerCase())
      ).slice(0, 12));

    } catch (error) {
      console.error('Error loading club data:', error);
      toast.error('Failed to load club data');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!user) {
      toast.error('Please login to join the club');
      navigate('/login');
      return;
    }

    if (!applicationForm.fullName || !applicationForm.email || !applicationForm.department || 
        !applicationForm.year || !applicationForm.skills || !applicationForm.motivation) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createClubApplication({
        clubId: club!.id!,
        clubName: club!.name,
        userId: user.id,
        fullName: applicationForm.fullName,
        email: applicationForm.email,
        phone: applicationForm.phone,
        department: applicationForm.department,
        year: applicationForm.year,
        skills: applicationForm.skills,
        experience: applicationForm.experience,
        motivation: applicationForm.motivation,
        portfolio: applicationForm.portfolio,
        status: 'pending',
      });

      toast.success('Application submitted successfully! You will be notified once reviewed.');
      setIsJoinDialogOpen(false);
      setApplicationForm({
        fullName: user.name,
        email: user.email,
        phone: user.phone || '',
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
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return null;
  }

  const lightboxImages = galleryPhotos.map(photo => ({
    url: photo.imageUrl,
    caption: photo.caption,
  }));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/clubs')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Button>

        {/* Club Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden">
            {/* Banner */}
            {club.banner && (
              <div className="relative h-64 md:h-80">
                <img
                  src={club.banner}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              </div>
            )}

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {club.logo && (
                  <img
                    src={club.logo}
                    alt={`${club.name} logo`}
                    className="w-24 h-24 rounded-lg border-2 border-slate-700"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {club.name}
                  </h1>
                  <p className="text-xl text-gray-400 mb-6">{club.description}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    {club.memberCount && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-semibold">{club.memberCount}</span>
                        <span className="text-gray-400">Members</span>
                      </div>
                    )}
                    {club.establishedYear && (
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-semibold">Est. {club.establishedYear}</span>
                      </div>
                    )}
                    {club.facultyCoordinator && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-400">Coordinator: {club.facultyCoordinator}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setIsJoinDialogOpen(true)}
                  className="w-full md:w-auto"
                >
                  Join {club.name} <Rocket className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        {club.achievements && club.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Achievements</h2>
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {club.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Members */}
        {members.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Active Members</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.slice(0, 8).map((member, index) => (
                <ClubMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Club Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all h-full">
                    {project.imageUrl && (
                      <div className="relative h-48">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        {project.status && (
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                      {project.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-blue-400">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Photo Gallery */}
        {galleryPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Events */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Card key={event.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/events')}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Join Club Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Join {club.name}</DialogTitle>
            <DialogDescription>
              Fill out the application form to join our club. We'll review your application and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Full Name *</label>
                <Input
                  value={applicationForm.fullName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email *</label>
                <Input
                  type="email"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <Input
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Department *</label>
                <Input
                  value={applicationForm.department}
                  onChange={(e) => setApplicationForm({ ...applicationForm, department: e.target.value })}
                  placeholder="e.g., Computer Science"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Year of Study *</label>
              <Select
                value={applicationForm.year}
                onValueChange={(value) => setApplicationForm({ ...applicationForm, year: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-2">Skills / Interests *</label>
              <Textarea
                value={applicationForm.skills}
                onChange={(e) => setApplicationForm({ ...applicationForm, skills: e.target.value })}
                placeholder="List your relevant skills and interests..."
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Previous Experience (Optional)</label>
              <Textarea
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                placeholder="Any relevant previous experience..."
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Why do you want to join this club? *</label>
              <Textarea
                value={applicationForm.motivation}
                onChange={(e) => setApplicationForm({ ...applicationForm, motivation: e.target.value })}
                placeholder="Tell us about your motivation..."
                rows={4}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Portfolio / LinkedIn (Optional)</label>
              <Input
                value={applicationForm.portfolio}
                onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsJoinDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleJoinClub} className="flex-1">
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
