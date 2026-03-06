import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Rocket, X } from 'lucide-react';
import { ProjectUpdate } from '../data/clubData';

interface ProjectUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (update: ProjectUpdate) => void;
  userEmail?: string;
}

export function ProjectUpdateForm({ isOpen, onClose, onSubmit, userEmail }: ProjectUpdateFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [progressStage, setProgressStage] = useState<'Design' | 'Fabrication' | 'Testing' | 'Completed'>('Design');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = () => {
    if (memberInput.trim() && !teamMembers.includes(memberInput.trim())) {
      setTeamMembers([...teamMembers, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (member: string) => {
    setTeamMembers(teamMembers.filter(m => m !== member));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls([...imageUrls, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls(imageUrls.filter(u => u !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || teamMembers.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    const newUpdate: ProjectUpdate = {
      id: Date.now().toString(),
      title,
      description,
      teamMembers,
      progressStage,
      images: imageUrls,
      date: new Date().toISOString().split('T')[0],
      postedBy: userEmail || 'Anonymous',
    };

    onSubmit(newUpdate);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTeamMembers([]);
    setProgressStage('Design');
    setImageUrls([]);
    setIsSubmitting(false);
    
    toast.success('Project update posted successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Rocket className="w-6 h-6 mr-2 text-blue-500" />
            Post Project Update
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share progress on your ongoing projects with the Aero Club community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter project name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the current progress, challenges, and achievements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-32"
              required
            />
          </div>

          {/* Progress Stage */}
          <div>
            <Label htmlFor="progressStage">Progress Stage *</Label>
            <Select 
              value={progressStage} 
              onValueChange={(value) => setProgressStage(value as any)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Design">📐 Design</SelectItem>
                <SelectItem value="Fabrication">🔧 Fabrication</SelectItem>
                <SelectItem value="Testing">🧪 Testing</SelectItem>
                <SelectItem value="Completed">✅ Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members */}
          <div>
            <Label>Team Members *</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Enter team member name"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                className="bg-slate-800 border-slate-700"
              />
              <Button
                type="button"
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                Add Member
              </Button>
            </div>
            {teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-slate-700 text-white pr-1"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {teamMembers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">Add at least one team member</p>
            )}
          </div>

          {/* Project Images */}
          <div>
            <Label>Project Images (Optional)</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                type="url"
                placeholder="Enter image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                className="bg-slate-800 border-slate-700"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                Add Image
              </Button>
            </div>
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Project ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
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
              <Rocket className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
