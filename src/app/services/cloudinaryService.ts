// Cloudinary Upload Service
import { CLOUDINARY_CONFIG, getPublicIdFromUrl } from '../config/cloudinary';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  url: string;
}

export type ImageCategory = 'profile' | 'event' | 'blog' | 'gallery' | 'club';

/**
 * Upload image to Cloudinary
 * @param file - The file to upload
 * @param category - Category for organizing uploads (profile, event, blog, gallery, club)
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with upload result containing secure URL and public ID
 */
export const uploadToCloudinary = async (
  file: File,
  category: ImageCategory = 'gallery',
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file'));
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      reject(new Error('Image size must be less than 10MB'));
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', `aerotgp/${category}`); // Organize by category
    formData.append('tags', category); // Add tags for easy management

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded / e.total) * 100);
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage,
          });
        }
      });
    }

    // Handle successful upload
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result: CloudinaryUploadResult = JSON.parse(xhr.responseText);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle upload error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed. Please check your internet connection.'));
    });

    // Handle upload abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled'));
    });

    // Send request
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    xhr.open('POST', cloudinaryUrl);
    xhr.send(formData);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of files to upload
 * @param category - Category for organizing uploads
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  category: ImageCategory = 'gallery',
  onProgress?: (completed: number, total: number) => void
): Promise<CloudinaryUploadResult[]> => {
  const results: CloudinaryUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadToCloudinary(files[i], category);
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Failed to upload file ${i + 1}:`, error);
      // Continue with other uploads even if one fails
    }
  }
  
  return results;
};

/**
 * Delete image from Cloudinary
 * Note: This requires server-side implementation with admin API key
 * For now, we'll track deleted images in Firebase and filter them out
 * @param publicId - The public ID of the image to delete
 * @returns Promise<boolean>
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  console.warn('Direct deletion requires server-side implementation.');
  console.log('Public ID to delete:', publicId);
  
  // For production, you would call your backend API here
  // Example: await fetch('/api/cloudinary/delete', { method: 'POST', body: { publicId } })
  
  // For now, we'll return true and handle deletion in Firebase
  // by marking the image as deleted or removing the reference
  return true;
};

/**
 * Delete image by URL
 * @param imageUrl - The full Cloudinary URL
 * @returns Promise<boolean>
 */
export const deleteImageByUrl = async (imageUrl: string): Promise<boolean> => {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) {
    throw new Error('Invalid Cloudinary URL');
  }
  return deleteFromCloudinary(publicId);
};

/**
 * Replace existing image
 * Uploads new image and optionally deletes old one
 * @param newFile - New image file
 * @param oldImageUrl - URL of image to replace
 * @param category - Category for the new upload
 * @param onProgress - Optional progress callback
 * @returns Promise with new upload result
 */
export const replaceImage = async (
  newFile: File,
  oldImageUrl: string | null,
  category: ImageCategory,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> => {
  // Upload new image first
  const newUploadResult = await uploadToCloudinary(newFile, category, onProgress);
  
  // Delete old image (if exists)
  if (oldImageUrl) {
    try {
      await deleteImageByUrl(oldImageUrl);
    } catch (error) {
      console.error('Failed to delete old image:', error);
      // Don't fail the operation if deletion fails
    }
  }
  
  return newUploadResult;
};

/**
 * Validate image before upload
 * @param file - File to validate
 * @returns Object with validation result and error message
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Only JPEG, PNG, GIF, and WebP images are allowed' 
    };
  }

  return { valid: true };
};

/**
 * Get image dimensions from file
 * @param file - Image file
 * @returns Promise with width and height
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Generate preview URL for file
 * @param file - Image file
 * @returns Preview URL
 */
export const generatePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Compress image before upload (optional)
 * @param file - Original image file
 * @param maxWidth - Maximum width
 * @param quality - JPEG quality (0-1)
 * @returns Promise with compressed file
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize if needed
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = URL.createObjectURL(file);
  });
};
