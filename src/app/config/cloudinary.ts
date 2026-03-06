// Cloudinary Configuration
import { Cloudinary } from 'cloudinary-core';

// Environment variables for Cloudinary
// These should be set in your environment or .env file
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dbeqyg0af',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '259922665116269',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'aerotgp_preset',
};

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  secure: true,
});

// Cloudinary image transformation presets
export const TRANSFORMATIONS = {
  // Profile pictures - 400x400, circular crop, optimized
  profile: {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  
  // Thumbnails - 200x200
  thumbnail: {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto:eco',
    fetch_format: 'auto',
  },
  
  // Blog images - 1200px width, maintain aspect ratio
  blog: {
    width: 1200,
    crop: 'scale',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  
  // Event posters - 800x600, optimized
  event: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  
  // Gallery images - 1000px width, maintain aspect ratio
  gallery: {
    width: 1000,
    crop: 'scale',
    quality: 'auto:best',
    fetch_format: 'auto',
  },
  
  // Hero images - 1920px width
  hero: {
    width: 1920,
    crop: 'scale',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  transformationType: keyof typeof TRANSFORMATIONS = 'thumbnail'
): string => {
  const transformation = TRANSFORMATIONS[transformationType];
  return cloudinary.url(publicId, transformation);
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (publicId: string) => {
  return {
    small: cloudinary.url(publicId, { width: 400, crop: 'scale', quality: 'auto' }),
    medium: cloudinary.url(publicId, { width: 800, crop: 'scale', quality: 'auto' }),
    large: cloudinary.url(publicId, { width: 1200, crop: 'scale', quality: 'auto' }),
    xlarge: cloudinary.url(publicId, { width: 1920, crop: 'scale', quality: 'auto' }),
  };
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after version number
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Validate Cloudinary configuration
export const validateCloudinaryConfig = (): boolean => {
  if (CLOUDINARY_CONFIG.cloudName === 'demo') {
    console.warn('⚠️ Using demo Cloudinary cloud. Please set VITE_CLOUDINARY_CLOUD_NAME in your environment.');
    return false;
  }
  
  if (!CLOUDINARY_CONFIG.uploadPreset) {
    console.error('❌ VITE_CLOUDINARY_UPLOAD_PRESET is not set. Image uploads will fail.');
    return false;
  }
  
  return true;
};
