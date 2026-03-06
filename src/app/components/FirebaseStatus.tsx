import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { onAuthStateChange } from '../services/authService';

/**
 * Firebase Connection Status Indicator
 * Shows if the app is connected to Firebase services
 * Useful for debugging and user feedback
 */
export function FirebaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen to auth state to verify Firebase connection
    const unsubscribe = onAuthStateChange(() => {
      setIsConnected(true);
      setChecking(false);
    });

    // Set a timeout in case Firebase is not configured
    const timeout = setTimeout(() => {
      if (checking) {
        setChecking(false);
        setIsConnected(false);
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (checking) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="gap-2">
              <Database className="w-3 h-3 animate-pulse" />
              Connecting...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connecting to Firebase...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="gap-2"
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isConnected
              ? 'Connected to Firebase services'
              : 'Not connected to Firebase. Check console for errors.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact version for footer or corner display
 */
export function FirebaseStatusCompact() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(() => {
      setIsConnected(true);
    });

    const timeout = setTimeout(() => {
      if (!isConnected) {
        console.warn('Firebase connection not established');
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
        }`}
      />
      <span>{isConnected ? 'Live' : 'Offline'}</span>
    </div>
  );
}
