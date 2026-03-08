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
  Plus,
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  getClubApplications,
  updateClubApplication,
  createClubMember,
  Club,
  ClubApplication
} from '../services/databaseService';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';
import type { CloudinaryUploadResult } from '../services/cloudinaryService';

export function ClubManagementSimplified() {
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
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedClubs, fetchedApplications] = await Promise.all([
        getAllClubs(),
        getClubApplications()
      ]);
      setClubs(fetchedClubs);
      setApplications(fetchedApplications);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateClub = async () => {
    if (!clubForm.name || !clubForm.slug || !clubForm.description) {
      toast.error('Please fill all required fields (name, slug, description)');
      return;
    }

    try {
      if (editingClub) {
        await updateClub(editingClub.id!, clubForm);
        toast.success('Club updated successfully!');
      } else {
        await createClub(clubForm);
        toast.success('Club created successfully!');
      }
      
      await loadData();
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
      status: club.status || 'active',
    });
    setIsClubDialogOpen(true);
  };

  const handleDeleteClub = async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;

    try {
      await deleteClub(clubId);
      toast.success('Club deleted successfully!');
      await loadData();
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
      status: 'active',
    });
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      // Find the application details
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        toast.error('Application not found');
        return;
      }

      // Update application status
      await updateClubApplication(applicationId, { status: 'approved' });

      // Create club member entry
      await createClubMember({
        clubId: application.clubId,
        clubName: application.clubName,
        userId: application.userId || '',
        userName: application.fullName,
        email: application.email,
        phone: application.phone,
        department: application.department,
        year: application.year,
        role: 'Member',
        contribution: '',
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        isFeatured: false,
      });

      toast.success('Application approved and member added!');
      await loadData();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateClubApplication(applicationId, { status: 'rejected' });
      toast.success('Application rejected!');
      await loadData();
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

  const pendingApplications = applications.filter(app => app.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm text-gray-400">Total Applications</p>
                <p className="text-3xl font-bold text-green-500">{applications.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Applications</p>
                <p className="text-3xl font-bold text-yellow-500">{pendingApplications.length}</p>
              </div>
              <Eye className="w-12 h-12 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="clubs" className="space-y-6">
        <TabsList className="bg-slate-900/50 border-slate-700">
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {pendingApplications.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{pendingApplications.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Clubs Tab */}
        <TabsContent value="clubs">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Clubs</CardTitle>
                <Button
                  onClick={() => {
                    resetClubForm();
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
              {clubs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No clubs yet. Create your first club!
                </div>
              ) : (
                <div className="space-y-4">
                  {clubs.map(club => (
                    <div
                      key={club.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center space-x-4">
                        {club.logo && (
                          <img
                            src={club.logo}
                            alt={club.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{club.name}</h3>
                          <p className="text-sm text-gray-400">{club.shortDescription || club.description.slice(0, 100)}...</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{club.memberCount || 0} members</span>
                            <span className="text-xs text-gray-500">Est. {club.establishedYear || 'N/A'}</span>
                            <Badge variant={club.status === 'active' ? 'default' : 'secondary'}>
                              {club.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClub(club)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClub(club.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Club Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No applications yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{app.fullName}</div>
                            <div className="text-sm text-gray-400">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{app.clubName}</TableCell>
                        <TableCell>{app.department}</TableCell>
                        <TableCell>{app.year}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              app.status === 'approved'
                                ? 'default'
                                : app.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedApplication(app)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {app.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-500"
                                  onClick={() => handleApproveApplication(app.id!)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(app.id!)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Club Dialog */}
      <Dialog open={isClubDialogOpen} onOpenChange={setIsClubDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
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
                className="bg-slate-800 border-slate-700 mt-1"
                placeholder="e.g., Aero Club"
              />
            </div>
            <div>
              <Label>Slug (auto-generated) *</Label>
              <Input
                value={clubForm.slug}
                onChange={(e) => setClubForm({ ...clubForm, slug: e.target.value })}
                className="bg-slate-800 border-slate-700 mt-1"
                placeholder="aero-club"
              />
              <p className="text-xs text-gray-500 mt-1">Used in URL: /clubs/{clubForm.slug}</p>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={clubForm.description}
                onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                className="bg-slate-800 border-slate-700 mt-1"
                rows={4}
                placeholder="Full club description..."
              />
            </div>
            <div>
              <Label>Short Description</Label>
              <Textarea
                value={clubForm.shortDescription}
                onChange={(e) => setClubForm({ ...clubForm, shortDescription: e.target.value })}
                className="bg-slate-800 border-slate-700 mt-1"
                rows={2}
                placeholder="Brief one-liner for club cards..."
              />
            </div>
            <div>
              <Label>Club Logo</Label>
              <CloudinaryImageUploader
                onUpload={handleLogoUpload}
                currentUrl={clubForm.logo}
              />
            </div>
            <div>
              <Label>Club Banner</Label>
              <CloudinaryImageUploader
                onUpload={handleBannerUpload}
                currentUrl={clubForm.banner}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Faculty Coordinator</Label>
                <Input
                  value={clubForm.facultyCoordinator}
                  onChange={(e) => setClubForm({ ...clubForm, facultyCoordinator: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                  placeholder="Dr. John Doe"
                />
              </div>
              <div>
                <Label>Established Year</Label>
                <Input
                  value={clubForm.establishedYear}
                  onChange={(e) => setClubForm({ ...clubForm, establishedYear: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                  placeholder="2020"
                />
              </div>
            </div>
            <div>
              <Label>Member Count</Label>
              <Input
                type="number"
                value={clubForm.memberCount}
                onChange={(e) => setClubForm({ ...clubForm, memberCount: parseInt(e.target.value) || 0 })}
                className="bg-slate-800 border-slate-700 mt-1"
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsClubDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdateClub} className="bg-blue-600 hover:bg-blue-700">
                {editingClub ? 'Update Club' : 'Create Club'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-semibold">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold">{selectedApplication.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="font-semibold">{selectedApplication.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Year</p>
                  <p className="font-semibold">{selectedApplication.year}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Skills</p>
                <p className="text-sm bg-slate-800/50 p-3 rounded">{selectedApplication.skills}</p>
              </div>
              {selectedApplication.experience && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Experience</p>
                  <p className="text-sm bg-slate-800/50 p-3 rounded">{selectedApplication.experience}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400 mb-1">Motivation</p>
                <p className="text-sm bg-slate-800/50 p-3 rounded">{selectedApplication.motivation}</p>
              </div>
              {selectedApplication.portfolio && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Portfolio</p>
                  <a 
                    href={selectedApplication.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {selectedApplication.portfolio}
                  </a>
                </div>
              )}
              {selectedApplication.status === 'pending' && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveApplication(selectedApplication.id!);
                      setSelectedApplication(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleRejectApplication(selectedApplication.id!);
                      setSelectedApplication(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}