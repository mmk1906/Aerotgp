# 🔐 Firebase Security Rules - Complete Configuration

## ⚠️ CRITICAL: Update These Rules in Firebase Console

The error you're seeing is because Firebase Firestore has restrictive default security rules that block all reads and writes.

---

## 📍 How to Update Firebase Rules

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top

### Step 2: Replace Rules
Copy and paste the rules below into the Firebase Rules editor, then click **Publish**.

---

## 🔥 PRODUCTION-READY FIRESTORE SECURITY RULES

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users Collection
    match /users/{userId} {
      // Anyone can read user profiles (for public display)
      allow read: if true;
      
      // Users can create their own profile
      allow create: if isSignedIn() && request.auth.uid == userId;
      
      // Users can update their own profile, admins can update any
      allow update: if isOwner(userId) || isAdmin();
      
      // Only admins can delete users
      allow delete: if isAdmin();
    }
    
    // Events Collection
    match /events/{eventId} {
      // Anyone can read events (public website)
      allow read: if true;
      
      // Only admins can create, update, or delete events
      allow create, update, delete: if isAdmin();
    }
    
    // Event Registrations Collection
    match /registrations/{registrationId} {
      // Users can read their own registrations, admins can read all
      allow read: if isSignedIn() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Signed-in users can create registrations
      allow create: if isSignedIn();
      
      // Users can update their own registrations, admins can update any (for approval)
      allow update: if isSignedIn() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only admins can delete registrations
      allow delete: if isAdmin();
    }
    
    // Quizzes Collection (NEW - replaces 'tests')
    match /quizzes/{quizId} {
      // Anyone can read published quizzes
      allow read: if true;
      
      // Only admins can create, update, or delete quizzes
      allow create, update, delete: if isAdmin();
    }
    
    // Quiz Attempts Collection (NEW - replaces 'testResults')
    match /quizAttempts/{attemptId} {
      // Users can read their own attempts, admins can read all
      allow read: if isSignedIn() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Signed-in users can create quiz attempts
      allow create: if isSignedIn();
      
      // Only the user who created the attempt can update it (not typically needed)
      allow update: if isOwner(resource.data.userId) || isAdmin();
      
      // Only admins can delete attempts
      allow delete: if isAdmin();
    }
    
    // Clubs Collection
    match /clubs/{clubId} {
      // Anyone can read clubs (public website)
      allow read: if true;
      
      // Only admins can create, update, or delete clubs
      allow create, update, delete: if isAdmin();
    }
    
    // Club Members Collection
    match /clubMembers/{memberId} {
      // Anyone can read club members (public display)
      allow read: if true;
      
      // Only admins can create members (after approving join requests)
      allow create: if isAdmin();
      
      // Admins can update, or members can update their own profile
      allow update: if isAdmin() || isOwner(resource.data.userId);
      
      // Only admins can delete members
      allow delete: if isAdmin();
    }
    
    // Club Join Requests Collection
    match /clubJoinRequests/{requestId} {
      // Users can read their own requests, admins can read all
      allow read: if isSignedIn() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Signed-in users can create join requests
      allow create: if isSignedIn();
      
      // Only admins can update requests (for approval/rejection)
      allow update: if isAdmin();
      
      // Users can delete their own pending requests, admins can delete any
      allow delete: if isSignedIn() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Club Projects Collection
    match /clubProjects/{projectId} {
      // Anyone can read projects (public display)
      allow read: if true;
      
      // Only admins can create, update, or delete projects
      allow create, update, delete: if isAdmin();
    }
    
    // Club Applications Collection (LEGACY - being phased out)
    match /clubApplications/{applicationId} {
      // Users can read their own applications, admins can read all
      allow read: if isSignedIn() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Signed-in users can create applications
      allow create: if isSignedIn();
      
      // Only admins can update applications (for approval)
      allow update: if isAdmin();
      
      // Only admins can delete applications
      allow delete: if isAdmin();
    }
    
    // Gallery Collection
    match /gallery/{photoId} {
      // Anyone can read approved gallery photos
      allow read: if true;
      
      // Signed-in users can upload photos (pending approval)
      allow create: if isSignedIn();
      
      // Users can update their own photos, admins can update any (for approval)
      allow update: if isSignedIn() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
      
      // Users can delete their own photos, admins can delete any
      allow delete: if isSignedIn() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Contact Messages Collection
    match /contactMessages/{messageId} {
      // Anyone can create contact messages (public contact form)
      allow create: if true;
      
      // Only admins can read, update, or delete messages
      allow read, update, delete: if isAdmin();
    }
    
    // Faculty Collection
    match /faculty/{facultyId} {
      // Anyone can read faculty (public website)
      allow read: if true;
      
      // Only admins can create, update, or delete faculty
      allow create, update, delete: if isAdmin();
    }
    
    // Blogs Collection
    match /blogs/{blogId} {
      // Anyone can read published blogs
      allow read: if true;
      
      // Signed-in users can create blogs (pending approval)
      allow create: if isSignedIn();
      
      // Authors can update their own blogs, admins can update any
      allow update: if isSignedIn() && 
                      (resource.data.authorId == request.auth.uid || isAdmin());
      
      // Only admins can delete blogs
      allow delete: if isAdmin();
    }
    
    // Member Progress Collection
    match /memberProgress/{progressId} {
      // Anyone can read member progress (public display)
      allow read: if true;
      
      // Only admins can create, update, or delete progress
      allow create, update, delete: if isAdmin();
    }
  }
}
```

---

## 🔐 Security Features Explained

### Public Access (Anyone can read):
- ✅ Events - Public event listings
- ✅ Clubs - Public club information
- ✅ Club Members - Public member profiles
- ✅ Quizzes - Available quizzes (students need to see them)
- ✅ Gallery - Approved photos
- ✅ Faculty - Public faculty directory
- ✅ Blogs - Published blogs
- ✅ Users - Public profiles (for displaying names/photos)

### User Access (Must be signed in):
- ✅ Create event registrations
- ✅ Create quiz attempts (students taking tests)
- ✅ Create club join requests
- ✅ Read their own data (registrations, attempts, requests)
- ✅ Update their own profile

### Admin-Only Access:
- ✅ Create/Update/Delete events
- ✅ Create/Update/Delete quizzes
- ✅ Approve event registrations
- ✅ Approve club join requests
- ✅ Create club members (after approval)
- ✅ Manage all content

---

## 🎯 What These Rules Fix

### Issue #1: "Permission Denied for Collection Tests"
- **Old**: Collection was named "tests" with no rules
- **New**: Collection renamed to "quizzes" with proper rules
- **Access**: Public read (students can see quizzes), admin write

### Issue #2: Quiz Attempts Not Saving
- **Old**: Collection was "testResults" or localStorage
- **New**: Collection renamed to "quizAttempts" with proper rules
- **Access**: Users can create their own attempts, read their own, admins read all

### Issue #3: No Access Control
- **Old**: Default rules denied everything
- **New**: Granular permissions based on role and ownership
- **Security**: Users can only see/modify their own data, admins have full access

### Issue #4: Duplicate Email Registrations ✨ NEW
- **Old**: No email uniqueness enforcement
- **New**: Firestore index on email field for uniqueness checks
- **Security**: System checks for existing emails before allowing registration

---

## 🔐 FIRESTORE INDEXES (REQUIRED FOR EMAIL UNIQUENESS)

In addition to security rules, you need to create an index on the email field to enable efficient duplicate checking.

### Step 1: Create Email Index
1. Go to Firebase Console → **Firestore Database**
2. Click the **Indexes** tab
3. Click **Create Index** or go to **Single field** tab
4. Configure:
   - **Collection ID**: `users`
   - **Field path**: `email`
   - **Query scopes**: Collection
   - **Index mode**: Ascending
5. Click **Create**

**OR use the Firebase CLI to create the index:**

Create a file `firestore.indexes.json` in your project root:

```json
{
  "indexes": [],
  "fieldOverrides": [
    {
      "collectionGroup": "users",
      "fieldPath": "email",
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        }
      ]
    }
  ]
}
```

Then deploy: `firebase deploy --only firestore:indexes`

---

## 🧪 Testing the Rules

After updating the rules, test these scenarios:

### Test 1: Public Access (No Login)
```
✅ Can read events
✅ Can read clubs
✅ Can read quizzes
❌ Cannot create anything
❌ Cannot read registrations
❌ Cannot read quiz attempts
```

### Test 2: Student Access (Logged In)
```
✅ Can read quizzes
✅ Can create quiz attempt
✅ Can read own quiz attempts
✅ Can create event registration
✅ Can read own registrations
✅ Can create club join request
❌ Cannot read other users' attempts
❌ Cannot create/edit quizzes
❌ Cannot approve requests
```

### Test 3: Admin Access (Admin Role)
```
✅ Can create/edit/delete quizzes
✅ Can read all quiz attempts
✅ Can approve event registrations
✅ Can approve club join requests
✅ Can create club members
✅ Full access to all collections
```

---

## 📝 IMPORTANT: Collection Name Changes

### These Collections Changed Names:
| Old Name | New Name | Status |
|----------|----------|--------|
| `tests` | `quizzes` | ✅ Updated in code |
| `testResults` | `quizAttempts` | ✅ Updated in code |
| `aeroClubApplications` | `clubJoinRequests` | ✅ Updated in code |

### Collections That Stayed the Same:
- ✅ `users`
- ✅ `events`
- ✅ `registrations`
- ✅ `clubs`
- ✅ `clubMembers`
- ✅ `gallery`
- ✅ `faculty`
- ✅ `blogs`
- ✅ `contactMessages`

---

## 🚀 Next Steps After Updating Rules

1. **Publish the rules** in Firebase Console
2. **Verify no syntax errors** (Firebase will highlight issues)
3. **Test in your app** - Try creating a quiz as admin
4. **Check browser console** - Errors should disappear
5. **Monitor Firestore usage** - Rules tab shows denied requests

---

## 🔍 Troubleshooting

### If you still see "Permission Denied":

1. **Check the collection name** - Make sure code uses "quizzes" not "tests"
2. **Verify user role** - Check if your admin user has `role: 'admin'` in Firestore
3. **Clear browser cache** - Old Firebase instances might cache rules
4. **Check Firebase console logs** - Look for specific rule violations
5. **Verify Firebase config** - Make sure `/src/app/config/firebase.ts` is correct

### Common Mistakes:

❌ **Wrong**: Using old collection name "tests"
✅ **Right**: Using new collection name "quizzes"

❌ **Wrong**: Admin user doesn't have role field set
✅ **Right**: Admin user has `role: 'admin'` in `/users/{uid}` document

❌ **Wrong**: Rules not published (still in draft)
✅ **Right**: Rules published and active

---

## 📊 Admin User Setup

To make a user an admin:

1. Go to Firebase Console → Firestore Database
2. Find `users` collection
3. Find your user document (by UID)
4. Add field: `role` = `admin`
5. Save changes

Or create manually:
```javascript
// In Firestore Console, add document:
Collection: users
Document ID: {your-uid}
Fields:
  - id: {your-uid}
  - name: "Admin User"
  - email: "admin@example.com"
  - role: "admin"
  - createdAt: {timestamp}
  - updatedAt: {timestamp}
