import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { 
  Plane, 
  Users, 
  Upload, 
  Image as ImageIcon, 
  Rocket,
  Calendar,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function PortalAeroClub() {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    teamMembers: '',
    stage: 'Planning',
  });

  useEffect(() => {
    // Check if user is a club member
    const applications = JSON.parse(localStorage.getItem('aeroClubApplications') || '[]');
    const userApp = applications.find((app: any) => app.email === user?.email);
    
    if (userApp) {
      setApplicationStatus(userApp.status);
      setIsMember(userApp.status === 'approved');
    }

    // Load projects
    const savedProjects = JSON.parse(localStorage.getItem('clubProjects') || '[]');
    setProjects(savedProjects);

    // Load gallery
    const savedGallery = JSON.parse(localStorage.getItem('clubGallery') || '[]');
    setGallery(savedGallery);
  }, [user]);

  const handleSubmitProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project = {
      id: Date.now().toString(),
      ...newProject,
      authorId: user?.id,
      authorName: user?.name,
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('clubProjects', JSON.stringify(updatedProjects));
    
    setIsProjectDialogOpen(false);
    setNewProject({ title: '', description: '', teamMembers: '', stage: 'Planning' });
    toast.success('Project update posted successfully!');
  };

  const getStatusIcon = () => {
    switch (applicationStatus) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (applicationStatus) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400">Active Member</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400">Application Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Application Pending</Badge>;
      default:
        return null;
    }
  };

  if (applicationStatus === 'none') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Plane className="w-24 h-24 mx-auto mb-6 text-blue-500" />
              <h2 className="text-3xl font-bold mb-4">Join the Aero Club</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                You haven't applied to join the Aero Club yet. Join our community of aviation
                enthusiasts and work on exciting aerospace projects!
              </p>
              <Link to="/join-aero-club">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Apply to Join
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (applicationStatus === 'pending') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
              <h2 className="text-3xl font-bold mb-4">Application Under Review</h2>
              <p className="text-gray-400 mb-6">
                Your application to join the Aero Club is currently being reviewed by the admin team.
                We'll notify you once a decision has been made.
              </p>
              {getStatusBadge()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (applicationStatus === 'rejected') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <XCircle className="w-24 h-24 mx-auto mb-6 text-red-500" />
              <h2 className="text-3xl font-bold mb-4">Application Not Approved</h2>
              <p className="text-gray-400 mb-6">
                Unfortunately, your application to join the Aero Club was not approved at this time.
                You can apply again in the future.
              </p>
              {getStatusBadge()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Member View
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Plane className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Aero Club Portal</h1>
            </div>
            <p className="text-blue-100">
              Welcome to the club! Collaborate on projects and share your work.
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer"
            onClick={() => setIsProjectDialogOpen(true)}
          >
            <CardContent className="p-6 text-center">
              <Rocket className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h3 className="font-bold mb-1">Post Project Update</h3>
              <p className="text-sm text-gray-400">Share your project progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <h3 className="font-bold mb-1">Upload Photos</h3>
              <p className="text-sm text-gray-400">Add to club gallery</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/clubs">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h3 className="font-bold mb-1">View Members</h3>
                <p className="text-sm text-gray-400">See team roster</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Project Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-blue-500" />
                <span>Project Updates</span>
              </CardTitle>
              <Button onClick={() => setIsProjectDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Update
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-3">{project.description}</p>
                      </div>
                      <Badge variant="outline">{project.stage}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.teamMembers || 'Team'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-gray-400">By {project.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Rocket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No project updates yet. Be the first to share!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Post Project Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Enter project title"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project progress..."
                rows={4}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Team Members</label>
              <Input
                value={newProject.teamMembers}
                onChange={(e) => setNewProject({ ...newProject, teamMembers: e.target.value })}
                placeholder="Enter team member names"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Progress Stage</label>
              <select
                value={newProject.stage}
                onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              >
                <option value="Planning">Planning</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitProject} className="bg-blue-600 hover:bg-blue-700">
                Post Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
