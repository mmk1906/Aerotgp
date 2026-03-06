import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Settings as SettingsIcon, Bell, Shield, Database, Trash2, Download, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
  general: {
    siteName: string;
    siteEmail: string;
    sitePhone: string;
    maintenanceMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    eventReminders: boolean;
    newRegistrations: boolean;
    blogApprovals: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    sessionTimeout: string;
    maxLoginAttempts: string;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    siteName: 'Aeronautical Engineering Department',
    siteEmail: 'admin@aeroengineering.edu',
    sitePhone: '+91 9876543210',
    maintenanceMode: false
  },
  notifications: {
    emailNotifications: true,
    eventReminders: true,
    newRegistrations: true,
    blogApprovals: true
  },
  security: {
    requireEmailVerification: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5'
  }
};

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const stored = localStorage.getItem('systemSettings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });
  const [hasChanges, setHasChanges] = useState(false);

  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Settings saved successfully!');
  };

  const updateGeneral = (field: keyof SystemSettings['general'], value: string | boolean) => {
    setSettings({
      ...settings,
      general: { ...settings.general, [field]: value }
    });
    setHasChanges(true);
  };

  const updateNotifications = (field: keyof SystemSettings['notifications'], value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
    setHasChanges(true);
  };

  const updateSecurity = (field: keyof SystemSettings['security'], value: string | boolean) => {
    setSettings({
      ...settings,
      security: { ...settings.security, [field]: value }
    });
    setHasChanges(true);
  };

  const exportData = () => {
    const data = {
      events: JSON.parse(localStorage.getItem('events') || '[]'),
      blogs: JSON.parse(localStorage.getItem('blogs') || '[]'),
      faculty: JSON.parse(localStorage.getItem('facultyMembers') || '[]'),
      gallery: JSON.parse(localStorage.getItem('galleryPhotos') || '[]'),
      users: JSON.parse(localStorage.getItem('users') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully!');
  };

  const clearAllData = () => {
    const keysToKeep = ['authUser', 'systemSettings'];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    toast.success('All data cleared successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-gray-400 mt-1">Configure system preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="general">
                <SettingsIcon className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="data">
                <Database className="w-4 h-4 mr-2" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic website configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Site Name</Label>
                    <Input
                      value={settings.general.siteName}
                      onChange={(e) => updateGeneral('siteName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={settings.general.siteEmail}
                      onChange={(e) => updateGeneral('siteEmail', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={settings.general.sitePhone}
                      onChange={(e) => updateGeneral('sitePhone', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Temporarily disable the website for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => updateGeneral('maintenanceMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Receive email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateNotifications('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Get reminders for upcoming events
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.eventReminders}
                      onCheckedChange={(checked) => updateNotifications('eventReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>New Registrations</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Notify when users register for events
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newRegistrations}
                      onCheckedChange={(checked) => updateNotifications('newRegistrations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>Blog Approvals</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Notify when blogs need approval
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.blogApprovals}
                      onCheckedChange={(checked) => updateNotifications('blogApprovals', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label>Require Email Verification</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        Users must verify email before accessing
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => updateSecurity('requireEmailVerification', checked)}
                    />
                  </div>

                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSecurity('sessionTimeout', e.target.value)}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Time before inactive sessions expire
                    </p>
                  </div>

                  <div>
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSecurity('maxLoginAttempts', e.target.value)}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Number of failed login attempts before lockout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Backup and manage your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-500 mb-1">Export Data</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Download all website data as a JSON backup file
                        </p>
                        <Button onClick={exportData} variant="outline" className="border-blue-500/50 text-blue-400">
                          <Download className="w-4 h-4 mr-2" />
                          Export Backup
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-500 mb-1">Clear All Data</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Permanently delete all website data (except user accounts and settings)
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-red-500/50 text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Clear Data
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border-slate-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all events, blogs, gallery photos, and other data from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={clearAllData} className="bg-red-500 hover:bg-red-600">
                                Yes, Clear All Data
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">Unsaved Changes</p>
              <p className="text-sm text-gray-400">Remember to save your settings before leaving</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
