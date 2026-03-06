import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { 
  Rocket, 
  Users, 
  Image as ImageIcon, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Plus,
  Eye
} from 'lucide-react';
import { 
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  getClubApplications,
  updateClubApplication,
  Club,
  ClubApplication
} from '../services/databaseService';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';
import type { CloudinaryUploadResult } from '../services/cloudinaryService';

export function ClubManagementTab() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ClubApplication | null>(null);
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  const [clubForm, setClubForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    logo: '',
    banner: '',
    facultyCoordinator: '',
    memberCount: 0,
    establishedYear: '',
    achievements: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadClubs();
    loadApplications();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const fetchedClubs = await getAllClubs();
      setClubs(fetchedClubs);
    } catch (error) {
      console.error('Error loading clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const fetchedApplications = await getClubApplications();
      setApplications(fetchedApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    }
  };

  const handleCreateOrUpdateClub = async () => {
    if (!clubForm.name || !clubForm.slug || !clubForm.description) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingClub) {
        // Update existing club
        await updateClub(editingClub.id!, clubForm);
        toast.success('Club updated successfully!');
      } else {
        // Create new club
        await createClub(clubForm);
        toast.success('Club created successfully!');
      }
      
      // Reload clubs and reset form
      await loadClubs();
      setIsClubDialogOpen(false);
      resetClubForm();
    } catch (error) {
      console.error('Error saving club:', error);
      toast.error('Failed to save club');
    }
  };

  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setClubForm({
      name: club.name,
      slug: club.slug,
      description: club.description,
      shortDescription: club.shortDescription || '',
      logo: club.logo || '',
      banner: club.banner || '',
      facultyCoordinator: club.facultyCoordinator || '',
      memberCount: club.memberCount || 0,
      establishedYear: club.establishedYear || '',
      achievements: club.achievements || [],
      status: club.status || 'active',
    });
    setIsClubDialogOpen(true);
  };

  const handleDeleteClub = async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;

    try {
      await deleteClub(clubId);
      toast.success('Club deleted successfully!');
      await loadClubs();
    } catch (error) {
      console.error('Error deleting club:', error);
      toast.error('Failed to delete club');
    }
  };

  const resetClubForm = () => {
    setEditingClub(null);
    setClubForm({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      logo: '',
      banner: '',
      facultyCoordinator: '',
      memberCount: 0,
      establishedYear: '',
      achievements: [],
      status: 'active',
    });
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await updateClubApplication(applicationId, { status: 'approved' });
      toast.success('Application approved!');
      await loadApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateClubApplication(applicationId, { status: 'rejected' });
      toast.success('Application rejected!');
      await loadApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const handleLogoUpload = (result: CloudinaryUploadResult) => {
    setClubForm({ ...clubForm, logo: result.secure_url });
    toast.success('Logo uploaded successfully!');
  };

  const handleBannerUpload = (result: CloudinaryUploadResult) => {
    setClubForm({ ...clubForm, banner: result.secure_url });
    toast.success('Banner uploaded successfully!');
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setClubForm({ ...clubForm, name, slug });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clubs</p>
                <p className="text-3xl font-bold text-blue-500">{clubs.length}</p>
              </div>
              <Rocket className="w-12 h-12 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Members</p>
                <p className="text-3xl font-bold text-green-500">{members.length}</p>
              </div>
              <Users className="w-12 h-12 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-500">{pendingImages.length}</p>
              </div>
              <ImageIcon className="w-12 h-12 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Project Updates</p>
                <p className="text-3xl font-bold text-purple-500">{projectUpdates.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="clubs" className="space-y-6">
        <TabsList className="bg-slate-900/50 border-slate-700">
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="gallery">
            Gallery
            {pendingImages.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{pendingImages.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Clubs Tab */}
        <TabsContent value="clubs">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Clubs</CardTitle>
                <Button
                  onClick={() => {
                    setEditingClub(null);
                    setClubForm({
                      name: '',
                      description: '',
                      logo: '',
                      facultyCoordinator: '',
                      memberCount: 0,
                      establishedYear: '',
                    });
                    setIsClubDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Club
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clubs.map(club => (
                  <div
                    key={club.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{club.name}</h3>
                        <p className="text-sm text-gray-400">{club.facultyCoordinator}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{club.memberCount} members</span>
                          <span className="text-xs text-gray-500">Est. {club.establishedYear}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClub(club)}
                        className="border-slate-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClub(club.id)}
                        className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Members</CardTitle>
                <Button
                  onClick={() => {
                    setEditingMember(null);
                    setMemberForm({
                      name: '',
                      photo: '',
                      designation: '',
                      areaOfInterest: '',
                      email: '',
                      year: '',
                    });
                    setIsMemberDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-blue-400">{member.designation}</p>
                        <p className="text-xs text-gray-500">{member.areaOfInterest}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                        className="border-slate-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <div className="space-y-6">
            {/* Pending Approvals */}
            {pendingImages.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-yellow-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-500">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Pending Approvals ({pendingImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pendingImages.map(image => (
                      <div
                        key={image.id}
                        className="relative rounded-lg overflow-hidden border border-yellow-700"
                      >
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4 bg-slate-800">
                          <p className="text-sm font-semibold mb-1">{image.caption}</p>
                          <Badge className="mb-2">{image.eventTag}</Badge>
                          <p className="text-xs text-gray-500 mb-3">
                            By {image.uploadedBy} on {image.uploadedAt}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveImage(image.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectImage(image.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approved Images */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>Approved Gallery Images ({approvedImages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {approvedImages.map(image => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 border-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Project Updates ({projectUpdates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectUpdates.map(project => (
                  <div
                    key={project.id}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-gray-400">{project.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-600">{project.progressStage}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.teamMembers.map((member, idx) => (
                        <Badge key={idx} variant="outline" className="border-slate-600">
                          {member}
                        </Badge>
                      ))}
                    </div>
                    {project.images.length > 0 && (
                      <div className="flex space-x-2">
                        {project.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${project.title} ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Club Dialog */}
      <Dialog open={isClubDialogOpen} onOpenChange={setIsClubDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingClub ? 'Edit Club' : 'Add New Club'}</DialogTitle>
            <DialogDescription>
              {editingClub ? 'Update the club information below.' : 'Fill in the details to create a new club.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Club Name *</Label>
              <Input
                value={clubForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter club name"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={clubForm.slug}
                onChange={(e) => setClubForm({ ...clubForm, slug: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter club slug"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={clubForm.description}
                onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter club description"
              />
            </div>
            <div>
              <Label>Short Description</Label>
              <Textarea
                value={clubForm.shortDescription}
                onChange={(e) => setClubForm({ ...clubForm, shortDescription: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter short description"
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <CloudinaryImageUploader
                onUpload={handleLogoUpload}
                currentUrl={clubForm.logo}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label>Banner URL</Label>
              <CloudinaryImageUploader
                onUpload={handleBannerUpload}
                currentUrl={clubForm.banner}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label>Faculty Coordinator</Label>
              <Input
                value={clubForm.facultyCoordinator}
                onChange={(e) => setClubForm({ ...clubForm, facultyCoordinator: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Member Count</Label>
                <Input
                  type="number"
                  value={clubForm.memberCount}
                  onChange={(e) => setClubForm({ ...clubForm, memberCount: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label>Established Year</Label>
                <Input
                  value={clubForm.establishedYear}
                  onChange={(e) => setClubForm({ ...clubForm, establishedYear: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  placeholder="2020"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsClubDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateOrUpdateClub} className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update the member information below.' : 'Fill in the details to add a new member.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter member name"
              />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input
                value={memberForm.photo}
                onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <Label>Designation *</Label>
              <Input
                value={memberForm.designation}
                onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="President, Vice President, Core Member, etc."
              />
            </div>
            <div>
              <Label>Area of Interest *</Label>
              <Input
                value={memberForm.areaOfInterest}
                onChange={(e) => setMemberForm({ ...memberForm, areaOfInterest: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="UAV Design, Aerodynamics, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  placeholder="member@example.com"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={memberForm.year}
                  onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  placeholder="Final Year, Third Year, etc."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveMember} className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.caption}</DialogTitle>
                <DialogDescription>
                  View gallery image details
                </DialogDescription>
              </DialogHeader>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full h-auto rounded-lg"
              />
              <div className="space-y-2">
                <p className="text-sm"><strong>Event Tag:</strong> {selectedImage.eventTag}</p>
                <p className="text-sm"><strong>Uploaded By:</strong> {selectedImage.uploadedBy}</p>
                <p className="text-sm"><strong>Date:</strong> {selectedImage.uploadedAt}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}