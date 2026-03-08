import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Download, Users, Star, Trash2, Edit } from 'lucide-react';
import { 
  getAllClubs,
  getClubMembers,
  deleteClubMember,
  updateClubMember,
  Club,
  ClubMember
} from '../services/databaseService';
import { 
  exportSingleClubMembers,
  exportAllClubsData,
  exportMembersToCSV,
  exportMembersToExcel
} from '../utils/exportUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ClubMembersManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>('all');
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [selectedClubId, members]);

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedClubs = await getAllClubs();
      setClubs(fetchedClubs);

      // Load all members from all clubs
      const allMembersPromises = fetchedClubs.map(club => 
        getClubMembers(club.id!)
      );
      const allMembersArrays = await Promise.all(allMembersPromises);
      const allMembers = allMembersArrays.flat();
      
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load members data');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    if (selectedClubId === 'all') {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(members.filter(m => m.clubId === selectedClubId));
    }
  };

  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }

    if (selectedClubId === 'all') {
      exportMembersToCSV(filteredMembers, 'all-club-members.csv');
    } else {
      const club = clubs.find(c => c.id === selectedClubId);
      if (club) {
        exportSingleClubMembers(filteredMembers, club.name, 'csv');
      }
    }
    toast.success('CSV file downloaded successfully!');
  };

  const handleExportExcel = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }

    if (selectedClubId === 'all') {
      exportMembersToExcel(filteredMembers, 'all-club-members.xlsx');
    } else {
      const club = clubs.find(c => c.id === selectedClubId);
      if (club) {
        exportSingleClubMembers(filteredMembers, club.name, 'excel');
      }
    }
    toast.success('Excel file downloaded successfully!');
  };

  const handleExportAllClubs = () => {
    const clubsWithMembers = clubs.map(club => ({
      clubName: club.name,
      members: members.filter(m => m.clubId === club.id)
    }));

    exportAllClubsData(clubsWithMembers);
    toast.success('Complete clubs data downloaded successfully!');
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await deleteClubMember(memberId);
      toast.success('Member removed successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleToggleFeatured = async (member: ClubMember) => {
    try {
      await updateClubMember(member.id!, {
        isFeatured: !member.isFeatured
      });
      toast.success(`Member ${member.isFeatured ? 'unfeatured' : 'featured'} successfully!`);
      await loadData();
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleEditMember = (member: ClubMember) => {
    setEditingMember(member);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    try {
      await updateClubMember(editingMember.id!, {
        role: editingMember.role,
        contribution: editingMember.contribution,
      });
      toast.success('Member updated successfully!');
      setShowEditDialog(false);
      setEditingMember(null);
      await loadData();
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-12 text-center">
          <p className="text-gray-400">Loading members...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-3xl font-bold text-blue-500">{members.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Clubs</p>
                <p className="text-3xl font-bold text-green-500">{clubs.length}</p>
              </div>
              <Users className="w-12 h-12 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Featured Members</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {members.filter(m => m.isFeatured).length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Showing</p>
                <p className="text-3xl font-bold text-purple-500">{filteredMembers.length}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Club Members</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Clubs</SelectItem>
                  {clubs.map(club => (
                    <SelectItem key={club.id} value={club.id!}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleExportCSV} 
                variant="outline"
                disabled={filteredMembers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <Button 
                onClick={handleExportExcel}
                variant="outline"
                disabled={filteredMembers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>

              {selectedClubId === 'all' && (
                <Button 
                  onClick={handleExportAllClubs}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={members.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All (Multi-Sheet)
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No members found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <div className="font-semibold">{member.userName}</div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.clubName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.department || 'N/A'}</TableCell>
                      <TableCell>{member.year || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(member.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleFeatured(member)}
                            title={member.isFeatured ? 'Unfeature' : 'Feature'}
                          >
                            <Star className={`w-4 h-4 ${member.isFeatured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteMember(member.id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div>
                <Label>Role</Label>
                <Select
                  value={editingMember.role}
                  onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Core Member">Core Member</SelectItem>
                    <SelectItem value="Club Lead">Club Lead</SelectItem>
                    <SelectItem value="Vice Lead">Vice Lead</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contribution / Achievement</Label>
                <Input
                  value={editingMember.contribution || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, contribution: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                  placeholder="e.g., Led team to win competition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
