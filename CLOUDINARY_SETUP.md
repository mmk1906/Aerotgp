# Cloudinary Integration Setup Guide

## 📋 Overview

This guide will help you integrate Cloudinary for media storage in the Aeronautical Engineering Department website. Cloudinary provides optimized image hosting, transformation, and CDN delivery.

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Log in to your [Cloudinary Console](https://cloudinary.com/console)

### Step 2: Get Your Credentials

From your Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `aerotgp`)
- **API Key** (e.g., `123456789012345`)

### Step 3: Create Upload Preset

1. Go to **Settings** > **Upload** tab
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Signing Mode**: Unsigned
   - **Preset name**: `aerotgp_preset` (or your custom name)
   - **Folder**: `aerotgp` (optional, for organization)
5. Click **Save**

### Step 4: Set Environment Variables

Create a `.env` file in your project root:

```bash
# Copy from .env.example and fill in your values
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=aerotgp_preset
```

**Example:**
```bash
VITE_CLOUDINARY_CLOUD_NAME=aerotgp
VITE_CLOUDINARY_UPLOAD_PRESET=aerotgp_preset
```

### Step 5: Restart Development Server

```bash
# Stop your dev server (Ctrl+C)
# Start it again
npm run dev
```

### ✅ You're Done!

The website will now upload all images to Cloudinary automatically!

## 📚 Detailed Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | ✅ Yes | Your Cloudinary cloud name | `aerotgp` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | ✅ Yes | Unsigned upload preset name | `aerotgp_preset` |
| `VITE_CLOUDINARY_API_KEY` | ❌ Optional | Only for server-side operations | `123456789012345` |

### Upload Preset Configuration

For best results, configure your upload preset with:

**Basic Settings:**
- **Signing Mode**: Unsigned (required for client-side uploads)
- **Preset name**: Choose a memorable name
- **Folder**: `aerotgp` (organizes uploads)

**Transformations (Optional but Recommended):**
- **Format**: Auto (automatically chooses best format)
- **Quality**: Auto:good (balances quality and file size)
- **Fetch format**: Auto (WebP for modern browsers, fallback for others)

**Advanced Settings:**
- **Unique filename**: Yes (prevents naming conflicts)
- **Overwrite**: No (keeps original if re-uploaded)
- **Tags**: Auto-generate or custom (for organization)

## 🗂️ Cloudinary Folder Structure

Images are automatically organized into folders:

```
aerotgp/
├── profile/          # User profile photos
├── event/            # Event posters
├── blog/             # Blog cover images
├── gallery/          # Gallery photos
└── club/             # Club-related images
```

## 🎯 Features Implemented

### 1. Drag & Drop Upload
- Visual drag-and-drop interface
- File validation (type, size)
- Real-time upload progress
- Preview before upload

### 2. Automatic Optimization
- Auto format conversion (WebP for modern browsers)
- Quality optimization
- Responsive image URLs
- CDN delivery worldwide

### 3. Image Transformations
Pre-configured transformations:
- **Profile**: 400x400, face detection, circular crop
- **Thumbnail**: 200x200
- **Blog**: 1200px width, optimized
- **Event**: 800x600, optimized
- **Gallery**: 1000px width, best quality

### 4. Upload Locations

| Feature | Category | Max Size | Transformation |
|---------|----------|----------|----------------|
| Profile Photos | `profile` | 10MB | 400x400, face crop |
| Event Posters | `event` | 10MB | 800x600 |
| Blog Images | `blog` | 10MB | 1200px width |
| Gallery Photos | `gallery` | 10MB | 1000px width |
| Club Photos | `club` | 10MB | 1000px width |

## 💻 Implementation Details

### Files Created

```
Configuration:
├── /src/app/config/cloudinary.ts          # Cloudinary setup & transformations

Services:
├── /src/app/services/cloudinaryService.ts # Upload/delete/validation functions

Components:
├── /src/app/components/CloudinaryImageUploader.tsx    # Drag-and-drop uploader
├── /src/app/components/ProfilePhotoUploader.tsx       # Profile photo component
├── /src/app/components/GalleryUploadForm.tsx          # Updated for Cloudinary
└── /src/app/pages/BlogCreate.tsx                      # Updated for Cloudinary

Environment:
└── /.env.example                          # Environment template
```

