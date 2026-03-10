// Firebase Firestore Database Service
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations
export const createDocument = async <T extends Record<string, any>>(
  collectionName: string,
  data: T,
  docId?: string
): Promise<string> => {
  try {
    // Filter out undefined values to prevent Firebase errors
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    if (docId) {
      await setDoc(doc(db, collectionName, docId), {
        ...cleanData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...cleanData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    }
  } catch (error: any) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to create document');
  }
};

export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to get document');
  }
};

export const updateDocument = async <T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    // Filter out undefined values to prevent Firebase errors
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to update document');
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to delete document');
  }
};

export const getCollection = async <T>(
  collectionName: string,
  constraints?: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error: any) {
    // If it's a permission error, log warning but don't throw
    if (error.code === 'permission-denied') {
      console.warn(`Permission denied for collection ${collectionName}. Returning empty array. Please update Firebase rules.`);
      return [] as T[];
    }
    console.error(`Error getting collection ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to get collection');
  }
};

// Event-specific operations
export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue: string;
  price: number;
  isPaid: boolean;
  maxParticipants: number;
  registrationDeadline: string;
  imageUrl?: string;
  image?: string; // Legacy support
  bannerImage?: string; // Main event banner
  paymentQRImage?: string; // QR code for payment
  coordinatorName?: string;
  coordinatorContact?: string;
  registeredCount?: number;
  category?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  createdAt?: any;
  updatedAt?: any;
}

export const createEvent = (data: Event) => createDocument('events', data);
export const getEvent = (eventId: string) => getDocument<Event>('events', eventId);
export const updateEvent = (eventId: string, data: Partial<Event>) => 
  updateDocument('events', eventId, data);
export const deleteEvent = (eventId: string) => deleteDocument('events', eventId);
export const getAllEvents = () => getCollection<Event>('events');

// Event Registration operations
export interface EventRegistration {
  id?: string;
  userId?: string;
  eventId: string;
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  collegeName: string;
  city: string;
  isInternalStudent: boolean;
  // Team Information (optional)
  teamName?: string;
  numberOfParticipants?: number;
  // Payment Information (for paid events)
  transactionId?: string;
  paymentReceiptUrl?: string;
  // Registration Status
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus?: 'pending' | 'verified' | 'rejected';
  registrationDate?: string;
  // Legacy fields (keep for backward compatibility)
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createEventRegistration = (data: EventRegistration) => 
  createDocument('registrations', data);
export const getEventRegistration = (registrationId: string) => 
  getDocument<EventRegistration>('registrations', registrationId);
export const updateEventRegistration = (registrationId: string, data: Partial<EventRegistration>) => 
  updateDocument('registrations', registrationId, data);
export const getUserRegistrations = (userId: string) => 
  getCollection<EventRegistration>('registrations', [where('userId', '==', userId)]);
export const getEventRegistrations = (eventId: string) => 
  getCollection<EventRegistration>('registrations', [where('eventId', '==', eventId)]);

// Announcements operations
export interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: 'important' | 'event' | 'info' | 'deadline' | 'general';
  pinned: boolean;
  author: string;
  targetAudience?: 'all' | 'students' | 'faculty';
  createdAt?: any;
  updatedAt?: any;
}

export const createAnnouncement = (data: Announcement) => createDocument('announcements', data);
export const getAnnouncement = (announcementId: string) => getDocument<Announcement>('announcements', announcementId);
export const updateAnnouncement = (announcementId: string, data: Partial<Announcement>) => 
  updateDocument('announcements', announcementId, data);
export const deleteAnnouncement = (announcementId: string) => deleteDocument('announcements', announcementId);
export const getAllAnnouncements = () => getCollection<Announcement>('announcements');

// Activity Log operations
export interface ActivityLog {
  id?: string;
  userId: string;
  type: 'event_registration' | 'club_join' | 'quiz_attempt' | 'profile_update' | 'certificate_download';
  action: string;
  details: string;
  metadata?: Record<string, any>;
  createdAt?: any;
}

export const createActivityLog = (data: ActivityLog) => createDocument('activityLogs', data);
export const getUserActivityLogs = (userId: string) => 
  getCollection<ActivityLog>('activityLogs', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  ]);

// Event Certificates operations
export interface EventCertificate {
  id?: string;
  userId: string;
  eventId: string;
  registrationId: string;
  studentName: string;
  eventName: string;
  eventDate: string;
  certificateNumber: string;
  issuedDate: string;
  certificateUrl?: string;
  createdAt?: any;
}

export const createCertificate = (data: EventCertificate) => createDocument('certificates', data);
export const getUserCertificates = (userId: string) => 
  getCollection<EventCertificate>('certificates', [where('userId', '==', userId)]);
export const getCertificateByRegistration = (registrationId: string) => 
  getCollection<EventCertificate>('certificates', [where('registrationId', '==', registrationId)]);

// Gallery operations
export interface GalleryItem {
  id?: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  uploaderEmail: string;
  uploadDate: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Gallery categories
export const GALLERY_CATEGORIES = [
  'Events',
  'Workshops',
  'Projects',
  'Industrial Visits',
  'Aero Club',
  'Campus Activities',
  'Other'
];

export const createGalleryPhoto = (data: GalleryItem) => createDocument('gallery', data);
export const getGalleryPhoto = (photoId: string) => getDocument<GalleryItem>('gallery', photoId);
export const updateGalleryPhoto = (photoId: string, data: Partial<GalleryItem>) => 
  updateDocument('gallery', photoId, data);
export const deleteGalleryPhoto = (photoId: string) => deleteDocument('gallery', photoId);
export const getApprovedGalleryPhotos = () => 
  getCollection<GalleryItem>('gallery', [where('status', '==', 'approved')]);
export const getPendingGalleryPhotos = () => 
  getCollection<GalleryItem>('gallery', [where('status', '==', 'pending')]);

// Contact Messages operations
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read';
  createdAt?: any;
  updatedAt?: any;
}

export const createContactMessage = (data: ContactMessage) => createDocument('contactMessages', data);
export const getContactMessage = (messageId: string) => getDocument<ContactMessage>('contactMessages', messageId);
export const updateContactMessage = (messageId: string, data: Partial<ContactMessage>) => 
  updateDocument('contactMessages', messageId, data);
export const getAllContactMessages = () => getCollection<ContactMessage>('contactMessages');
export const getNewContactMessages = () => 
  getCollection<ContactMessage>('contactMessages', [where('status', '==', 'new')]);

// Club operations
export interface Club {
  id?: string;
  name: string;
  slug: string; // URL-friendly name (e.g., "aero-club")
  description: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  facultyCoordinator?: string;
  establishedYear?: string;
  memberCount?: number;
  achievements?: string[];
  category?: string;
  status?: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
}

export interface ClubProject {
  id?: string;
  clubId: string;
  title: string;
  description: string;
  imageUrl?: string;
  status?: 'ongoing' | 'completed';
  progress?: number;
  teamMembers?: string[];
  startDate?: string;
  endDate?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ClubApplication {
  id?: string;
  clubId: string;
  clubName: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  skills: string;
  experience?: string;
  motivation: string;
  portfolio?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

export const createClub = (data: Club) => createDocument('clubs', data);
export const getClub = (clubId: string) => getDocument<Club>('clubs', clubId);
export const getClubBySlug = async (slug: string): Promise<Club | null> => {
  const clubs = await getCollection<Club>('clubs', [where('slug', '==', slug)]);
  return clubs.length > 0 ? clubs[0] : null;
};
export const updateClub = (clubId: string, data: Partial<Club>) => 
  updateDocument('clubs', clubId, data);
export const deleteClub = (clubId: string) => deleteDocument('clubs', clubId);
export const getAllClubs = () => getCollection<Club>('clubs');
export const getActiveClubs = () => 
  getCollection<Club>('clubs', [where('status', '==', 'active')]);

export const createClubProject = (data: ClubProject) => createDocument('clubProjects', data);
export const getClubProjects = (clubId: string) => 
  getCollection<ClubProject>('clubProjects', [where('clubId', '==', clubId)]);
export const updateClubProject = (projectId: string, data: Partial<ClubProject>) => 
  updateDocument('clubProjects', projectId, data);
export const deleteClubProject = (projectId: string) => deleteDocument('clubProjects', projectId);

export const createClubApplication = (data: ClubApplication) => 
  createDocument('clubApplications', data);
export const getClubApplications = (clubId?: string) => 
  clubId 
    ? getCollection<ClubApplication>('clubApplications', [where('clubId', '==', clubId)])
    : getCollection<ClubApplication>('clubApplications');
export const updateClubApplication = (applicationId: string, data: Partial<ClubApplication>) => 
  updateDocument('clubApplications', applicationId, data);

export interface ClubMember {
  id?: string;
  clubId: string;
  clubName?: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  photo?: string;
  department?: string;
  year?: string;
  role: 'Member' | 'Core Member' | 'Lead' | 'Coordinator' | 'President' | 'Vice President';
  contribution?: string; // Short description of what they do
  joinedDate: string;
  status: 'active' | 'inactive';
  isFeatured?: boolean; // For highlighting member of the month
  createdAt?: any;
  updatedAt?: any;
}

export interface MemberProgress {
  id?: string;
  clubId: string;
  memberId: string;
  userId: string;
  userName: string;
  projectsCompleted: number;
  tasksContributed: number;
  achievements: string[]; // Array of achievement descriptions
  eventsParticipated: string[]; // Array of event names
  skillsDeveloped: string[]; // Array of skills
  progressDescription?: string;
  lastUpdated?: any;
  createdAt?: any;
  updatedAt?: any;
}

export const createClubMember = (data: ClubMember) => createDocument('clubMembers', data);
export const getClubMember = (memberId: string) => getDocument<ClubMember>('clubMembers', memberId);
export const getClubMembers = (clubId: string) => 
  getCollection<ClubMember>('clubMembers', [where('clubId', '==', clubId)]);
export const getUserClubMemberships = (userId: string) =>
  getCollection<ClubMember>('clubMembers', [where('userId', '==', userId)]);
export const updateClubMember = (memberId: string, data: Partial<ClubMember>) => 
  updateDocument('clubMembers', memberId, data);
export const deleteClubMember = (memberId: string) => deleteDocument('clubMembers', memberId);
export const getActiveClubMembers = () => 
  getCollection<ClubMember>('clubMembers', [where('status', '==', 'active')]);
export const getFeaturedClubMembers = (clubId: string) =>
  getCollection<ClubMember>('clubMembers', [
    where('clubId', '==', clubId),
    where('isFeatured', '==', true)
  ]);

export const createMemberProgress = (data: MemberProgress) => createDocument('memberProgress', data);
export const getMemberProgress = (progressId: string) => getDocument<MemberProgress>('memberProgress', progressId);
export const getMemberProgressByUser = (userId: string, clubId: string) =>
  getCollection<MemberProgress>('memberProgress', [
    where('userId', '==', userId),
    where('clubId', '==', clubId)
  ]);
export const updateMemberProgress = (progressId: string, data: Partial<MemberProgress>) =>
  updateDocument('memberProgress', progressId, data);
export const getClubMemberProgress = (clubId: string) =>
  getCollection<MemberProgress>('memberProgress', [where('clubId', '==', clubId)]);

// MCQ Test operations
export interface MCQTest {
  id?: string;
  subject: string;
  title: string;
  description?: string;
  duration?: number; // Also acts as timeLimit (in minutes)
  timeLimit?: number; // Alias for duration (in minutes)
  totalQuestions: number;
  passingScore?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  allowMultipleAttempts?: boolean;
  questions: any[];
  createdAt?: any;
  updatedAt?: any;
}

export interface MCQTestResult {
  id?: string;
  userId: string;
  userName: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken?: number;
  passed?: boolean;
  answers?: any[];
  createdAt?: any;
}

export const createMCQTest = (data: MCQTest) => createDocument('quizzes', data);
export const getMCQTest = (testId: string) => getDocument<MCQTest>('quizzes', testId);
export const getAllMCQTests = () => getCollection<MCQTest>('quizzes');
export const updateMCQTest = (testId: string, data: Partial<MCQTest>) => 
  updateDocument('quizzes', testId, data);
export const deleteMCQTest = (testId: string) => deleteDocument('quizzes', testId);
export const createMCQTestResult = (data: MCQTestResult) => createDocument('quizAttempts', data);
export const getUserTestResults = (userId: string) => 
  getCollection<MCQTestResult>('quizAttempts', [where('userId', '==', userId)]);

// Faculty operations
export interface Faculty {
  id?: string;
  name: string;
  designation: string;
  role?: 'HOD' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Non-Teaching Staff' | 'Jr. Clerk' | 'Other'; // Role-based hierarchy
  qualification: string;
  specialization: string;
  email: string;
  phone?: string;
  photo: string;
  department?: string;
  experience?: string;
  researchInterests?: string[];
  publications?: string[];
  isTeachingStaff?: boolean; // true for teaching faculty, false for non-teaching
  createdAt?: any;
  updatedAt?: any;
}

export const createFaculty = (data: Faculty) => createDocument('faculty', data);
export const getFaculty = (facultyId: string) => getDocument<Faculty>('faculty', facultyId);
export const getAllFaculty = () => getCollection<Faculty>('faculty');
export const updateFaculty = (facultyId: string, data: Partial<Faculty>) => 
  updateDocument('faculty', facultyId, data);
export const deleteFaculty = (facultyId: string) => deleteDocument('faculty', facultyId);