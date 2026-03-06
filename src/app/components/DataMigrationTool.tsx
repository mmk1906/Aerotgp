import React, { useState } from 'react';
import { Database, Download, Trash2, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import {
  migrateLocalStorageToFirebase,
  checkMigrationNeeded,
  clearLocalStorageAfterMigration,
  backupLocalStorage,
} from '../utils/dataMigration';

/**
 * Data Migration Tool Component
 * Helps admins migrate data from localStorage to Firebase
 */
export function DataMigrationTool() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [migrationResults, setMigrationResults] = useState<any[]>([]);
  const needsMigration = checkMigrationNeeded();

  const handleBackup = () => {
    try {
      backupLocalStorage();
      toast.success('localStorage backup downloaded!');
    } catch (error) {
      toast.error('Failed to create backup');
    }
  };

  const handleMigration = async () => {
    if (!confirm('Are you sure you want to migrate data to Firebase? This will create new records.')) {
      return;
    }

    setIsMigrating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const results = await migrateLocalStorageToFirebase();
      
      clearInterval(progressInterval);
      setProgress(100);
      setMigrationResults(results);
      setMigrationComplete(true);
      
      toast.success('Data migration completed successfully!');
    } catch (error: any) {
      toast.error(`Migration failed: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearLocalStorage = () => {
    if (!confirm('Are you sure you want to clear localStorage? Make sure migration was successful!')) {
      return;
    }

    if (clearLocalStorageAfterMigration(true)) {
      toast.success('localStorage cleared successfully!');
    }
  };

  if (!needsMigration && !migrationComplete) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">No Migration Needed</h3>
              <p className="text-sm text-gray-400">
                All data is already in Firebase or no local data found.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Migration Tool
          </CardTitle>
          <CardDescription className="text-gray-300">
            Migrate data from localStorage to Firebase database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-yellow-900/20 border-yellow-600/50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              <strong>Important:</strong> Before migrating, create a backup of your current data.
              This operation will copy data to Firebase and should only be run once.
            </AlertDescription>
          </Alert>

          {isMigrating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Migration Progress</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-400">
                Migrating data to Firebase... Please wait.
              </p>
            </div>
          )}

          {migrationComplete && migrationResults.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Migration Results
              </h4>
              <div className="space-y-1 text-sm">
                {migrationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      result.success ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    <span>{result.name}: {result.success ? 'Success' : 'Failed'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-3">
            <Button
              onClick={handleBackup}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Backup Data
            </Button>

            <Button
              onClick={handleMigration}
              disabled={isMigrating || migrationComplete}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isMigrating ? 'Migrating...' : 'Migrate to Firebase'}
            </Button>

            <Button
              onClick={handleClearLocalStorage}
              disabled={!migrationComplete}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear localStorage
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Migration Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                1
              </span>
              <div>
                <strong className="text-white">Create Backup</strong>
                <p className="text-gray-400">
                  Download a JSON backup of all localStorage data for safety.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                2
              </span>
              <div>
                <strong className="text-white">Run Migration</strong>
                <p className="text-gray-400">
                  Click "Migrate to Firebase" to copy all data to Firebase database.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                3
              </span>
              <div>
                <strong className="text-white">Verify Data</strong>
                <p className="text-gray-400">
                  Check Firebase Console to ensure all data was migrated correctly.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                4
              </span>
              <div>
                <strong className="text-white">Clear localStorage</strong>
                <p className="text-gray-400">
                  Once verified, clear localStorage to prevent conflicts.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">What Gets Migrated?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Mock Data</h4>
              <ul className="space-y-1 text-gray-300">
                <li>✓ Events</li>
                <li>✓ Event Registrations</li>
                <li>✓ MCQ Tests</li>
                <li>✓ Blog Posts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">localStorage Data</h4>
              <ul className="space-y-1 text-gray-300">
                <li>✓ Aero Club Applications</li>
                <li>✓ Test Attempts</li>
                <li>✓ User Data (if any)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
