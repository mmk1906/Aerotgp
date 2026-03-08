import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { 
  getCollection,
  getAllEvents,
  getClubApplications,
  EventRegistration,
  Event,
  ClubApplication,
} from '../services/databaseService';
import {
  exportEventRegistrationsToExcel,
  exportClubApplicationsToExcel,
  exportEventsToExcel,
  exportAllDataToExcel,
} from '../services/excelExportService';

export function DataExportTab() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (
    dataType: 'users' | 'events' | 'clubs' | 'registrations' | 'all'
  ) => {
    setLoading(dataType);
    
    try {
      switch (dataType) {
        case 'events':
          const events = await getAllEvents();
          if (events.length === 0) {
            toast.warning('No events to export');
            return;
          }
          exportEventsToExcel(events);
          toast.success(`Exported ${events.length} events to Excel`);
          break;
          
        case 'registrations':
          const registrations = await getCollection<EventRegistration>('registrations');
          if (registrations.length === 0) {
            toast.warning('No registrations to export');
            return;
          }
          exportEventRegistrationsToExcel(registrations);
          toast.success(`Exported ${registrations.length} registrations to Excel`);
          break;
          
        case 'clubs':
          const clubApplications = await getClubApplications();
          if (clubApplications.length === 0) {
            toast.warning('No club applications to export');
            return;
          }
          exportClubApplicationsToExcel(clubApplications);
          toast.success(`Exported ${clubApplications.length} club applications to Excel`);
          break;

        case 'all':
          const [allEvents, allRegs, allClubs] = await Promise.all([
            getAllEvents(),
            getCollection<EventRegistration>('registrations'),
            getClubApplications()
          ]);
          exportAllDataToExcel({
            events: allEvents,
            registrations: allRegs,
            clubs: allClubs,
          });
          toast.success('Exported all data to Excel');
          break;
      }
      
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
      id: 'all',
      title: 'All Data',
      description: 'Export all data in a single Excel file',
      icon: '📊',
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
                    onClick={() => handleExport(item.id as any)}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading === `${item.id}` ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                    )}
                    Excel
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