import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plane, Users, Rocket, Trophy, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ClubMemberCard } from '../components/ClubMemberCard';
import { ProjectUpdateCard } from '../components/ProjectUpdateCard';
import { GalleryUploadForm } from '../components/GalleryUploadForm';
import { ProjectUpdateForm } from '../components/ProjectUpdateForm';
import { ImageLightbox } from '../components/ImageLightbox';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  mockClubMembers, 
  mockProjectUpdates,
  ClubMember,
  GalleryImage,
  ProjectUpdate
} from '../data/clubData';
import {
  createGalleryPhoto,
  getApprovedGalleryPhotos,
  GalleryPhoto
} from '../services/databaseService';

export function Clubs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [members, setMembers] = useState<ClubMember[]>(mockClubMembers);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);
  const [isProjectUpdateOpen, setIsProjectUpdateOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadGalleryFromFirebase();
    
    // Load project updates from localStorage (will migrate to Firebase later)
    const storedProjects = localStorage.getItem('projectUpdates');
    if (storedProjects) {
      setProjectUpdates(JSON.parse(storedProjects));
    } else {
      // Initialize with mock data
      localStorage.setItem('projectUpdates', JSON.stringify(mockProjectUpdates));
      setProjectUpdates(mockProjectUpdates);
    }
  }, []);

  const loadGalleryFromFirebase = async () => {
    try {
      const photos = await getApprovedGalleryPhotos();
      // Convert GalleryPhoto to GalleryImage format
      const galleryImgs: GalleryImage[] = photos.map(photo => ({
        id: photo.id || '',
        url: photo.imageUrl,
        caption: photo.caption,
        eventTag: photo.eventTag || 'Event',
        uploadedBy: photo.uploadedBy || 'Anonymous',
        uploadedAt: photo.uploadedAt ? new Date(photo.uploadedAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: photo.status as 'approved' | 'pending' | 'rejected',
      }));
      setGalleryImages(galleryImgs);
    } catch (error) {
      console.error('Error loading gallery from Firebase:', error);
      toast.error('Failed to load gallery images');
    }
  };

  const projects = [
    {
      title: 'Drone Assembly',
      description: 'Completion of Sucessful Drone workshop ',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    },
    {
      title: 'Solid Rocket model',
      description: 'Development of Solid Rocket Model',
      image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&q=80',
    },
    {
      title: 'Aircraft Design Competition',
      description: 'Participants of National Aero Design Competition 2026',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    },
  ];

  const handleGalleryUpload = async (newImage: GalleryImage) => {
    try {
      // Save to Firebase
      const photoData: Omit<GalleryPhoto, 'id'> = {
        imageUrl: newImage.url,
        publicId: '', // Will be extracted from URL if needed
        caption: newImage.caption,
        eventTag: newImage.eventTag,
        uploadedBy: newImage.uploadedBy,
        status: 'pending', // Requires admin approval
      };
      
      await createGalleryPhoto(photoData);
      toast.success('Image uploaded successfully! Pending admin approval.');
      
      // Don't add to local state since it's pending approval
      // It will appear after admin approves and page reloads
    } catch (error) {
      console.error('Error saving gallery photo:', error);
      toast.error('Failed to save image to database');
    }
  };

  const handleProjectUpdate = (newUpdate: ProjectUpdate) => {
    const updatedProjects = [newUpdate, ...projectUpdates];
    setProjectUpdates(updatedProjects);
    localStorage.setItem('projectUpdates', JSON.stringify(updatedProjects));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = galleryImages.map(img => ({
    url: img.url,
    caption: `${img.caption} - ${img.eventTag}`,
  }));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Aero Club
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join us in exploring the fascinating world of aerospace through hands-on projects and competitions
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">About Aero Club</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    The Aero Club is a student-led organization dedicated to promoting aviation and
                    aerospace knowledge through practical projects, workshops, and competitions.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Our members work on cutting-edge projects including UAV design, rocket systems, RC Plane
                    and participate in national level competitions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{members.length}</div>
                        <div className="text-sm text-gray-400">Active Members</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-sm text-gray-400">Awards Won</div>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => navigate('/join-aero-club')}>
                    Join Aero Club <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
                    alt="Aero Club"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Active Aero Club Members
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet our passionate team driving innovation and excellence in aerospace engineering
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <ClubMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Project Updates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Project Updates</h2>
              <p className="text-gray-400">Latest progress from ongoing projects</p>
            </div>
            {user && (
              <Button
                onClick={() => setIsProjectUpdateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Update
              </Button>
            )}
          </div>
          
          {projectUpdates.length > 0 ? (
            <div className="space-y-6">
              {projectUpdates.map((update, index) => (
                <ProjectUpdateCard 
                  key={update.id} 
                  update={update} 
                  index={index}
                  onImageClick={(imageUrl) => {
                    const imageIndex = galleryImages.findIndex(img => img.url === imageUrl);
                    if (imageIndex !== -1) {
                      openLightbox(imageIndex);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-12 text-center">
                <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No project updates yet. Be the first to share!</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Featured Projects Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                  <div className="relative h-48">
                    <img
                      src={
                        project.title === 'Drone Assembly' 
                          ? 'https://media.istockphoto.com/id/1352073818/photo/close-up-shot-of-hands-instalilng-propeller-to-quadcopter-concept-of-drone-assemble-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=qhjZFW4qk97BhJo5M0B1VuQ_MpFNVdgs8M14hO362yM='
                          : project.title === 'Solid Rocket model'
                          ? 'https://media.istockphoto.com/id/544969326/photo/space-launch-system-solid-rocket-boosters-separation.webp?a=1&b=1&s=612x612&w=0&k=20&c=GSpGqT96k6q6N_0YHvm8BdDaa-X_vm1GfA51TgdA7iQ='
                          : project.title === 'Aircraft Design Competition'
                          ? 'https://media.istockphoto.com/id/526308985/photo/airplane.webp?a=1&b=1&s=612x612&w=0&k=20&c=uLtR6TBiYBATJJNGgzbIuB4RnhzpNA_F1VIj4zs2o7I='
                          : project.image
                      }
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Photo Gallery</h2>
              <p className="text-gray-400">Memories from our events and activities</p>
            </div>
            {user && (
              <Button
                onClick={() => setIsGalleryUploadOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            )}
          </div>
          
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-semibold">{image.caption}</p>
                      <p className="text-blue-400 text-xs">{image.eventTag}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-12 text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No photos yet. Upload your first photo!</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Dialogs */}
      <GalleryUploadForm
        isOpen={isGalleryUploadOpen}
        onClose={() => setIsGalleryUploadOpen(false)}
        onUpload={handleGalleryUpload}
        userEmail={user?.email}
      />

      <ProjectUpdateForm
        isOpen={isProjectUpdateOpen}
        onClose={() => setIsProjectUpdateOpen(false)}
        onSubmit={handleProjectUpdate}
        userEmail={user?.email}
      />

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}