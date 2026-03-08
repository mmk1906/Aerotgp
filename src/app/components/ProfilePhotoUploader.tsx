import React, { useState } from 'react';
import { Camera, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';
import type { CloudinaryUploadResult } from '../services/cloudinaryService';
import { toast } from 'sonner';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  userName: string;
  onPhotoUpdate: (photoUrl: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
}

export function ProfilePhotoUploader({
  currentPhotoUrl,
  userName,
  onPhotoUpdate,
  size = 'md',
}: ProfilePhotoUploaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleUploadComplete = async (result: CloudinaryUploadResult) => {
    setIsUpdating(true);
    try {
      await onPhotoUpdate(result.secure_url);
      toast.success('Profile photo updated successfully!');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile photo');
    } finally {
      setIsUpdating(false);
    }
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="relative inline-block">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentPhotoUrl} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg"
          type="button"
        >
          <Camera className="w-3 h-3 text-white" />
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Update Profile Photo
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              Choose a new profile photo to represent yourself.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isUpdating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-300">Updating profile...</span>
              </div>
            ) : (
              <CloudinaryImageUploader
                category="profile"
                onUploadComplete={handleUploadComplete}
                existingImageUrl={currentPhotoUrl}
                buttonText="Choose Profile Photo"
              />
            )}
            
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-blue-400">Tip:</strong> Use a square image (1:1 ratio) for best results. 
                Your photo will be automatically optimized and cropped to fit.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}