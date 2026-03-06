import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Building2, Calendar, Award, BookOpen, Save, Camera, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  prn: string;
  skills: string[];
  interests: string[];
  bio: string;
  profileImage: string;
}

export function ProfileManagement() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: 'Aeronautical Engineering',
    year: '2nd Year',
    prn: '',
    skills: [],
    interests: [],
    bio: '',
    profileImage: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user]);

  const handleSaveProfile = () => {
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profile));
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter((i) => i !== interest) });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
        <Button
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </Button>
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
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
                  {user?.role === 'student' ? 'Student' : 'Admin'}
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
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
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
                      value={profile.prn}
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
                      value={profile.department}
                      disabled
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      id="year"
                      value={profile.year}
                      onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white disabled:opacity-50"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
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
                {profile.skills.length > 0 ? (
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
                          ×
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
                {profile.interests.length > 0 ? (
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
                          ×
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

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-500" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-red-400 border-red-600/50 hover:bg-red-600/20">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
