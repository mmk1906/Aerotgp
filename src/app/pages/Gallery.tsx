import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Upload, Image as ImageIcon, Calendar, User, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  getApprovedGalleryPhotos, 
  createGalleryPhoto, 
  GalleryItem, 
  GALLERY_CATEGORIES 
} from '../services/databaseService';
import { uploadToCloudinary } from '../services/cloudinaryService';

export function Gallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const { user } = useAuth();

  const [uploadForm, setUploadForm] = useState({
    caption: '',
    category: GALLERY_CATEGORIES[0],
    uploadedBy: '',
    uploaderEmail: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    // Pre-fill uploader info if user is logged in
    if (user) {
      setUploadForm(prev => ({
        ...prev,
        uploadedBy: user.name || '',
        uploaderEmail: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Filter photos by category
    if (selectedCategory === 'all') {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(photo => photo.category === selectedCategory));
    }
  }, [selectedCategory, photos]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const fetchedPhotos = await getApprovedGalleryPhotos();
      // Sort by upload date, newest first
      const sortedPhotos = fetchedPhotos.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      setPhotos(sortedPhotos);
      setFilteredPhotos(sortedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    if (!uploadForm.caption.trim()) {
      toast.error('Please enter a caption');
      return;
    }

    if (!uploadForm.uploadedBy.trim() || !uploadForm.uploaderEmail.trim()) {
      toast.error('Please enter your name and email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(uploadForm.uploaderEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setUploading(true);

      // Upload image to Cloudinary
      const uploadResult = await uploadToCloudinary(imageFile, 'gallery');
      const imageUrl = uploadResult.secure_url; // Extract the URL string from the result

      // Determine status based on user role
      const status = user?.role === 'admin' ? 'approved' : 'pending';

      // Create gallery item
      await createGalleryPhoto({
        imageUrl,
        caption: uploadForm.caption,
        uploadedBy: uploadForm.uploadedBy,
        uploaderEmail: uploadForm.uploaderEmail,
        uploadDate: new Date().toISOString(),
        category: uploadForm.category,
        status,
        userId: user?.id,
      });

      if (status === 'approved') {
        toast.success('Photo uploaded successfully!');
        loadPhotos(); // Reload photos
      } else {
        toast.success('Photo uploaded! Awaiting admin approval.');
      }

      // Reset form
      setUploadForm({
        caption: '',
        category: GALLERY_CATEGORIES[0],
        uploadedBy: user?.name || '',
        uploaderEmail: user?.email || '',
      });
      setImageFile(null);
      setImagePreview('');
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Explore memories from our events, workshops, and activities
          </p>
          <Button 
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading photos...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No photos found in this category</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(photo)}
                className="cursor-pointer"
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="sans-serif" font-size="48" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                        target.onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge className="mb-2">{photo.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2 line-clamp-2">{photo.caption}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">{photo.uploadedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Share your photos from events, workshops, and activities.
              {user?.role !== 'admin' && ' Your photo will be reviewed by admin before appearing in the gallery.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Photo *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-slate-800/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Caption */}
            <div>
              <Label>Caption *</Label>
              <Textarea
                value={uploadForm.caption}
                onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                placeholder="Describe this photo..."
                rows={3}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category *</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Uploader Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Your Name *</Label>
                <Input
                  value={uploadForm.uploadedBy}
                  onChange={(e) => setUploadForm({ ...uploadForm, uploadedBy: e.target.value })}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label>Your Email *</Label>
                <Input
                  type="email"
                  value={uploadForm.uploaderEmail}
                  onChange={(e) => setUploadForm({ ...uploadForm, uploaderEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitUpload}
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo Details</DialogTitle>
            <DialogDescription>
              View the full-size photo and details
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="space-y-2">
                <p className="text-lg font-semibold">{selectedImage.caption}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <Badge>{selectedImage.category}</Badge>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedImage.uploadedBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(selectedImage.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}