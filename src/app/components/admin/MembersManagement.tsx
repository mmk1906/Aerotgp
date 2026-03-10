import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Star, 
  Trash2,
  Edit,
  Award,
  Download,
  Loader2
} from 'lucide-react';
import { 
  getClubMembers,
  getAllClubs,
  removeMember,
  updateMemberRole,
  updateMemberContribution,
  toggleFeaturedMember,
  ClubMember,
  Club
} from '../../services/clubService';
import { toast } from 'sonner';
import { UserAvatar } from '../UserAvatar';

export function MembersManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>('all');
  const [allMembers, setAllMembers] = useState<ClubMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog
  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [editForm, setEditForm] = useState({
    role: '' as ClubMember['role'],
    contribution: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [selectedClubId, allMembers]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const clubsData = await getAllClubs();
      setClubs(clubsData);

      // Load members from all clubs
      const membersPromises = clubsData.map(club => getClubMembers(club.id!));
      const membersArrays = await Promise.all(membersPromises);
      const members = membersArrays.flat();
      
      setAllMembers(members);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load members data');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    if (selectedClubId === 'all') {
      setFilteredMembers(allMembers);
    } else {
      setFilteredMembers(allMembers.filter(m => m.clubId === selectedClubId));
    }
  };

  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }

    // TODO: Implement CSV export
    toast.info('CSV export feature coming soon!');
  };

  const handleExportExcel = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }

    // TODO: Implement Excel export
    toast.info('Excel export feature coming soon!');
  };

  const handleExportAllClubs = () => {
    // TODO: Implement multi-sheet export
    toast.info('Multi-sheet export feature coming soon!');
  };

  const handleToggleFeatured = async (member: ClubMember) => {
    try {
      await toggleFeaturedMember(member.id!);
      toast.success(`Member ${member.isFeatured ? 'unfeatured' : 'featured'} successfully!`);
      await loadData();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update member');
    }
  };

  const handleEditClick = (member: ClubMember) => {
    setEditingMember(member);
    setEditForm({
      role: member.role,
      contribution: member.contribution || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    try {
      await updateMemberRole(editingMember.id!, editForm.role);
      await updateMemberContribution(editingMember.id!, editForm.contribution);
      
      toast.success('Member updated successfully!');
      setEditingMember(null);
      await loadData();
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleRemoveMember = async (member: ClubMember) => {
    if (!confirm(`Are you sure you want to remove ${member.userName} from ${member.clubName}?`)) {
      return;
    }

    try {
      await removeMember(member.id!);
      toast.success('Member removed successfully!');
      await loadData();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
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
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-blue-500">{allMembers.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Clubs</p>
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
                <p className="text-sm text-gray-400 mb-1">Featured Members</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {allMembers.filter(m => m.isFeatured).length}
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
                <p className="text-sm text-gray-400 mb-1">Showing</p>
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
                size="sm"
                disabled={filteredMembers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <Button 
                onClick={handleExportExcel}
                variant="outline"
                size="sm"
                disabled={filteredMembers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>

              {selectedClubId === 'all' && (
                <Button 
                  onClick={handleExportAllClubs}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  disabled={allMembers.length === 0}
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
              <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No members found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <UserAvatar 
                      photoUrl={member.userPhoto} 
                      userName={member.userName} 
                      size="lg"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{member.userName}</h4>
                        {member.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                        <span>{member.userEmail}</span>
                        <span>•</span>
                        <span>{member.clubName}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      {member.contribution && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{member.contribution}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
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
                      onClick={() => handleEditClick(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveMember(member)}
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

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Make changes to the member's details below.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div>
                <Label>Member</Label>
                <p className="text-sm mt-1">{editingMember.userName} - {editingMember.clubName}</p>
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value: ClubMember['role']) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Core Member">Core Member</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Co-Lead">Co-Lead</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contribution / Achievement</Label>
                <Textarea
                  value={editForm.contribution}
                  onChange={(e) => setEditForm({ ...editForm, contribution: e.target.value })}
                  className="bg-slate-800 border-slate-700 mt-1"
                  placeholder="e.g., Led team to win competition"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
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