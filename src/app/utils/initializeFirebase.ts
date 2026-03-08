// Firebase Initialization and Setup Utility
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { mockEvents, mockRegistrations } from '../data/mockData';
import { mockQuizzes } from '../data/quizData';
import { blogPosts } from '../data/blogData';
import { clubMembers, clubProjects } from '../data/clubData';

/**
 * Initialize Firebase Firestore with mock data
 * This should only be run once to populate the database with initial data
 */
export const initializeFirestoreData = async () => {
  try {
    console.log('Starting Firebase initialization...');

    // Check if data already exists
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (!usersSnapshot.empty) {
      console.log('Database already initialized. Skipping...');
      return;
    }

    // Create admin user
    await setDoc(doc(db, 'users', 'admin-user-id'), {
      id: 'admin-user-id',
      name: 'Admin User',
      email: 'admin@aerotgp.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Initialize Events
    console.log('Initializing events...');
    for (const event of mockEvents) {
      await setDoc(doc(db, 'events', event.id), {
        ...event,
        imageUrl: event.image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Initialize Event Registrations
    console.log('Initializing registrations...');
    for (const registration of mockRegistrations) {
      await setDoc(doc(db, 'registrations', registration.id), {
        id: registration.id,
        userId: registration.studentId || registration.id,
        userName: registration.studentName,
        userEmail: registration.studentEmail,
        eventId: registration.eventId,
        status: registration.approvalStatus,
        paymentStatus: registration.paymentStatus,
        createdAt: new Date(registration.timestamp).toISOString(),
        updatedAt: new Date(registration.timestamp).toISOString(),
      });
    }

    // Initialize MCQ Tests
    console.log('Initializing MCQ tests...');
    for (const quiz of mockQuizzes) {
      await setDoc(doc(db, 'quizzes', quiz.id), {
        id: quiz.id,
        subject: quiz.subject,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.timeLimit,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
        questions: quiz.questions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Initialize Blogs
    console.log('Initializing blogs...');
    for (const blog of blogPosts) {
      await setDoc(doc(db, 'blogs', blog.id), {
        id: blog.id,
        title: blog.title,
        authorId: 'student-user-id',
        authorName: blog.author,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags,
        status: blog.status,
        imageUrl: blog.image,
        likes: blog.likes,
        views: blog.views,
        createdAt: blog.date,
        updatedAt: blog.date,
      });
    }

    // Initialize Club Members
    console.log('Initializing club members...');
    for (const member of clubMembers) {
      await setDoc(doc(db, 'clubMembers', member.id), {
        ...member,
        userId: member.id,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log('Firebase initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

/**
 * Create a sample admin user in Firebase Auth
 * Note: This requires Firebase Admin SDK or manual creation in Firebase Console
 */
export const createAdminUser = async () => {
  console.log('Please create an admin user manually in Firebase Console:');
  console.log('1. Go to Firebase Console > Authentication > Users');
  console.log('2. Add a new user with email: admin@aerotgp.com');
  console.log('3. After creation, go to Firestore Database');
  console.log('4. Find the user document and set role: "admin"');
};

/**
 * Clear all data from Firestore (use with caution!)
 */
export const clearFirestoreData = async () => {
  const collections = [
    'users',
    'events',
    'registrations',
    'quizzes',
    'quizAttempts',
    'blogs',
    'clubMembers',
    'gallery',
  ];

  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  console.log('All Firestore data cleared!');
};