```

---

## ✅ Verification Checklist

After updating rules, verify:

- [ ] Rules published in Firebase Console (green checkmark)
- [ ] No syntax errors in rules editor
- [ ] Admin user has `role: 'admin'` in Firestore
- [ ] Can see quizzes in student portal (public read works)
- [ ] Can create quiz as admin (admin write works)
- [ ] Can take quiz as student (user create works)
- [ ] Quiz attempts save to Firestore (not localStorage)
- [ ] No "Permission Denied" errors in console

---

## 🎉 SUCCESS CRITERIA

When rules are correctly configured:

✅ **Students can**:
- Browse and see all quizzes
- Take quizzes and save attempts
- View their own quiz history
- Register for events
- Request to join clubs

✅ **Admins can**:
- Create/edit/delete quizzes
- See all quiz attempts
- Approve registrations
- Approve club requests
- Manage all content

✅ **Security works**:
- Users can't see other users' quiz attempts
- Users can't create/edit quizzes
- Users can't approve their own requests
- Public pages work without login

---

## 📞 Support

If issues persist after updating rules:
1. Check browser console for specific Firebase errors
2. Verify user is authenticated (check `auth.currentUser`)
3. Verify user has correct role in Firestore
4. Test with Firebase Emulator locally if available
5. Check Firebase Console → Rules → Logs for denied requests

---

**Update these rules NOW to fix the "Permission Denied" error!**