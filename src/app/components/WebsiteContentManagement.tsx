import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Save, FileText, Home as HomeIcon, Info, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

interface WebsiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    featuresTitle: string;
  };
  about: {
    title: string;
    vision: string;
    mission: string;
    description: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const defaultContent: WebsiteContent = {
  home: {
    heroTitle: 'Welcome to Aeronautical Engineering',
    heroSubtitle: 'Shaping the Future of Aviation',
    heroDescription: 'Join us in exploring the exciting world of aerospace engineering and innovation.',
    featuresTitle: 'Why Choose Aeronautical Engineering?'
  },
  about: {
    title: 'About Our Department',
    vision: 'To be a globally recognized center of excellence in aeronautical engineering education and research.',
    mission: 'To provide quality education, foster innovation, and develop skilled professionals for the aerospace industry.',
    description: 'Our department offers state-of-the-art facilities and experienced faculty to guide students in their journey.'
  },
  announcements: []
};

export function WebsiteContentManagement() {
  const [content, setContent] = useState<WebsiteContent>(() => {
    const stored = localStorage.getItem('websiteContent');
    return stored ? JSON.parse(stored) : defaultContent;
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  useEffect(() => {
    setHasChanges(false);
  }, []);

  const saveContent = () => {
    localStorage.setItem('websiteContent', JSON.stringify(content));
    setHasChanges(false);
    toast.success('Content saved successfully!');
  };

  const updateHome = (field: keyof WebsiteContent['home'], value: string) => {
    setContent({
      ...content,
      home: { ...content.home, [field]: value }
    });
    setHasChanges(true);
  };

  const updateAbout = (field: keyof WebsiteContent['about'], value: string) => {
    setContent({
      ...content,
      about: { ...content.about, [field]: value }
    });
    setHasChanges(true);
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Please fill all fields');
      return;
    }

    const announcement = {
      id: `ann-${Date.now()}`,
      ...newAnnouncement,
      date: new Date().toISOString()
    };

    setContent({
      ...content,
      announcements: [announcement, ...content.announcements]
    });

    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium'
    });

    setHasChanges(true);
    toast.success('Announcement added!');
  };

  const deleteAnnouncement = (id: string) => {
    setContent({
      ...content,
      announcements: content.announcements.filter(a => a.id !== id)
    });
    setHasChanges(true);
    toast.success('Announcement deleted!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Website Content Management</h2>
          <p className="text-gray-400 mt-1">Edit website content easily</p>
        </div>
        <Button onClick={saveContent} disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      {/* Content Tabs */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-6">
          <Tabs defaultValue="home" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="home">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home Page
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info className="w-4 h-4 mr-2" />
                About Page
              </TabsTrigger>
              <TabsTrigger value="announcements">
                <Megaphone className="w-4 h-4 mr-2" />
                Announcements
              </TabsTrigger>
            </TabsList>

            {/* Home Page Content */}
            <TabsContent value="home" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Home Page Content</CardTitle>
                  <CardDescription>Edit the main landing page content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Hero Title</Label>
                    <Input
                      value={content.home.heroTitle}
                      onChange={(e) => updateHome('heroTitle', e.target.value)}
                      placeholder="Main headline"
                    />
                  </div>

                  <div>
                    <Label>Hero Subtitle</Label>
                    <Input
                      value={content.home.heroSubtitle}
                      onChange={(e) => updateHome('heroSubtitle', e.target.value)}
                      placeholder="Subtitle text"
                    />
                  </div>

                  <div>
                    <Label>Hero Description</Label>
                    <Textarea
                      value={content.home.heroDescription}
                      onChange={(e) => updateHome('heroDescription', e.target.value)}
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Features Section Title</Label>
                    <Input
                      value={content.home.featuresTitle}
                      onChange={(e) => updateHome('featuresTitle', e.target.value)}
                      placeholder="Features section heading"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Page Content */}
            <TabsContent value="about" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>About Page Content</CardTitle>
                  <CardDescription>Edit department information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input
                      value={content.about.title}
                      onChange={(e) => updateAbout('title', e.target.value)}
                      placeholder="About section title"
                    />
                  </div>

                  <div>
                    <Label>Vision Statement</Label>
                    <Textarea
                      value={content.about.vision}
                      onChange={(e) => updateAbout('vision', e.target.value)}
                      placeholder="Department vision"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Mission Statement</Label>
                    <Textarea
                      value={content.about.mission}
                      onChange={(e) => updateAbout('mission', e.target.value)}
                      placeholder="Department mission"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Department Description</Label>
                    <Textarea
                      value={content.about.description}
                      onChange={(e) => updateAbout('description', e.target.value)}
                      placeholder="Detailed description"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Announcements */}
            <TabsContent value="announcements" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Add New Announcement</CardTitle>
                  <CardDescription>Create important notices and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      placeholder="Announcement title"
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      placeholder="Announcement details"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <div className="flex gap-3 mt-2">
                      {(['high', 'medium', 'low'] as const).map(priority => (
                        <button
                          key={priority}
                          onClick={() => setNewAnnouncement({ ...newAnnouncement, priority })}
                          className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                            newAnnouncement.priority === priority
                              ? getPriorityColor(priority) + ' text-white'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={addAnnouncement} className="w-full">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Add Announcement
                  </Button>
                </CardContent>
              </Card>

              {/* Announcements List */}
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Current Announcements</CardTitle>
                  <CardDescription>{content.announcements.length} active announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  {content.announcements.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No announcements yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {content.announcements.map((announcement) => (
                        <motion.div
                          key={announcement.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(announcement.priority)} text-white`}>
                                  {announcement.priority.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(announcement.date).toLocaleDateString()}
                                </span>
                              </div>
                              <h4 className="font-semibold mb-1">{announcement.title}</h4>
                              <p className="text-sm text-gray-400">{announcement.content}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:bg-red-500/20"
                              onClick={() => deleteAnnouncement(announcement.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Notice */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">Unsaved Changes</p>
              <p className="text-sm text-gray-400">Remember to save your changes before leaving</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
