Build a proper authentication and role-based admin login system for the existing Aeronautical Department website using **Firebase Authentication and Firebase Realtime Database**.

### Authentication Requirements

Use Firebase Email/Password authentication.

Users should be able to:

* Register a new account
* Login using email and password
* Logout securely

After login, fetch the user data from Firebase database.

---

### User Roles

Implement role-based access control.

Each user record in Firebase should include:

```
users
   userID
      name
      email
      role (student | admin)
      profilePhoto
      joinedDate
```

Default role when registering should be:

```
student
```

Admin role must be manually assigned in Firebase database.

---

### Login Logic

When a user logs in:

1. Authenticate using Firebase.
2. Fetch the user document from database.
3. Check the role field.

Logic:

```
If role === "admin"
   redirect to /admin dashboard

If role === "student"
   redirect to /portal dashboard
```

---

### Admin Dashboard Access

Only users with role **admin** should access:

```
/admin
/admin/events
/admin/gallery
/admin/blogs
/admin/clubs
```

Add route protection so students cannot open admin pages even if they manually enter the URL.

If a non-admin tries to access admin routes:

```
Redirect to home page
```

---

### Admin Creation

Add a way to manually create an admin.

Admin account can be created by:

1. Registering normally
2. Changing role in Firebase database to:

```
role: "admin"
```

Example database record:

```
users
   8d72hsh7
      name: Admin
      email: admin@aerotgp
      role: admin
```

---

### User Portal After Login

After login, redirect users to a personal dashboard where they can:

* Edit profile
* View registered events
* Track event approval status
* Manage submitted blogs
* View club membership status

---

### Security

Implement:

* Protected routes
* Firebase auth state persistence
* Form validation
* Error messages for invalid login
* Prevent unauthorized access to admin APIs

---

### UI

Make the login page visually attractive with the existing aerospace theme:

* Dark navy aerospace background
* Glassmorphism login card
* Animated aircraft or airflow particles
* Smooth transitions with Framer Motion

Include:

```
Login
Register
Forgot Password
```

---

### Admin Dashboard

Admin dashboard should allow:

* Manage events
* Approve event registrations
* Manage blogs
* Manage gallery
* Manage clubs
* View analytics

Admin interface must be **simple and easy for non-technical users**.

