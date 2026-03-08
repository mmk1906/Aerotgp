import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Users,
  Trophy,
  Target,
  TrendingUp,
  Edit,
  Plus,
  Trash2,
  Calendar,
  Award,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  getUserClubMemberships,
  getMemberProgressByUser,
  createMemberProgress,
  updateMemberProgress,
  ClubMember,
  MemberProgress
} from '../services/databaseService';

export function PortalMyClubs() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<ClubMember[]>([]);
  const [progressRecords, setProgressRecords] = useState<Record<string, MemberProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<ClubMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const [progressForm, setProgressForm] = useState({
    projectsCompleted: 0,
    tasksContributed: 0,
    progressDescription: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user's club memberships
      const membershipsData = await getUserClubMemberships(user!.uid);
      setMemberships(membershipsData.filter(m => m.status === 'active'));

      // Load progress for each club
      const progressMap: Record<string, MemberProgress> = {};
      for (const membership of membershipsData) {
        const progressArray = await getMemberProgressByUser(user!.uid, membership.clubId);
        if (progressArray.length > 0) {
          progressMap[membership.clubId] = progressArray[0];
        }
      }
      setProgressRecords(progressMap);

    } catch (error) {
      console.error('Error loading club data:', error);
      toast.error('Failed to load your club memberships');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProgress = (membership: ClubMember) => {
    setSelectedClub(membership);
    const progress = progressRecords[membership.clubId];
    
    if (progress) {
      setProgressForm({
        projectsCompleted: progress.projectsCompleted,
        tasksContributed: progress.tasksContributed,
        progressDescription: progress.progressDescription || '',
      });
    } else {
      setProgressForm({
        projectsCompleted: 0,
        tasksContributed: 0,
        progressDescription: '',
      });
    }
    
    setShowEditDialog(true);
  };

  const handleSaveProgress = async () => {
    if (!selectedClub) return;

    try {
      const progress = progressRecords[selectedClub.clubId];
      
      const progressData = {
        clubId: selectedClub.clubId,
        memberId: selectedClub.id!,
        userId: user!.uid,
        userName: user!.displayName || user!.email!,
        projectsCompleted: progressForm.projectsCompleted,
        tasksContributed: progressForm.tasksContributed,
        achievements: progress?.achievements || [],
        eventsParticipated: progress?.eventsParticipated || [],
        skillsDeveloped: progress?.skillsDeveloped || [],
        progressDescription: progressForm.progressDescription,
      };

      if (progress) {
        // Update existing progress
        await updateMemberProgress(progress.id!, progressData);
        toast.success('Progress updated successfully');
      } else {
        // Create new progress record
        const newProgressId = await createMemberProgress(progressData as MemberProgress);
        toast.success('Progress created successfully');
      }

      await loadData();
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleAddAchievement = async () => {
    if (!selectedClub || !newAchievement.trim()) {
      toast.error('Please enter an achievement');
      return;
    }

    try {
      const progress = progressRecords[selectedClub.clubId];
      const achievements = progress ? [...progress.achievements, newAchievement] : [newAchievement];

      if (progress) {
        await updateMemberProgress(progress.id!, { achievements });
      } else {
        // Create new progress with achievement
        await createMemberProgress({
          clubId: selectedClub.clubId,
          memberId: selectedClub.id!,
          userId: user!.uid,
          userName: user!.displayName || user!.email!,
          projectsCompleted: 0,
          tasksContributed: 0,
          achievements,
          eventsParticipated: [],
          skillsDeveloped: [],
        } as MemberProgress);
      }

      toast.success('Achievement added');
      setNewAchievement('');
      await loadData();
    } catch (error) {
      console.error('Error adding achievement:', error);
      toast.error('Failed to add achievement');
    }
  };

  const handleAddEvent = async () => {
    if (!selectedClub || !newEvent.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    try {
      const progress = progressRecords[selectedClub.clubId];
      const events = progress ? [...progress.eventsParticipated, newEvent] : [newEvent];

      if (progress) {
        await updateMemberProgress(progress.id!, { eventsParticipated: events });
      } else {
        await createMemberProgress({
          clubId: selectedClub.clubId,
          memberId: selectedClub.id!,
          userId: user!.uid,
          userName: user!.displayName || user!.email!,
          projectsCompleted: 0,
          tasksContributed: 0,
          achievements: [],
          eventsParticipated: events,
          skillsDeveloped: [],
        } as MemberProgress);
      }

      toast.success('Event added');
      setNewEvent('');
      await loadData();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleAddSkill = async () => {
    if (!selectedClub || !newSkill.trim()) {
      toast.error('Please enter a skill');
      return;
    }

    try {
      const progress = progressRecords[selectedClub.clubId];
      const skills = progress ? [...progress.skillsDeveloped, newSkill] : [newSkill];

      if (progress) {
        await updateMemberProgress(progress.id!, { skillsDeveloped: skills });
      } else {
        await createMemberProgress({
          clubId: selectedClub.clubId,
          memberId: selectedClub.id!,
          userId: user!.uid,
          userName: user!.displayName || user!.email!,
          projectsCompleted: 0,
          tasksContributed: 0,
          achievements: [],
          eventsParticipated: [],
          skillsDeveloped: skills,
        } as MemberProgress);
      }

      toast.success('Skill added');
      setNewSkill('');
      await loadData();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveItem = async (type: 'achievement' | 'event' | 'skill', index: number) => {
    if (!selectedClub) return;

    try {
      const progress = progressRecords[selectedClub.clubId];
      if (!progress) return;

      let updateData: Partial<MemberProgress> = {};

      if (type === 'achievement') {
        updateData.achievements = progress.achievements.filter((_, i) => i !== index);
      } else if (type === 'event') {
        updateData.eventsParticipated = progress.eventsParticipated.filter((_, i) => i !== index);
      } else if (type === 'skill') {
        updateData.skillsDeveloped = progress.skillsDeveloped.filter((_, i) => i !== index);
      }

      await updateMemberProgress(progress.id!, updateData);
      toast.success('Item removed');
      await loadData();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your clubs...</p>
        </div>
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div className="text-center py-20">
        <Users className="w-24 h-24 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">No Club Memberships</h2>
        <p className="text-gray-400 mb-8">You haven't joined any clubs yet</p>
        <Button onClick={() => window.location.href = '/clubs'}>
          Browse Clubs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Clubs</h1>
        <p className="text-gray-400">Manage your club memberships and track your progress</p>
      </div>

      {/* Membership Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {memberships.map((membership) => {
          const progress = progressRecords[membership.clubId];
          
          return (
            <motion.div
              key={membership.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{membership.clubName}</CardTitle>
                      <Badge variant="outline" className="mb-2">{membership.role}</Badge>
                      <p className="text-sm text-gray-400">
                        Joined: {new Date(membership.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleEditProgress(membership)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {progress ? (
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-gray-400">Projects</span>
                          </div>
                          <p className="text-2xl font-bold">{progress.projectsCompleted}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-400">Tasks</span>
                          </div>
                          <p className="text-2xl font-bold">{progress.tasksContributed}</p>
                        </div>
                      </div>

                      {/* Quick Overview */}
                      <div className="space-y-2 text-sm">
                        {progress.achievements.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-400">{progress.achievements.length} Achievements</span>
                          </div>
                        )}
                        {progress.eventsParticipated.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-400">{progress.eventsParticipated.length} Events</span>
                          </div>
                        )}
                        {progress.skillsDeveloped.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-cyan-500" />
                            <span className="text-gray-400">{progress.skillsDeveloped.length} Skills</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-4">No progress tracked yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProgress(membership)}
                      >
                        Start Tracking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Progress Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Update Progress - {selectedClub?.clubName}
            </DialogTitle>
          </DialogHeader>

          {selectedClub && (
            <div className="space-y-6 mt-4">
              {/* Basic Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Projects Completed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={progressForm.projectsCompleted}
                        onChange={(e) => setProgressForm({ ...progressForm, projectsCompleted: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div>
                      <Label>Tasks Contributed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={progressForm.tasksContributed}
                        onChange={(e) => setProgressForm({ ...progressForm, tasksContributed: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Progress Description</Label>
                    <Textarea
                      value={progressForm.progressDescription}
                      onChange={(e) => setProgressForm({ ...progressForm, progressDescription: e.target.value })}
                      rows={3}
                      placeholder="Describe your overall progress and contributions"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Button onClick={handleSaveProgress} className="w-full">
                    Save Statistics
                  </Button>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement..."
                      className="bg-slate-800 border-slate-700"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                    />
                    <Button onClick={handleAddAchievement}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {progressRecords[selectedClub.clubId]?.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                        <span className="text-sm">{achievement}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem('achievement', index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events Participated */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                    Events Participated
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      placeholder="Add an event..."
                      className="bg-slate-800 border-slate-700"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
                    />
                    <Button onClick={handleAddEvent}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {progressRecords[selectedClub.clubId]?.eventsParticipated.map((event, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                        <span className="text-sm">{event}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem('event', index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Developed */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-cyan-500" />
                    Skills Developed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="bg-slate-800 border-slate-700"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {progressRecords[selectedClub.clubId]?.skillsDeveloped.map((skill, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveItem('skill', index)}
                          className="ml-2 text-red-500 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
