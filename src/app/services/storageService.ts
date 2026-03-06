// Firebase Storage Service
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
} from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

// Upload file to Firebase Storage
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress({
              progress,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
            });
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const fileName = `profile_${Date.now()}_${file.name}`;
  const path = `profiles/${userId}/${fileName}`;
  return uploadFile(file, path, onProgress);
};

// Upload blog image
export const uploadBlogImage = async (
  file: File,
  blogId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const fileName = `blog_${Date.now()}_${file.name}`;
  const path = `blogs/${blogId}/${fileName}`;
  return uploadFile(file, path, onProgress);
};

// Upload event image
export const uploadEventImage = async (
  file: File,
  eventId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const fileName = `event_${Date.now()}_${file.name}`;
  const path = `events/${eventId}/${fileName}`;
  return uploadFile(file, path, onProgress);
};

// Upload gallery photo
export const uploadGalleryPhoto = async (
  file: File,
  category: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const fileName = `gallery_${Date.now()}_${file.name}`;
  const path = `gallery/${category}/${fileName}`;
  return uploadFile(file, path, onProgress);
};

// Upload club project photo
export const uploadClubProjectPhoto = async (
  file: File,
  projectId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const fileName = `project_${Date.now()}_${file.name}`;
  const path = `club/projects/${projectId}/${fileName}`;
  return uploadFile(file, path, onProgress);
};

// Delete file from Firebase Storage
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
};

// List all files in a directory
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const listRef = ref(storage, path);
    const result = await listAll(listRef);
    
    const urls = await Promise.all(
      result.items.map(item => getDownloadURL(item))
    );
    
    return urls;
  } catch (error: any) {
    console.error('Error listing files:', error);
    throw new Error(error.message || 'Failed to list files');
  }
};

// Get file download URL
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error: any) {
    console.error('Error getting file URL:', error);
    throw new Error(error.message || 'Failed to get file URL');
  }
};
