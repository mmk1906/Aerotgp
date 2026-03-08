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
    if (docId) {
      await setDoc(doc(db, collectionName, docId), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
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
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
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
  duration?: number;
  totalQuestions: number;
  passingScore?: number;
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

export const createMCQTest = (data: MCQTest) => createDocument('tests', data);
export const getMCQTest = (testId: string) => getDocument<MCQTest>('tests', testId);
export const getAllMCQTests = () => getCollection<MCQTest>('tests');
export const updateMCQTest = (testId: string, data: Partial<MCQTest>) => 
  updateDocument('tests', testId, data);
export const deleteMCQTest = (testId: string) => deleteDocument('tests', testId);
export const createMCQTestResult = (data: MCQTestResult) => createDocument('testResults', data);
export const getUserTestResults = (userId: string) => 
  getCollection<MCQTestResult>('testResults', [where('userId', '==', userId)]);

// Faculty operations
export interface Faculty {
  id?: string;
  name: string;
  designation: string;
  role?: 'HOD' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Other'; // Role-based hierarchy
  qualification: string;
  specialization: string;
  email: string;
  phone?: string;
  photo: string;
  department?: string;
  experience?: string;
  researchInterests?: string[];
  publications?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export const createFaculty = (data: Faculty) => createDocument('faculty', data);
export const getFaculty = (facultyId: string) => getDocument<Faculty>('faculty', facultyId);
export const getAllFaculty = () => getCollection<Faculty>('faculty');
export const updateFaculty = (facultyId: string, data: Partial<Faculty>) => 
  updateDocument('faculty', facultyId, data);
export const deleteFaculty = (facultyId: string) => deleteDocument('faculty', facultyId);