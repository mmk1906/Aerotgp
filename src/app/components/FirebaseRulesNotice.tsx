import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, X } from 'lucide-react';

export function FirebaseRulesNotice() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if notice was previously dismissed
    const isDismissed = localStorage.getItem('firebase-rules-notice-dismissed');
    if (!isDismissed) {
      // Show notice after 2 seconds
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('firebase-rules-notice-dismissed', 'true');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-yellow-900/90 border-yellow-600 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-200 flex items-center justify-between">
          Firebase Rules Update Required
          <button 
            onClick={handleDismiss}
            className="ml-2 hover:bg-yellow-800/50 rounded p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertTitle>
        <AlertDescription className="text-yellow-100 text-sm mt-2">
          Some features require Firebase rules to be updated. 
          <a 
            href="/FIREBASE_RULES_UPDATE_REQUIRED.md" 
            target="_blank"
            className="block text-yellow-300 hover:text-yellow-200 underline mt-2"
          >
            Click here for instructions →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
