# Quick Start Guide - Firebase Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Firebase Console Setup (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **aerotgp-e5700**
3. Enable these services:
   - **Authentication** → Email/Password
   - **Firestore Database** → Create database in production mode
   - **Storage** → Enable with default rules

### Step 2: Create Admin User (1 minute)

**Option A: Through Website**
```
1. Go to login page
2. Click "Register"
3. Fill in details
4. After registration, go to Firebase Console → Firestore → users collection
5. Find your user and change role from "student" to "admin"
```

**Option B: Through Firebase Console**
```
1. Go to Authentication → Users → Add User
2. Email: admin@aerotgp.com
3. Password: [your secure password]
4. Go to Firestore → users collection
5. Add document with:
   - id: [user UID from auth]
   - name: "Admin"
   - email: "admin@aerotgp.com"
   - role: "admin"
```

### Step 3: Apply Security Rules (1 minute)

Copy the security rules from `/FIREBASE_SETUP.md` and paste them into:
- **Firestore Rules** (Firebase Console → Firestore → Rules)
- **Storage Rules** (Firebase Console → Storage → Rules)

### Step 4: Test the Integration (1 minute)

1. Login with your admin account
2. Go to Admin Dashboard
3. Try creating an event
4. Go to "Export Data" tab
5. Try exporting some data

## ✅ You're Done!

The website is now fully connected to Firebase. All features should work:
- ✅ User authentication
- ✅ Event management
- ✅ Blog creation
- ✅ Gallery uploads
- ✅ Data exports

## 📚 Next Steps

- **Read**: `/FIREBASE_SETUP.md` for detailed setup
- **Learn**: `/src/app/docs/FIREBASE_USAGE_GUIDE.md` for code examples
- **Review**: `/FIREBASE_INTEGRATION_SUMMARY.md` for what was implemented

## 🔧 Common Issues

### "Permission Denied" Error
**Solution**: Make sure you've applied the security rules from FIREBASE_SETUP.md

### "User not found" After Login
**Solution**: Check that the user document exists in Firestore with correct structure

### Can't Upload Images
**Solution**: 
1. Check Storage is enabled in Firebase Console
2. Apply storage security rules
3. Verify file is under 5MB and is an image

### Export Not Working
**Solution**: Make sure there's data in the collection you're trying to export

## 🆘 Need Help?

1. Check browser console for error messages
2. Review `/FIREBASE_SETUP.md` troubleshooting section
3. Check Firebase Console logs
4. Verify all services are enabled

## 🎯 Key Files

```
Configuration:
├── /src/app/config/firebase.ts          # Firebase setup

Services:
├── /src/app/services/authService.ts     # Authentication
├── /src/app/services/databaseService.ts # Database operations
├── /src/app/services/storageService.ts  # File uploads
└── /src/app/services/exportService.ts   # Data exports

Context:
└── /src/app/context/AuthContext.tsx     # User authentication state

Admin Tools:
├── /src/app/components/DataExportTab.tsx      # Export interface
└── /src/app/components/DataMigrationTool.tsx  # Migration helper
```

## 💡 Pro Tips

1. **Always test in development first** before going to production
2. **Monitor Firebase usage** in the Console to avoid unexpected costs
3. **Backup data regularly** using the Export feature
4. **Keep security rules updated** as features are added
5. **Use the migration tool** if you have existing localStorage data

---

**Ready to deploy?** Check `/FIREBASE_SETUP.md` Section 5 for deployment checklist!
