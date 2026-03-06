import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  uploadToCloudinary,
  validateImage,
  generatePreviewUrl,
  type ImageCategory,
  type CloudinaryUploadResult,
  type UploadProgress,
} from '../services/cloudinaryService';
import { toast } from 'sonner';

interface CloudinaryImageUploaderProps {
  category: ImageCategory;
  onUploadComplete: (result: CloudinaryUploadResult) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  existingImageUrl?: string;
  buttonText?: string;
  className?: string;
}

export function CloudinaryImageUploader({
  category,
  onUploadComplete,
  onUploadError,
  maxFiles = 1,
  existingImageUrl,
  buttonText = 'Upload Image',
  className = '',
}: CloudinaryImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUpload = async (file: File) => {
    setError(null);
    setUploadComplete(false);

    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image');
      if (onUploadError) {
        onUploadError(new Error(validation.error));
      }
      return;
    }

    // Generate preview
    const previewUrl = generatePreviewUrl(file);
    setPreview(previewUrl);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        file,
        category,
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        }
      );

      setUploadComplete(true);
      toast.success('Image uploaded successfully!');
      onUploadComplete(result);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setPreview(null);
      toast.error(err.message || 'Upload failed');
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles,
    multiple: false,
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    setUploadComplete(false);
    setUploadProgress(0);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
            {isDragActive ? (
              <p className="text-blue-400 font-medium">Drop the image here...</p>
            ) : (
              <>
                <p className="text-gray-300 font-medium">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF, or WebP (max 10MB)
                </p>
              </>
            )}
            <Button type="button" variant="outline" className="mt-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              {buttonText}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-slate-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            {!uploading && (
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            {uploadComplete && (
              <div className="absolute top-2 left-2 p-2 bg-green-500 rounded-full">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uploading to Cloudinary...</span>
                <span className="text-blue-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadComplete && (
            <Alert className="bg-green-900/20 border-green-600/50">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">
                Image uploaded successfully! The URL has been saved.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {error && (
        <Alert className="bg-red-900/20 border-red-600/50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Multiple Image Uploader Component
 * Allows uploading multiple images at once
 */
interface MultiImageUploaderProps {
  category: ImageCategory;
  onUploadComplete: (results: CloudinaryUploadResult[]) => void;
  maxFiles?: number;
  className?: string;
}

export function MultiImageUploader({
  category,
  onUploadComplete,
  maxFiles = 5,
  className = '',
}: MultiImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploadedResults, setUploadedResults] = useState<CloudinaryUploadResult[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles);
    setFiles(newFiles);
    
    // Generate previews
    const newPreviews = newFiles.map(file => generatePreviewUrl(file));
    setPreviews(newPreviews);
    
    // Initialize progress tracking
    setUploadProgress(new Array(newFiles.length).fill(0));
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles,
    multiple: true,
  });

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const results: CloudinaryUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(
          files[i],
          category,
          (progress) => {
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[i] = progress.percentage;
              return newProgress;
            });
          }
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload file ${i}:`, error);
        toast.error(`Failed to upload ${files[i].name}`);
      }
    }

    setUploadedResults(results);
    setUploading(false);
    
    if (results.length > 0) {
      toast.success(`Successfully uploaded ${results.length} images!`);
      onUploadComplete(results);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setUploadProgress([]);
    setUploadedResults([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {files.length === 0 ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
            <p className="text-gray-300 font-medium">
              Drop multiple images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Upload up to {maxFiles} images (PNG, JPG, GIF, WebP - max 10MB each)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                {!uploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    type="button"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
                {uploading && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <Progress value={uploadProgress[index]} className="h-1" />
                  </div>
                )}
                {uploadedResults[index] && (
                  <div className="absolute top-1 left-1 p-1 bg-green-500 rounded-full">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleUploadAll}
              disabled={uploading || uploadedResults.length > 0}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All
                </>
              )}
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
              disabled={uploading}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
