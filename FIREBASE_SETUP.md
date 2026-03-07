# Firebase Setup Guide for Aeronautical Engineering Department Website

## Overview
This document provides complete instructions for setting up Firebase for the Aeronautical Engineering Department website with authentication, database, storage, and analytics.

## Firebase Configuration

The Firebase project is already configured with the following credentials:
- **Project ID**: aerotgp-e5700
- **Database URL**: https://aerotgp-e5700-default-rtdb.firebaseio.com
- **Storage Bucket**: aerotgp-e5700.firebasestorage.app

## 1. Firebase Console Setup

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the project: `aerotgp-e5700`

### Step 2: Enable Authentication
1. Navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable **Google** sign-in for easier login

### Step 3: Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Start in **production mode** (we'll add security rules later)
4. Choose your preferred location (closest to your users)

### Step 4: Set Up Firebase Storage
1. Navigate to **Storage**
2. Click **Get started**
3. Start in **production mode**
4. Use the same location as Firestore

### Step 5: Enable Analytics (Optional)
1. Navigate to **Analytics**
2. Enable Google Analytics if desired

## 2. Security Rules

### Firestore Security Rules

Navigate to **Firestore Database** > **Rules** and paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
    
    // Event Registrations
    match /registrations/{registrationId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isAdmin() || 
                     isOwner(resource.data.userId);
      allow delete: if isAdmin();
    }
    
    // Blogs
    match /blogs/{blogId} {
      // Allow reading published blogs publicly, or any blog if user is owner/admin
      allow read: if true; // Public can see all to filter on frontend
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (request.auth.uid == resource.data.authorId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Gallery Photos
    match /gallery/{photoId} {
      // Allow reading all photos (frontend will filter by status)
      allow read: if true;
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Club Members
    match /clubMembers/{memberId} {
      // Allow reading all members (frontend will filter by status)
      allow read: if true;
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Clubs collection
    match /clubs/{clubId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
    
    // MCQ Tests
    match /tests/{testId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Test Results
    match /testResults/{resultId} {
      allow read: if isSignedIn() && (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Faculty collection
    match /faculty/{facultyId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
  }
}
```

### Firebase Storage Security Rules

Navigate to **Storage** > **Rules** and paste the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isValidImageSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB
    }
    
    function isValidImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Profile photos
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if isOwner(userId) && isValidImage() && isValidImageSize();
    }
    
    // Event images
    match /events/{eventId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && isValidImage() && isValidImageSize();
    }
    
    // Blog images
    match /blogs/{blogId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn() && isValidImage() && isValidImageSize();
    }
    
    // Gallery photos
    match /gallery/{category}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn() && isValidImage() && isValidImageSize();
    }
    
    // Club project photos
    match /club/projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn() && isValidImage() && isValidImageSize();
    }
  }
}
```

## 3. Creating the Admin User

### Option 1: Via Firebase Console (Recommended)
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email: `admin@aerotgp.com`
4. Set a strong password
5. Click **Add user**
6. After user is created, go to **Firestore Database**
7. Navigate to `users` collection
8. Find the user document (by UID)
9. Edit the document and add field: `role` with value `admin`

### Option 2: Via Code (After first user registration)
1. Register a new user through the website
2. Go to Firestore Database
3. Find the user in the `users` collection
4. Edit the document and change `role` from `student` to `admin`

## 4. Database Collections Structure

The following collections will be automatically created when data is added:

### users
```javascript
{
  id: string,
  name: string,
  email: string,
  phone?: string,
  department?: string,
  year?: string,
  prn?: string,
  role: 'student' | 'admin',
  profilePhoto?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### events
```javascript
{
  id: string,
  title: string,
  description: string,
  date: string,
  venue: string,
  price: number,
  isPaid: boolean,
  maxParticipants: number,
  registrationDeadline: string,
  imageUrl?: string,
  category?: string,
  status: 'upcoming' | 'ongoing' | 'completed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### registrations
```javascript
{
  id: string,
  userId: string,
  eventId: string,
  userName: string,
  userEmail: string,
  userPhone?: string,
  status: 'pending' | 'approved' | 'rejected',
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentId?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### blogs
```javascript
{
  id: string,
  title: string,
  authorId: string,
  authorName: string,
  content: string,
  excerpt?: string,
  category: string,
  tags?: string[],
  status: 'draft' | 'pending' | 'published' | 'rejected',
  imageUrl?: string,
  likes: number,
  views: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### gallery
```javascript
{
  id: string,
  imageUrl: string,
  caption: string,
  category: string,
  uploadedBy: string,
  uploaderName: string,
  status: 'pending' | 'approved' | 'rejected',
  likes?: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### clubMembers
```javascript
{
  id: string,
  userId: string,
  name: string,
  email: string,
  phone?: string,
  department?: string,
  year?: string,
  role?: string,
  position?: string,
  joinedDate?: string,
  status: 'active' | 'inactive',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### tests
```javascript
{
  id: string,
  subject: string,
  title: string,
  description?: string,
  duration?: number,
  totalQuestions: number,
  passingScore?: number,
  questions: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### testResults
```javascript
{
  id: string,
  userId: string,
  userName: string,
  testId: string,
  testTitle: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  incorrectAnswers: number,
  timeTaken?: number,
  passed?: boolean,
  answers?: array,
  createdAt: timestamp
}
```

## 5. Storage Folder Structure

```
/profiles
  /{userId}
    /profile_*.jpg

/events
  /{eventId}
    /event_*.jpg

/blogs
  /{blogId}
    /blog_*.jpg

/gallery
  /{category}
    /gallery_*.jpg

/club
  /projects
    /{projectId}
      /project_*.jpg
```

## 6. Testing the Integration

### Test Authentication
1. Go to the website login page
2. Try registering a new user
3. Verify user appears in Firebase Console > Authentication
4. Verify user document created in Firestore > users collection

### Test Database Operations
1. Create an event from admin dashboard
2. Verify event appears in Firestore > events collection
3. Register for an event as a student
4. Verify registration appears in registrations collection

### Test Storage
1. Upload a profile photo
2. Verify file appears in Storage > profiles/{userId}
3. Upload a gallery photo
4. Verify file appears in Storage > gallery/{category}

### Test Export Functionality
1. Go to Admin Dashboard > Export Data tab
2. Click "Export to Excel" for any data type
3. Verify Excel file downloads with data

## 7. Important Notes

### Security
- Never share Firebase API keys publicly (they're already in the code, but have security rules)
- Security rules protect your data even if API keys are public
- Always validate data on both client and server side

### Data Migration
- The website currently uses mock data (localStorage)
- To migrate to Firebase, the AuthContext has been updated
- Data will start populating in Firebase as users interact with the site

### Backup
- Enable automatic backups in Firebase Console
- Export data regularly using the Export Data tab in Admin Dashboard

### Costs
- Firebase has a free tier (Spark plan)
- Monitor usage in Firebase Console > Usage
- Consider upgrading to Blaze plan for production use

## 8. Troubleshooting

### Authentication Errors
- Verify Email/Password is enabled in Firebase Console
- Check browser console for detailed error messages
- Ensure user has proper role set in Firestore

### Permission Denied Errors
- Verify security rules are properly set
- Check if user is authenticated
- Verify user has correct role (admin/student)

### Storage Upload Failures
- Check file size (max 5MB)
- Verify file is an image format
- Check storage security rules

## 9. Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For website-specific issues:
- Check browser console for errors
- Review Firebase Console logs
- Contact system administrator

## 10. Next Steps

1. ✅ Firebase SDK installed and configured
2. ✅ Authentication service created
3. ✅ Database service created
4. ✅ Storage service created
5. ✅ Export service created
6. ⏳ Set up Firebase Console (follow steps above)
7. ⏳ Apply security rules
8. ⏳ Create admin user
9. ⏳ Test all features
10. ⏳ Deploy to production

---

**Last Updated**: March 6, 2026
**Version**: 1.0.0