### Updated Components

1. **GalleryUploadForm** - Gallery image uploads
2. **BlogCreate** - Blog cover image uploads
3. **ProfileManagement** - Profile photo uploads
4. **AdminDashboard** - Event poster uploads (future)

## 🔧 Usage Examples

### Basic Upload

```typescript
import { uploadToCloudinary } from '../services/cloudinaryService';

const handleUpload = async (file: File) => {
  const result = await uploadToCloudinary(file, 'gallery');
  console.log('Uploaded:', result.secure_url);
  // Save result.secure_url to Firebase
};
```

### Upload with Progress

```typescript
const handleUpload = async (file: File) => {
  const result = await uploadToCloudinary(
    file,
    'blog',
    (progress) => {
      console.log(`Upload: ${progress.percentage}%`);
    }
  );
};
```

### Using the Component

```tsx
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';

function MyComponent() {
  const handleComplete = (result) => {
    console.log('Image URL:', result.secure_url);
    // Save to Firebase database
  };

  return (
    <CloudinaryImageUploader
      category="event"
      onUploadComplete={handleComplete}
      buttonText="Upload Event Poster"
    />
  );
}
```

### Multiple Images

```tsx
import { MultiImageUploader } from '../components/CloudinaryImageUploader';

function GalleryUpload() {
  const handleComplete = (results) => {
    results.forEach(result => {
      console.log('Uploaded:', result.secure_url);
    });
  };

  return (
    <MultiImageUploader
      category="gallery"
      onUploadComplete={handleComplete}
      maxFiles={5}
    />
  );
}
```

## 🖼️ Image Optimization

### Automatic Transformations

All uploaded images are automatically optimized:

```javascript
// Original upload
https://res.cloudinary.com/aerotgp/image/upload/v1234/aerotgp/blog/image.jpg

// Optimized (automatic)
https://res.cloudinary.com/aerotgp/image/upload/w_1200,q_auto,f_auto/aerotgp/blog/image.jpg
```

### Get Optimized URL

```typescript
import { getOptimizedImageUrl } from '../config/cloudinary';

// Get thumbnail
const thumbnailUrl = getOptimizedImageUrl(publicId, 'thumbnail');

// Get blog-sized image
const blogUrl = getOptimizedImageUrl(publicId, 'blog');
```

### Responsive Images

```typescript
import { getResponsiveImageUrls } from '../config/cloudinary';

const urls = getResponsiveImageUrls(publicId);
console.log(urls.small);   // 400px
console.log(urls.medium);  // 800px
console.log(urls.large);   // 1200px
console.log(urls.xlarge);  // 1920px
```

## 🗑️ Image Management

### Delete Images

**Note:** Direct deletion requires server-side implementation. For now, we handle deletion by removing references in Firebase.

```typescript
import { deleteImageByUrl } from '../services/cloudinaryService';

// Mark as deleted in Firebase
const handleDelete = async (imageUrl: string) => {
  // Remove from Firebase database
  await deleteDoc(doc(db, 'gallery', imageId));
  
  // Optional: Track for cleanup
  console.log('Deleted reference to:', imageUrl);
};
```

### Replace Images

```typescript
import { replaceImage } from '../services/cloudinaryService';

const handleReplace = async (newFile: File, oldUrl: string) => {
  const result = await replaceImage(newFile, oldUrl, 'event');
  // Update Firebase with new URL
  await updateDoc(doc(db, 'events', eventId), {
    imageUrl: result.secure_url
  });
};
```

## 📊 Cloudinary Dashboard

### View Uploads

