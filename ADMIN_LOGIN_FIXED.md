# Admin Login Setup Guide

## ✅ Admin Login Bug Fixed!

The admin login system has been fixed with proper role-based authentication and routing.

---

## 🔧 What Was Fixed

### 1. **Login Redirect Logic**
- ✅ Fixed the redirect to use actual user state instead of localStorage
- ✅ Added `useEffect` to handle redirect when user state updates
- ✅ Admins now redirect to `/admin`
- ✅ Students redirect to `/portal`

### 2. **Route Protection**
- ✅ Created `ProtectedRoute` component
- ✅ Admin routes now require `role: "admin"`
- ✅ Student portal routes require authentication
- ✅ Non-admin users redirected to home if they try to access `/admin`

### 3. **Authentication Flow**
```
User Login → Firebase Auth → Fetch User Profile → Check Role → Redirect
```

---

## 🚀 How It Works Now

### Student Login Flow
1. User registers (default role: `student`)
2. Login with email/password
3. ✅ Redirect to `/portal` (Student Dashboard)

### Admin Login Flow
1. User registers normally
2. **Manually change role to `admin` in Firebase** (see below)
3. Login with email/password
4. ✅ Redirect to `/admin` (Admin Dashboard)

---

## 🔑 How to Create an Admin Account

### Step 1: Register a Normal Account
1. Go to `/login`
2. Click "Register" tab
3. Fill in details:
   - Name: `Admin User`
   - Email: `admin@aerotgp.com`
   - Password: `admin123` (or any password)
4. Click "Register"

### Step 2: Change Role to Admin in Firebase

#### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Firestore Database" in left menu
4. Navigate to `users` collection
5. Find the user document you just created
6. Click on the document
7. Find the `role` field
8. Click the edit icon (pencil)
9. Change value from `student` to `admin`
10. Click "Update"

#### Option B: Using Firebase CLI (Advanced)

If you have Firebase Admin SDK set up:

```javascript
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

async function makeAdmin(userId) {
  await db.collection('users').doc(userId).update({
    role: 'admin',
    updatedAt: new Date().toISOString()
  });
  console.log('User is now admin!');
}

// Replace with actual user ID
makeAdmin('USER_ID_HERE');
```

### Step 3: Login as Admin
1. Go to `/login`
2. Enter admin email and password
3. ✅ You'll be redirected to `/admin` dashboard

---

## 🛡️ Security Features

### Protected Routes
```typescript
// Admin Dashboard - Only accessible by admins
/admin → Requires role: "admin"

// Student Portal - Requires authentication
/portal → Requires any authenticated user

// Public Routes - No authentication needed
/, /about, /events, /blogs, etc.
```

### Route Protection Logic
```typescript
if (!user) {
  redirect to /login
}

if (requireAdmin && user.role !== 'admin') {
  redirect to home page
}
```

---

## 📊 User Roles in Firebase

### Database Structure
```javascript
users (collection)
  └── userId (document)
      ├── id: "userId"
      ├── name: "User Name"
      ├── email: "user@example.com"
      ├── role: "student" | "admin"  // ⭐ This determines access
      ├── phone: "optional"
      ├── department: "optional"
      ├── year: "optional"
      ├── prn: "optional"
      ├── profilePhoto: "optional"
      ├── createdAt: "timestamp"
      └── updatedAt: "timestamp"
```

### Default Values
- **New Users**: `role: "student"` (default)
- **Admin Users**: `role: "admin"` (manually set)

---

## 🧪 Testing the Fix

### Test 1: Student Login
```bash
1. Register new account
2. Login with credentials
3. ✅ Should redirect to /portal
4. Try visiting /admin
5. ✅ Should redirect to home page
```

### Test 2: Admin Login
```bash
1. Create account
2. Change role to "admin" in Firebase
3. Login with credentials
4. ✅ Should redirect to /admin
5. Admin dashboard should load
```

### Test 3: Route Protection
```bash
1. Logout
2. Try visiting /portal
3. ✅ Should redirect to /login
4. Try visiting /admin
5. ✅ Should redirect to /login
```

---

## 🎯 Quick Admin Setup (For Testing)

### Create Test Admin Account

1. **Register**:
   - Email: `admin@test.com`
   - Password: `admin123`
   - Name: `Test Admin`

2. **Update in Firebase**:
   ```
   Firestore → users → [your-user-id] → role: "admin"
   ```

3. **Login**:
   - Use the same credentials
   - ✅ You're now an admin!

---

## 🔧 Files Changed

### Core Files Updated
- ✅ `/src/app/pages/Login.tsx` - Fixed redirect logic
- ✅ `/src/app/components/ProtectedRoute.tsx` - New route protection
- ✅ `/src/app/pages/AdminDashboardProtected.tsx` - Admin wrapper
- ✅ `/src/app/components/ProtectedPortalLayout.tsx` - Portal wrapper
- ✅ `/src/app/routes.tsx` - Updated with protected routes

### Authentication Files (Already Working)
- ✅ `/src/app/context/AuthContext.tsx` - Auth state management
- ✅ `/src/app/services/authService.ts` - Firebase integration
- ✅ `/src/app/config/firebase.ts` - Firebase config

---

## 🐛 Common Issues & Solutions

### Issue 1: "Still redirecting to wrong page"
**Solution**: Clear browser cache and localStorage
```javascript
// Run in browser console
localStorage.clear();
// Then refresh page
```

### Issue 2: "Cannot access admin dashboard"
**Solution**: Verify role in Firebase
1. Check Firestore database
2. Ensure `role` field is exactly `"admin"` (not "Admin" or "ADMIN")

### Issue 3: "Login successful but no redirect"
**Solution**: Check browser console for errors
- Look for Firebase configuration errors
- Verify internet connection

---

## ✅ Verification Checklist

Before going to production:

- [ ] Firebase project is configured
- [ ] Firestore database is created
- [ ] Environment variables are set
- [ ] At least one admin account exists
- [ ] Test student login → redirects to `/portal`
- [ ] Test admin login → redirects to `/admin`
- [ ] Test route protection works
- [ ] Test logout works correctly

---

## 🎉 Summary

Your admin login system now:
- ✅ Properly fetches user role from Firebase
- ✅ Redirects based on role (admin vs student)
- ✅ Protects admin routes from non-admin users
- ✅ Protects portal routes from unauthenticated users
- ✅ Uses Firebase Authentication + Firestore
- ✅ Follows security best practices

**The bug is fixed and ready for use!** 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console for errors
2. Verify user role is set correctly
3. Check browser console for JavaScript errors
4. Ensure Firebase credentials are configured

**Happy coding!** ✨
