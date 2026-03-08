import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Plus, Edit, Trash2, Mail, Phone, Award, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllFaculty, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty, 
  Faculty 
} from '../services/databaseService';

const DESIGNATIONS = [
  'HOD',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lab Instructor',
  'Visiting Faculty'
];

const QUALIFICATIONS = [
  'Ph.D.',
  'M.Tech',
  'M.E.',
  'B.Tech',
  'B.E.'
];

export function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({
    name: '',
    designation: 'Assistant Professor',
    role: 'Assistant Professor',
    department: 'Aeronautical Engineering',
    email: '',
    phone: '',
    specialization: '',
    qualification: 'Ph.D.',
    experience: '',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
    researchInterests: [],
    publications: []
  });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const fetchedFaculty = await getAllFaculty();
      
      // Sort faculty by role hierarchy
      const roleOrder = {
        'HOD': 0,
        'Professor': 1,
        'Associate Professor': 2,
        'Assistant Professor': 3,
        'Other': 4
      };
      
      const sortedFaculty = fetchedFaculty.sort((a, b) => {
        const roleA = roleOrder[a.role || 'Other'] ?? 5;
        const roleB = roleOrder[b.role || 'Other'] ?? 5;
        return roleA - roleB;
      });
      
      setFaculty(sortedFaculty);
    } catch (error) {
      console.error('Error loading faculty:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Map designation to role for proper hierarchy
      const roleMapping: Record<string, Faculty['role']> = {
        'HOD': 'HOD',
        'Professor': 'Professor',
        'Associate Professor': 'Associate Professor',
        'Assistant Professor': 'Assistant Professor',
        'Lab Instructor': 'Other',
        'Visiting Faculty': 'Other'
      };

      const facultyData: Omit<Faculty, 'id'> = {
        name: newFaculty.name!,
        designation: newFaculty.designation!,
        role: roleMapping[newFaculty.designation!] || 'Other',
        qualification: newFaculty.qualification!,
        specialization: newFaculty.specialization!,
        email: newFaculty.email!,
        phone: newFaculty.phone,
        photo: newFaculty.photo!,
        department: newFaculty.department,
        experience: newFaculty.experience,
        researchInterests: newFaculty.researchInterests,
        publications: newFaculty.publications
      };

      await createFaculty(facultyData as Faculty);
      await loadFaculty(); // Reload faculty list
      setAddDialogOpen(false);
      setNewFaculty({
        name: '',
        designation: 'Assistant Professor',
        role: 'Assistant Professor',
        department: 'Aeronautical Engineering',
        email: '',
        phone: '',
        specialization: '',
        qualification: 'Ph.D.',
        experience: '',
        photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
        researchInterests: [],
        publications: []
      });
      toast.success('Faculty member added successfully!');
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty member');
    }
  };

  const handleEdit = async () => {
    if (!selectedFaculty || !selectedFaculty.id) return;

    try {
      // Map designation to role for proper hierarchy
      const roleMapping: Record<string, Faculty['role']> = {
        'HOD': 'HOD',
        'Professor': 'Professor',
        'Associate Professor': 'Associate Professor',
        'Assistant Professor': 'Assistant Professor',
        'Lab Instructor': 'Other',
        'Visiting Faculty': 'Other'
      };

      const updateData = {
        ...selectedFaculty,
        role: roleMapping[selectedFaculty.designation] || 'Other'
      };

      await updateFaculty(selectedFaculty.id, updateData);
      await loadFaculty(); // Reload faculty list
      setEditDialogOpen(false);
      setSelectedFaculty(null);
      toast.success('Faculty member updated successfully!');
    } catch (error) {
      console.error('Error updating faculty:', error);
      toast.error('Failed to update faculty member');
    }
  };

  const handleDelete = async () => {
    if (!selectedFaculty || !selectedFaculty.id) return;

    try {
      await deleteFaculty(selectedFaculty.id);
      await loadFaculty(); // Reload faculty list
      setDeleteDialogOpen(false);
      setSelectedFaculty(null);
      toast.success('Faculty member deleted successfully!');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Faculty Management</h2>
          <p className="text-gray-400 mt-1">Manage department faculty members</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Faculty</p>
                <p className="text-2xl font-bold">{faculty.length}</p>
              </div>
              <UserIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Professors</p>
              <p className="text-2xl font-bold">
                {faculty.filter(f => f.designation === 'Professor').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Associate Professors</p>
              <p className="text-2xl font-bold">
                {faculty.filter(f => f.designation === 'Associate Professor').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Assistant Professors</p>
              <p className="text-2xl font-bold">
                {faculty.filter(f => f.designation === 'Assistant Professor').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty List */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle>Faculty Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
              <span className="text-gray-400">Loading faculty members...</span>
            </div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No faculty members added yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAddDialogOpen(true)}
              >
                Add Your First Faculty Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {faculty.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-blue-400">{member.designation}</p>
                                <p className="text-sm text-gray-400 mt-1">{member.qualification} • {member.experience}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedFaculty(member);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                  onClick={() => {
                                    setSelectedFaculty(member);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{member.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{member.specialization}</span>
                              </div>
                            </div>

                            {member.researchInterests && member.researchInterests.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {member.researchInterests.map((area, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Faculty Member</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new faculty member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  placeholder="Dr. John Doe"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="john.doe@university.edu"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Phone *</Label>
                <Input
                  placeholder="+91 9876543210"
                  value={newFaculty.phone}
                  onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                />
              </div>

              <div>
                <Label>Designation</Label>
                <Select
                  value={newFaculty.designation}
                  onValueChange={(value) => setNewFaculty({ ...newFaculty, designation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATIONS.map(des => (
                      <SelectItem key={des} value={des}>{des}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Qualification</Label>
                <Select
                  value={newFaculty.qualification}
                  onValueChange={(value) => setNewFaculty({ ...newFaculty, qualification: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALIFICATIONS.map(qual => (
                      <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Experience</Label>
                <Input
                  placeholder="10 Years"
                  value={newFaculty.experience}
                  onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Specialization</Label>
              <Input
                placeholder="Aerodynamics, CFD"
                value={newFaculty.specialization}
                onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
              />
            </div>

            <div>
              <Label>Research Areas (comma-separated)</Label>
              <Input
                placeholder="Aerodynamics, CFD, Aircraft Design"
                value={newFaculty.researchInterests?.join(', ')}
                onChange={(e) => setNewFaculty({ 
                  ...newFaculty, 
                  researchInterests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>

            <div>
              <Label>Publications</Label>
              <Textarea
                placeholder="Notable publications and research papers"
                value={newFaculty.publications}
                onChange={(e) => setNewFaculty({ ...newFaculty, publications: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Profile Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={newFaculty.photo}
                onChange={(e) => setNewFaculty({ ...newFaculty, photo: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddDialogOpen(false);
              setNewFaculty({
                name: '',
                designation: 'Assistant Professor',
                role: 'Assistant Professor',
                department: 'Aeronautical Engineering',
                email: '',
                phone: '',
                specialization: '',
                qualification: 'Ph.D.',
                experience: '',
                photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
                researchInterests: [],
                publications: []
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Faculty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Faculty Member</DialogTitle>
          </DialogHeader>

          {selectedFaculty && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={selectedFaculty.name}
                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={selectedFaculty.email}
                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    value={selectedFaculty.phone}
                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Designation</Label>
                  <Select
                    value={selectedFaculty.designation}
                    onValueChange={(value) => setSelectedFaculty({ ...selectedFaculty, designation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map(des => (
                        <SelectItem key={des} value={des}>{des}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Qualification</Label>
                  <Select
                    value={selectedFaculty.qualification}
                    onValueChange={(value) => setSelectedFaculty({ ...selectedFaculty, qualification: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALIFICATIONS.map(qual => (
                        <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Experience</Label>
                  <Input
                    value={selectedFaculty.experience}
                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, experience: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Specialization</Label>
                <Input
                  value={selectedFaculty.specialization}
                  onChange={(e) => setSelectedFaculty({ ...selectedFaculty, specialization: e.target.value })}
                />
              </div>

              <div>
                <Label>Research Areas (comma-separated)</Label>
                <Input
                  value={selectedFaculty.researchInterests?.join(', ')}
                  onChange={(e) => setSelectedFaculty({ 
                    ...selectedFaculty, 
                    researchInterests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div>
                <Label>Publications</Label>
                <Textarea
                  value={selectedFaculty.publications}
                  onChange={(e) => setSelectedFaculty({ ...selectedFaculty, publications: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              setSelectedFaculty(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Faculty Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the faculty member profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFaculty(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}