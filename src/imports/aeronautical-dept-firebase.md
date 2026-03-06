Update the existing Aeronautical Engineering Department website to connect the frontend with Firebase for backend services, authentication, database, and file storage.

The project will use Firebase as the primary backend and database solution.

1. Firebase Integration

Use the following Firebase SDK configuration to initialize the project.

// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMpgXtLHK_EUoFtD4_lqVRM3nrrEsFp4U",
  authDomain: "aerotgp-e5700.firebaseapp.com",
  databaseURL: "https://aerotgp-e5700-default-rtdb.firebaseio.com",
  projectId: "aerotgp-e5700",
  storageBucket: "aerotgp-e5700.firebasestorage.app",
  messagingSenderId: "618600718505",
  appId: "1:618600718505:web:7770090d3d8046e8c849b8",
  measurementId: "G-48XELLPLLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

Ensure Firebase services are used for:

Authentication

Database storage

File uploads

Analytics

2. Firebase Services to Use

Use these Firebase modules:

Authentication

User login and registration

Email/password authentication

Role management (Student / Admin)

Realtime Database or Firestore

Store structured website data

Firebase Storage

Store images for:

Photo gallery

Blog cover images

Club project photos

Profile pictures

3. Data Storage Structure

Design the database collections or nodes for the website.

Users

users
  userId
    name
    email
    phone
    department
    year
    role
    profilePhoto

Events

events
  eventId
    title
    description
    date
    venue
    price
    isPaid
    maxParticipants
    registrationDeadline

Event Registrations

registrations
  registrationId
    userId
    eventId
    status
    paymentStatus
    timestamp

Blogs

blogs
  blogId
    title
    authorId
    content
    category
    status
    createdAt

Clubs

clubs
  clubId
    name
    description

Gallery

gallery
  photoId
    imageUrl
    caption
    category
    uploadedBy

MCQ Tests

tests
  testId
    subject
    questions
    correctAnswers
4. Firebase Authentication

Authentication should be handled completely by Firebase.

Features required:

User Registration
User Login
Password Reset
Session persistence
Role-based access (Admin / Student)

Admin accounts should be stored with role:

role: "admin"
5. Spreadsheet / Excel Export System

Create a system where important website data can be exported as Excel or spreadsheet files.

Admin should be able to export:

Event registrations
User list
Club members
Blog submissions

Export format should include:

Name
Email
Phone
Department
Event Registered
Registration Status
Payment Status

The exported file should be downloadable as:

CSV
or
Excel (.xlsx)
6. Admin Dashboard Integration

Admin dashboard should allow:

Viewing Firebase database records
Approving event registrations
Approving blogs
Managing gallery images
Managing users

Admin should also be able to export data into spreadsheets with one click.

7. Security Rules

Implement Firebase security rules so that:

Users can only edit their own data
Admins can manage all data
Unauthorized users cannot access database records

8. Performance

Ensure:

Fast data fetching
Optimized Firebase queries
Proper error handling
Secure API usage