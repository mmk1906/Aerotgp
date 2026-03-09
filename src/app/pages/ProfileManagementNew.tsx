import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { PasswordInput } from '../components/ui/password-input';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Building2, Calendar, Award, BookOpen, Save, Camera, Lock, Loader2, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile, UserProfile as AuthUserProfile, changePassword } from '../services/authService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface ExtendedUserProfile extends AuthUserProfile {
  bio?: string;
  skills?: string[];
  interests?: string[];
}

export function ProfileManagement() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [profile, setProfile] = useState<ExtendedUserProfile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: 'student',
    phone: '',
    department: 'Aeronautical Engineering',
    year: '2nd Year',
    prn: '',
    bio: '',
    skills: [],
    interests: [],
    profilePhoto: '',
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile(user!.id);
      
      if (userProfile) {
        setProfile({
          ...userProfile,
          department: userProfile.department || 'Aeronautical Engineering',
          year: userProfile.year || '2nd Year',
          phone: userProfile.phone || '',
          prn: userProfile.prn || '',
          bio: (userProfile as any).bio || '',
          skills: (userProfile as any).skills || [],
          interests: (userProfile as any).interests || [],
          profilePhoto: userProfile.profilePhoto || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      toast.info('Uploading image...');

      const result = await uploadToCloudinary(file, 'profile');
      
      setProfile({ ...profile, profilePhoto: result.secure_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      await updateUserProfile(user!.id, {
        name: profile.name,
        phone: profile.phone,
        department: profile.department,
        year: profile.year,
        prn: profile.prn,
        profilePhoto: profile.profilePhoto,
        bio: profile.bio,
        skills: profile.skills,
        interests: profile.interests,
      } as any);

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills?.filter((s) => s !== skill) });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests?.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...(profile.interests || []), newInterest.trim()] });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests?.filter((i) => i !== interest) });
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Management</h1>
          <p className="text-gray-400">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              onClick={() => {
                setIsEditing(false);
                loadProfile();
              }}
              variant="outline"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {uploadingImage ? (
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    ) : profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
                  {profile.role === 'student' ? 'Student' : 'Admin'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-500" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+91 XXXXX XXXXX"
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prn">PRN / Roll No</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="prn"
                      value={profile.prn || ''}
                      onChange={(e) => setProfile({ ...profile, prn: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your PRN"
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="department"
                      value={profile.department || 'Aeronautical Engineering'}
                      disabled
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Select 
                      value={profile.year || '2nd Year'} 
                      onValueChange={(value) => setProfile({ ...profile, year: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="bg-gray-800/50 border-gray-700 resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span>Technical Skills</span>
              </CardTitle>
              <CardDescription>Add your technical skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., CFD Analysis"
                    className="bg-gray-800/50 border-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} variant="outline">
                    Add
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-400 border-purple-600/50 px-3 py-1"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-500" />
                <span>Areas of Interest</span>
              </CardTitle>
              <CardDescription>Add your areas of interest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="e.g., Spacecraft Design"
                    className="bg-gray-800/50 border-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <Button onClick={handleAddInterest} variant="outline">
                    Add
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-green-600/20 text-green-400 border-green-600/50 px-3 py-1"
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No interests added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Password Change Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="bg-gray-800/50 border-gray-700"
                  disabled={changingPassword}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-gray-800/50 border-gray-700"
                  disabled={changingPassword}
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-gray-800/50 border-gray-700"
                  disabled={changingPassword}
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="bg-red-600 hover:bg-red-700"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}