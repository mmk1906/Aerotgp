import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Users, Plus, Edit, Trash2, Mail, Phone, Award } from 'lucide-react';
import { toast } from 'sonner';
import { getAllFaculty, createFaculty, updateFaculty, deleteFaculty, Faculty } from '../services/databaseService';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';

export function FacultyManagementTab() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState<Partial<Faculty>>({
    name: '',
    designation: '',
    role: '',
    qualification: '',
    specialization: '',
    email: '',
    phone: '',
    photo: '',
    department: '',
    experience: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const fetchedFaculty = await getAllFaculty();
      setFaculty(fetchedFaculty);
    } catch (error) {
      console.error('Error loading faculty:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      designation: 'Assistant Professor',
      role: 'Assistant Professor',
      qualification: '',
      specialization: '',
      email: '',
      phone: '',
      photo: '',
      department: 'Aeronautical Engineering',
      experience: '',
    });
    setShowDialog(true);
  };

  const handleEdit = (member: Faculty) => {
    setEditingFaculty(member);
    setFormData(member);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.designation) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      if (editingFaculty) {
        await updateFaculty(editingFaculty.id!, formData);
        toast.success('Faculty member updated successfully');
      } else {
        await createFaculty(formData as Faculty);
        toast.success('Faculty member added successfully');
      }

      setShowDialog(false);
      loadFaculty();
      setFormData({
        name: '',
        designation: '',
        role: '',
        qualification: '',
        specialization: '',
        email: '',
        phone: '',
        photo: '',
        department: '',
        experience: '',
      });
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error('Failed to save faculty member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) {
      return;
    }

    try {
      await deleteFaculty(id);
      toast.success('Faculty member deleted successfully');
      loadFaculty();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty member');
    }
  };

  return (
    <>
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Faculty Management
            </CardTitle>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading faculty members...</p>
            </div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No faculty members added yet</p>
              <Button onClick={handleAdd} className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Faculty Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-blue-400">{member.designation}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(member.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              {editingFaculty ? 'Update the details of an existing faculty member.' : 'Add a new faculty member to the database.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Photo Upload */}
            <div>
              <Label>Faculty Photo *</Label>
              <CloudinaryImageUploader
                onImageUploaded={(url) => setFormData({ ...formData, photo: url })}
                buttonText="Upload Photo"
              />
              {formData.photo && (
                <div className="mt-2">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, photo: '' })}
                    className="mt-2"
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Designation */}
            <div>
              <Label htmlFor="designation">Designation *</Label>
              <select
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                required
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="HOD">Head of Department</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Hierarchical Role *</Label>
              <select
                id="role"
                value={formData.role || 'Assistant Professor'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                required
              >
                <option value="HOD">HOD (Head of Department)</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">This determines display order on the Faculty page</p>
            </div>

            {/* Qualification */}
            <div>
              <Label htmlFor="qualification">Qualification *</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="Ph.D., M.Tech, B.Tech"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Specialization */}
            <div>
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Aerodynamics, Propulsion, etc."
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@university.edu"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Aeronautical Engineering"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="15+ years in academia"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Saving...' : editingFaculty ? 'Update Faculty' : 'Add Faculty'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}