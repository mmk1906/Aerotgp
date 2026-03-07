import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle, XCircle, Eye, Trash2, Edit, Upload, Image as ImageIcon, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getCollection, 
  updateGalleryPhoto, 
  deleteGalleryPhoto, 
  createGalleryPhoto,
  GalleryItem, 
  GALLERY_CATEGORIES 
} from '../services/databaseService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { useAuth } from '../context/AuthContext';

export function PhotoGalleryManagement() {
  const [allPhotos, setAllPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const [uploadForm, setUploadForm] = useState({
    caption: '',
    category: GALLERY_CATEGORIES[0],
    uploadedBy: user?.name || 'Admin',
    uploaderEmail: user?.email || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const fetchedPhotos = await getCollection<GalleryItem>('gallery');
      // Sort by upload date, newest first
      const sortedPhotos = fetchedPhotos.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      setAllPhotos(sortedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const pendingPhotos = allPhotos.filter(p => p.status === 'pending');
  const approvedPhotos = allPhotos.filter(p => p.status === 'approved');
  const rejectedPhotos = allPhotos.filter(p => p.status === 'rejected');

  const handleApprove = async (photoId: string) => {
    try {
      await updateGalleryPhoto(photoId, { status: 'approved' });
      toast.success('Photo approved successfully!');
      loadPhotos();
    } catch (error) {
      console.error('Error approving photo:', error);
      toast.error('Failed to approve photo');
    }
  };

  const handleReject = async (photoId: string) => {
    try {
      await updateGalleryPhoto(photoId, { status: 'rejected' });
      toast.success('Photo rejected');
      loadPhotos();
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast.error('Failed to reject photo');
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await deleteGalleryPhoto(photoId);
      toast.success('Photo deleted successfully!');
      loadPhotos();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
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

    try {
      setUploading(true);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(imageFile, 'gallery');

      // Create gallery item with auto-approved status for admin
      await createGalleryPhoto({
        imageUrl,
        caption: uploadForm.caption,
        uploadedBy: uploadForm.uploadedBy,
        uploaderEmail: uploadForm.uploaderEmail,
        uploadDate: new Date().toISOString(),
        category: uploadForm.category,
        status: 'approved', // Admin uploads are auto-approved
        userId: user?.id,
      });

      toast.success('Photo uploaded successfully!');
      loadPhotos();

      // Reset form
      setUploadForm({
        caption: '',
        category: GALLERY_CATEGORIES[0],
        uploadedBy: user?.name || 'Admin',
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

  const PhotoTable = ({ photos, showActions = true }: { photos: GalleryItem[], showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Preview</TableHead>
          <TableHead>Caption</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {photos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showActions ? 7 : 6} className="text-center text-gray-400 py-8">
              No photos found
            </TableCell>
          </TableRow>
        ) : (
          photos.map((photo) => (
            <TableRow key={photo.id}>
              <TableCell>
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="line-clamp-2 text-sm">{photo.caption}</p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{photo.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-semibold">{photo.uploadedBy}</div>
                  <div className="text-gray-400 text-xs">{photo.uploaderEmail}</div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-400">
                {new Date(photo.uploadDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    photo.status === 'approved'
                      ? 'default'
                      : photo.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {photo.status}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex space-x-2">
                    {photo.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(photo.id!)}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(photo.id!)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Photos</p>
                <p className="text-2xl font-bold">{allPhotos.length}</p>
              </div>
              <ImageIcon className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold">{pendingPhotos.length}</p>
              </div>
              <Badge className="bg-yellow-600 text-lg px-4 py-2">{pendingPhotos.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Approved</p>
                <p className="text-2xl font-bold">{approvedPhotos.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Rejected</p>
                <p className="text-2xl font-bold">{rejectedPhotos.length}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gallery Management</CardTitle>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending Approval
                {pendingPhotos.length > 0 && (
                  <Badge className="ml-2 bg-yellow-600">{pendingPhotos.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : (
                <PhotoTable photos={pendingPhotos} />
              )}
            </TabsContent>

            <TabsContent value="approved">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : (
                <PhotoTable photos={approvedPhotos} />
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : (
                <PhotoTable photos={rejectedPhotos} />
              )}
            </TabsContent>

            <TabsContent value="all">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : (
                <PhotoTable photos={allPhotos} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Upload a new photo to the gallery. Admin uploads are automatically approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-slate-800/50">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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

      {/* Photo Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{selectedPhoto.caption}</h3>
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
                    <Badge>{selectedPhoto.category}</Badge>
                    <Badge
                      variant={
                        selectedPhoto.status === 'approved'
                          ? 'default'
                          : selectedPhoto.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {selectedPhoto.status}
                    </Badge>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedPhoto.uploadedBy}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(selectedPhoto.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  {selectedPhoto.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          handleApprove(selectedPhoto.id!);
                          setSelectedPhoto(null);
                        }}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedPhoto.id!);
                          setSelectedPhoto(null);
                        }}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDelete(selectedPhoto.id!);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