1. Go to [Media Library](https://cloudinary.com/console/media_library)
2. Browse by folder (profile, event, blog, gallery, club)
3. View image details, transformations, and usage

### Analytics

1. Go to **Reports** in Cloudinary Dashboard
2. View:
   - Storage usage
   - Bandwidth usage
   - Transformation usage
   - Most accessed images

### Optimize Costs

1. **Auto-cleanup**: Set up auto-deletion of unused images
2. **Compression**: Use `q_auto` for automatic quality optimization
3. **Format**: Use `f_auto` for automatic format selection
4. **Lazy loading**: Implement lazy loading for images

## 💰 Pricing

### Free Tier (Perfect for Development)

- ✅ **25 GB storage**
- ✅ **25 GB/month bandwidth**
- ✅ **25,000 transformations/month**
- ✅ **Unlimited** images

### Estimated Usage (Small University Department)

- ~500 active users
- ~1000 images/month
- ~5 GB storage
- ~10 GB bandwidth/month

**Cost: FREE** (well within free tier limits)

### Upgrade When Needed

Monitor usage in Cloudinary Dashboard. Upgrade when you exceed free tier limits.

## 🔒 Security Best Practices

### ✅ Do's

1. **Use unsigned upload presets** for client-side uploads
2. **Validate files** on client-side (type, size)
3. **Organize by folders** for better management
4. **Use transformations** to optimize delivery
5. **Monitor usage** regularly

### ❌ Don'ts

1. **Don't expose API Secret** (not needed for client-side)
2. **Don't store raw API key** in client code
3. **Don't allow unlimited uploads** without validation
4. **Don't upload sensitive data** without encryption

## 🐛 Troubleshooting

### Upload Fails with "Invalid Preset"

**Solution:**
1. Check that preset exists in Cloudinary Dashboard
2. Verify preset is **Unsigned**
3. Ensure `VITE_CLOUDINARY_UPLOAD_PRESET` matches exactly

### Images Not Loading

**Solution:**
1. Check Cloud Name is correct
2. Verify image URL in browser
3. Check browser console for CORS errors
4. Ensure image was uploaded successfully

### Environment Variables Not Working

**Solution:**
1. Restart development server after changing `.env`
2. Verify `.env` is in project root
3. Check variable names start with `VITE_`
4. Don't use quotes around values in `.env`

### "Demo Cloud" Warning

**Solution:**
1. Replace demo cloud name with your actual cloud name
2. Update `VITE_CLOUDINARY_CLOUD_NAME` in `.env`
3. Restart server

## 📱 Testing

### Test Upload Flow

1. Go to Gallery page as logged-in user
2. Click "Upload Photo"
3. Drag and drop an image
4. Verify upload progress shows
5. Confirm image appears in preview
6. Check Cloudinary Dashboard for uploaded image

### Test Different Image Types

- ✅ JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP

### Test File Size Limits

- ✅ Small image (< 1MB) - should upload fast
- ✅ Large image (5-10MB) - should show progress
- ❌ Huge image (> 10MB) - should reject with error

## 🚀 Production Deployment

### Checklist

- [ ] Create production Cloudinary account
- [ ] Set up upload presets
- [ ] Configure transformations
- [ ] Set environment variables in production
- [ ] Test uploads in production environment
- [ ] Monitor usage and costs
- [ ] Set up backup/retention policies
- [ ] Configure CDN settings

### Environment Variables (Production)

Add to your hosting platform (Vercel, Netlify, etc.):

```bash
VITE_CLOUDINARY_CLOUD_NAME=your_production_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=your_production_preset
```

## 📖 Additional Resources

### Official Documentation
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Transformation Reference](https://cloudinary.com/documentation/transformation_reference)

### API References
- [Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformation Parameters](https://cloudinary.com/documentation/image_transformations)

### Tools
- [Cloudinary Console](https://cloudinary.com/console)
- [Media Library](https://cloudinary.com/console/media_library)
- [Image Optimizer](https://cloudinary.com/tools/image-optimizer)

## 💡 Tips & Best Practices

1. **Use folders** to organize uploads by category
2. **Tag images** for easy searching and management
3. **Monitor usage** regularly to avoid surprises
4. **Optimize transformations** for faster page loads
5. **Use responsive images** for better mobile experience
6. **Implement lazy loading** for images below the fold
7. **Set up webhooks** for advanced automation (optional)
8. **Create backup strategy** for important images

## 🎉 Success!

You've successfully integrated Cloudinary! All images uploaded through:
- ✅ Gallery uploads
- ✅ Blog cover images
- ✅ Profile photos
- ✅ Event posters (when implemented)

Will now be stored on Cloudinary with automatic optimization and CDN delivery!

---

**Last Updated**: March 6, 2026
**Version**: 1.0.0
**Status**: ✅ Ready for Production

**Quick Links:**
- [Cloudinary Console](https://cloudinary.com/console)
- [Media Library](https://cloudinary.com/console/media_library)
- [Upload Presets](https://cloudinary.com/console/settings/upload)
