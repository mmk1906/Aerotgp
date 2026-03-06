import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { 
  getCollection,
  getAllEvents,
  getPublishedBlogs,
  getActiveClubMembers,
} from '../services/databaseService';
import { exportData } from '../services/exportService';

export function DataExportTab() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (
    dataType: 'users' | 'events' | 'clubs' | 'blogs' | 'tests' | 'gallery' | 'registrations',
    format: 'excel' | 'csv'
  ) => {
    setLoading(`${dataType}-${format}`);
    
    try {
      let data: any[] = [];
      let fileName = '';
      
      switch (dataType) {
        case 'users':
          data = await getCollection('users');
          fileName = `Users_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'events':
          data = await getAllEvents();
          fileName = `Events_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'registrations':
          data = await getCollection('registrations');
          fileName = `Event_Registrations_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'clubs':
          data = await getActiveClubMembers();
          fileName = `Club_Members_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'blogs':
          data = await getPublishedBlogs();
          fileName = `Blogs_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'tests':
          data = await getCollection('testResults');
          fileName = `Test_Results_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'gallery':
          data = await getCollection('gallery');
          fileName = `Gallery_Photos_${new Date().toISOString().split('T')[0]}`;
          break;
      }
      
      if (data.length === 0) {
        toast.warning('No data available to export');
        return;
      }
      
      exportData(data, fileName, format, dataType);
      toast.success(`Successfully exported ${data.length} records to ${format.toUpperCase()}`);
      
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(`Failed to export data: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const exportItems = [
    {
      id: 'users',
      title: 'User List',
      description: 'Export all registered users with their details',
      icon: '👥',
    },
    {
      id: 'registrations',
      title: 'Event Registrations',
      description: 'Export all event registrations with payment status',
      icon: '📋',
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Export all events with complete information',
      icon: '🎫',
    },
    {
      id: 'clubs',
      title: 'Club Members',
      description: 'Export active club members list',
      icon: '✈️',
    },
    {
      id: 'blogs',
      title: 'Blog Posts',
      description: 'Export published blog submissions',
      icon: '📝',
    },
    {
      id: 'tests',
      title: 'Test Results',
      description: 'Export MCQ test results and scores',
      icon: '📊',
    },
    {
      id: 'gallery',
      title: 'Gallery Photos',
      description: 'Export gallery photo metadata',
      icon: '📸',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Export Center</h2>
        <p className="text-gray-400">
          Export website data to Excel or CSV format for analysis and record-keeping
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {exportItems.map((item) => {
          const isLoading = loading?.startsWith(item.id);
          
          return (
            <Card key={item.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <CardTitle className="text-white">{item.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExport(item.id as any, 'excel')}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading === `${item.id}-excel` ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                    )}
                    Excel
                  </Button>
                  
                  <Button
                    onClick={() => handleExport(item.id as any, 'csv')}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                  >
                    {loading === `${item.id}-csv` ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2 text-sm">
          <p>• Excel format (.xlsx) is recommended for detailed analysis and charts</p>
          <p>• CSV format is ideal for importing into other systems</p>
          <p>• All exports include timestamps and complete record information</p>
          <p>• Files are named with the current date for easy organization</p>
          <p>• Sensitive data like passwords are never included in exports</p>
        </CardContent>
      </Card>
    </div>
  );
}
