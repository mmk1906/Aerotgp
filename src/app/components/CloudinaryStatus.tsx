import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CLOUDINARY_CONFIG, validateCloudinaryConfig } from '../config/cloudinary';

/**
 * Cloudinary Connection Status Indicator
 * Shows if Cloudinary is properly configured
 */
export function CloudinaryStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'warning' | 'error'>('checking');
  const [message, setMessage] = useState('Checking Cloudinary...');

  useEffect(() => {
    checkCloudinaryStatus();
  }, []);

  const checkCloudinaryStatus = () => {
    // Check if configuration is valid
    const isValid = validateCloudinaryConfig();
    
    if (!CLOUDINARY_CONFIG.cloudName) {
      setStatus('error');
      setMessage('Cloud name not configured');
      return;
    }

    if (CLOUDINARY_CONFIG.cloudName === 'demo') {
      setStatus('warning');
      setMessage('Using demo cloud - set your own credentials');
      return;
    }

    if (!CLOUDINARY_CONFIG.uploadPreset) {
      setStatus('error');
      setMessage('Upload preset not configured');
      return;
    }

    if (isValid) {
      setStatus('connected');
      setMessage(`Connected to ${CLOUDINARY_CONFIG.cloudName}`);
    } else {
      setStatus('warning');
      setMessage('Configuration incomplete');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'checking':
        return <Cloud className="w-3 h-3 animate-pulse" />;
      case 'connected':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3" />;
      case 'error':
        return <XCircle className="w-3 h-3" />;
    }
  };

  const getVariant = () => {
    switch (status) {
      case 'checking':
        return 'secondary';
      case 'connected':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'checking':
        return 'text-gray-400';
      case 'connected':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className={`gap-2 ${getColor()}`}>
            {getIcon()}
            <span className="text-xs">
              {status === 'connected' ? 'Cloudinary' : 'Media Storage'}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{message}</p>
            <p className="text-xs text-gray-400">
              Cloud: {CLOUDINARY_CONFIG.cloudName || 'Not set'}
            </p>
            <p className="text-xs text-gray-400">
              Preset: {CLOUDINARY_CONFIG.uploadPreset || 'Not set'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact version for footer display
 */
export function CloudinaryStatusCompact() {
  const [status, setStatus] = useState<'connected' | 'error'>('connected');

  useEffect(() => {
    const isValid = validateCloudinaryConfig();
    setStatus(isValid && CLOUDINARY_CONFIG.cloudName !== 'demo' ? 'connected' : 'error');
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div
        className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
        }`}
      />
      <span>Cloudinary</span>
    </div>
  );
}
