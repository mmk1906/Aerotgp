import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Rocket, Plus, Edit, Trash2, Loader2, Users, Image as ImageIcon } from 'lucide-react';
import {
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  recalculateClubCounts,
  Club
} from '../../services/clubService';
import { CloudinaryImageUploader } from '../CloudinaryImageUploader';
import type { CloudinaryUploadResult } from '../../services/cloudinaryService';

export function ClubsManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [clubForm, setClubForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    logo: '',
    banner: '',
    facultyCoordinator: '',
    establishedYear: '',
    category: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const clubsData = await getAllClubs();
      setClubs(clubsData);
    } catch (error) {
      console.error('Error loading clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClubForm({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      logo: '',
      banner: '',
      facultyCoordinator: '',
      establishedYear: '',
      category: '',
      status: 'active',
    });
    setEditingClub(null);
  };

  const handleOpenDialog = (club?: Club) => {
    if (club) {
      setEditingClub(club);
      setClubForm({
        name: club.name,
        slug: club.slug,
        description: club.description,
        shortDescription: club.shortDescription || '',
        logo: club.logo || '',
        banner: club.banner || '',
        facultyCoordinator: club.facultyCoordinator || '',
        establishedYear: club.establishedYear || '',
        category: club.category || '',
        status: club.status || 'active',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setClubForm({ ...clubForm, name, slug });
  };

  const handleLogoUpload = (result: CloudinaryUploadResult) => {
    setClubForm({ ...clubForm, logo: result.secure_url });
    toast.success('Logo uploaded successfully!');
  };

  const handleBannerUpload = (result: CloudinaryUploadResult) => {
    setClubForm({ ...clubForm, banner: result.secure_url });
    toast.success('Banner uploaded successfully!');
  };

  const handleSubmit = async () => {
    if (!clubForm.name || !clubForm.slug || !clubForm.description) {
      toast.error('Please fill all required fields (name, slug, description)');
      return;
    }

    try {
      setSubmitting(true);

      if (editingClub) {
        await updateClub(editingClub.id!, clubForm);
        toast.success('Club updated successfully!');
      } else {
        await createClub(clubForm);
        toast.success('Club created successfully!');
      }

      setIsDialogOpen(false);
      resetForm();
      await loadClubs();
    } catch (error: any) {
      console.error('Error saving club:', error);
      toast.error(error.message || 'Failed to save club');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (club: Club) => {
    if (!confirm(`Are you sure you want to delete ${club.name}? This will also delete all members and join requests.`)) {
      return;
    }

    try {
      await deleteClub(club.id!);
      toast.success('Club deleted successfully!');
      await loadClubs();
    } catch (error) {
      console.error('Error deleting club:', error);
      toast.error('Failed to delete club');
    }
  };

  const handleRecalculateCounts = async (club: Club) => {
    try {
      await recalculateClubCounts(club.id!);
      toast.success('Member counts recalculated!');
      await loadClubs();
    } catch (error) {
      console.error('Error recalculating counts:', error);
      toast.error('Failed to recalculate counts');
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Clubs</p>
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
                <p className="text-sm text-gray-400 mb-1">Active Clubs</p>
                <p className="text-3xl font-bold text-green-500">
                  {clubs.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Rocket className="w-12 h-12 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-purple-500">
                  {clubs.reduce((sum, club) => sum + (club.memberCount || 0), 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs List */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Clubs</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Club
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clubs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Rocket className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No clubs yet. Create your first club!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clubs.map(club => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {club.logo && (
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{club.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {club.shortDescription || club.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {club.memberCount || 0} members
                        </span>
                        {club.establishedYear && (
                          <span className="text-xs text-gray-500">Est. {club.establishedYear}</span>
                        )}
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
                      onClick={() => handleRecalculateCounts(club)}
                      title="Recalculate member counts"
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(club)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(club)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClub ? 'Edit Club' : 'Create New Club'}</DialogTitle>
            <DialogDescription>
              {editingClub ? 'Edit the details of an existing club.' : 'Create a new club.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Club Name *</Label>
                <Input
                  value={clubForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Aero Club"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>

              <div>
                <Label>URL Slug *</Label>
                <Input
                  value={clubForm.slug}
                  onChange={(e) => setClubForm({ ...clubForm, slug: e.target.value })}
                  placeholder="e.g., aero-club"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">URL: /clubs/{clubForm.slug || '...'}</p>
              </div>

              <div>
                <Label>Faculty Coordinator</Label>
                <Input
                  value={clubForm.facultyCoordinator}
                  onChange={(e) => setClubForm({ ...clubForm, facultyCoordinator: e.target.value })}
                  placeholder="Dr. Name"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>

              <div>
                <Label>Established Year</Label>
                <Input
                  value={clubForm.establishedYear}
                  onChange={(e) => setClubForm({ ...clubForm, establishedYear: e.target.value })}
                  placeholder="2020"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={clubForm.category}
                  onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
                  placeholder="e.g., Technical"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={clubForm.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setClubForm({ ...clubForm, status: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <Label>Short Description</Label>
              <Textarea
                value={clubForm.shortDescription}
                onChange={(e) => setClubForm({ ...clubForm, shortDescription: e.target.value })}
                placeholder="Brief description (shown in club cards)"
                rows={2}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div>
              <Label>Full Description *</Label>
              <Textarea
                value={clubForm.description}
                onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                placeholder="Full club description"
                rows={5}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Club Logo</Label>
                {clubForm.logo ? (
                  <div className="relative">
                    <img
                      src={clubForm.logo}
                      alt="Logo preview"
                      className="w-full h-32 object-cover rounded-lg border border-slate-700"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setClubForm({ ...clubForm, logo: '' })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <CloudinaryImageUploader
                    onUploadComplete={handleLogoUpload}
                    category="club"
                  />
                )}
              </div>

              <div>
                <Label className="mb-2 block">Club Banner</Label>
                {clubForm.banner ? (
                  <div className="relative">
                    <img
                      src={clubForm.banner}
                      alt="Banner preview"
                      className="w-full h-32 object-cover rounded-lg border border-slate-700"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setClubForm({ ...clubForm, banner: '' })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <CloudinaryImageUploader
                    onUploadComplete={handleBannerUpload}
                    category="club"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingClub ? 'Update Club' : 'Create Club'}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}