import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Upload, X, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: string;
  eventName: string;
  uploadedAt: string;
}

const CATEGORIES = [
  'Events',
  'Workshops',
  'Aero Club',
  'Projects',
  'Visits',
  'Competitions',
  'Seminars',
  'Team Photos',
  'Other'
];

export function PhotoGalleryManagement() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const stored = localStorage.getItem('galleryPhotos');
    return stored ? JSON.parse(stored) : [];
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string[]>([]);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    category: 'Events',
    eventName: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const previews = acceptedFiles.map(file => URL.createObjectURL(file));
    setUploadPreview(prev => [...prev, ...previews]);
    toast.success(`${acceptedFiles.length} image(s) ready to upload`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  });

  const handleUpload = () => {
    if (!newPhoto.caption || !newPhoto.eventName || uploadPreview.length === 0) {
      toast.error('Please fill all fields and upload at least one image');
      return;
    }

    const newPhotos = uploadPreview.map((url, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url,
      caption: newPhoto.caption,
      category: newPhoto.category,
      eventName: newPhoto.eventName,
      uploadedAt: new Date().toISOString()
    }));

    const updated = [...photos, ...newPhotos];
    setPhotos(updated);
    localStorage.setItem('galleryPhotos', JSON.stringify(updated));

    setUploadDialogOpen(false);
    setUploadPreview([]);
    setNewPhoto({ caption: '', category: 'Events', eventName: '' });
    toast.success(`${newPhotos.length} photo(s) uploaded successfully!`);
  };

  const handleEdit = () => {
    if (!selectedPhoto) return;

    const updated = photos.map(p => 
      p.id === selectedPhoto.id ? selectedPhoto : p
    );
    setPhotos(updated);
    localStorage.setItem('galleryPhotos', JSON.stringify(updated));
    setEditDialogOpen(false);
    setSelectedPhoto(null);
    toast.success('Photo updated successfully!');
  };

  const handleDelete = () => {
    if (!selectedPhoto) return;

    const updated = photos.filter(p => p.id !== selectedPhoto.id);
    setPhotos(updated);
    localStorage.setItem('galleryPhotos', JSON.stringify(updated));
    setDeleteDialogOpen(false);
    setSelectedPhoto(null);
    toast.success('Photo deleted successfully!');
  };

  const removePreview = (index: number) => {
    setUploadPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Photo Gallery Management</h2>
          <p className="text-gray-400 mt-1">Upload and manage gallery photos</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Photos</p>
                <p className="text-2xl font-bold">{photos.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        {CATEGORIES.slice(0, 3).map(cat => (
          <Card key={cat} className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-400">{cat}</p>
                <p className="text-2xl font-bold">
                  {photos.filter(p => p.category === cat).length}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photo Grid */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle>Gallery Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No photos uploaded yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Your First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-slate-800"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-blue-500/20 hover:bg-blue-500/40"
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setPreviewDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-yellow-500/20 hover:bg-yellow-500/40"
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-500/20 hover:bg-red-500/40"
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-xs font-medium truncate">{photo.caption}</p>
                      <p className="text-xs text-gray-400">{photo.category}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              Drag and drop images or click to browse
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-400">Drop the images here...</p>
              ) : (
                <div>
                  <p className="text-gray-300 mb-2">Drag & drop images here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
              )}
            </div>

            {/* Preview */}
            {uploadPreview.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {uploadPreview.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePreview(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label>Caption</Label>
                <Input
                  placeholder="e.g., Annual Tech Fest 2024"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                />
              </div>

              <div>
                <Label>Event Name</Label>
                <Input
                  placeholder="e.g., AeroFest 2024"
                  value={newPhoto.eventName}
                  onChange={(e) => setNewPhoto({ ...newPhoto, eventName: e.target.value })}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={newPhoto.category}
                  onValueChange={(value) => setNewPhoto({ ...newPhoto, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadDialogOpen(false);
              setUploadPreview([]);
              setNewPhoto({ caption: '', category: 'Events', eventName: '' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload Photos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>

          {selectedPhoto && (
            <div className="space-y-4">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption}
                className="w-full aspect-video object-cover rounded-lg"
              />

              <div>
                <Label>Caption</Label>
                <Input
                  value={selectedPhoto.caption}
                  onChange={(e) => setSelectedPhoto({ ...selectedPhoto, caption: e.target.value })}
                />
              </div>

              <div>
                <Label>Event Name</Label>
                <Input
                  value={selectedPhoto.eventName}
                  onChange={(e) => setSelectedPhoto({ ...selectedPhoto, eventName: e.target.value })}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={selectedPhoto.category}
                  onValueChange={(value) => setSelectedPhoto({ ...selectedPhoto, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              setSelectedPhoto(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.caption}</DialogTitle>
            <DialogDescription>
              {selectedPhoto?.eventName} • {selectedPhoto?.category}
            </DialogDescription>
          </DialogHeader>

          {selectedPhoto && (
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.caption}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPhoto(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
