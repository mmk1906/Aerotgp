import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '../data/clubData';

interface GalleryUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (image: GalleryImage) => void;
  userEmail?: string;
}

export function GalleryUploadForm({ isOpen, onClose, onUpload, userEmail }: GalleryUploadFormProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [eventTag, setEventTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl || !caption || !eventTag) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);

    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url: imageUrl,
      caption,
      eventTag,
      uploadedBy: userEmail || 'Anonymous',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'pending', // Requires admin approval
    };

    onUpload(newImage);
    
    // Reset form
    setImageUrl('');
    setCaption('');
    setEventTag('');
    setIsSubmitting(false);
    
    toast.success('Image uploaded successfully! Pending admin approval.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <ImageIcon className="w-6 h-6 mr-2 text-blue-500" />
            Upload Gallery Image
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share photos from Aero Club events, workshops, and projects. Images require admin approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-slate-800 border-slate-700"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL of the image you want to upload
            </p>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="relative h-48 rounded-lg overflow-hidden bg-slate-800">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => toast.error('Invalid image URL')}
              />
            </div>
          )}

          {/* Caption */}
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Describe the event or activity..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-20"
              required
            />
          </div>

          {/* Event Tag */}
          <div>
            <Label htmlFor="eventTag">Event Tag</Label>
            <Select value={eventTag} onValueChange={setEventTag} required>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Competition">Competition</SelectItem>
                <SelectItem value="Fest">Fest</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Lab">Lab Session</SelectItem>
                <SelectItem value="Lecture">Guest Lecture</SelectItem>
                <SelectItem value="Event">General Event</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
