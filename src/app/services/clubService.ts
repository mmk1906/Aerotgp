/**
 * Club Service - Clean API for all club operations
 * This service handles clubs, members, and join requests with proper synchronization
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================================================
// TYPES
// ============================================================================

export interface Club {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  facultyCoordinator?: string;
  establishedYear?: string;
  category?: string;
  status: 'active' | 'inactive';
  memberCount: number; // Auto-calculated
  featuredCount: number; // Auto-calculated
  createdAt?: any;
  updatedAt?: any;
}

export interface ClubMember {
  id?: string;
  clubId: string;
  clubName: string;
  userId: string;
  // User snapshot
  userName: string;
  userEmail: string;
  userPhone?: string;
  userPhoto?: string;
  userDepartment?: string;
  userYear?: string;
  // Club-specific
  role: 'Member' | 'Core Member' | 'Lead' | 'Co-Lead' | 'Secretary' | 'Treasurer';
  contribution?: string;
  isFeatured: boolean;
  isActive: boolean;
  // Workflow
  joinedDate: any;
  approvedBy?: string;
  approvedAt?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface ClubJoinRequest {
  id?: string;
  clubId: string;
  clubName: string;
  userId: string;
  // User snapshot
  userName: string;
  userEmail: string;
  userPhone?: string;
  userPhoto?: string;
  userDepartment?: string;
  userYear?: string;
  // Request details
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  // Workflow
  submittedAt: any;
  reviewedBy?: string;
  reviewedAt?: any;
  rejectionReason?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ClubProject {
  id?: string;
  clubId: string;
  clubName?: string;
  title: string;
  description: string;
  startDate: any;
  endDate?: any;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  teamSize?: number;
  technologies?: string[];
  imageUrl?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MemberProgress {
  id?: string;
  userId: string;
  clubId: string;
  userName?: string;
  clubName?: string;
  projectsCompleted: number;
  tasksCompleted: number;
  hoursContributed: number;
  skillsLearned: string[];
  achievements: string[];
  lastActivityDate?: any;
  createdAt?: any;
  updatedAt?: any;
}

// ============================================================================
// CLUBS CRUD
// ============================================================================

export const getAllClubs = async (): Promise<Club[]> => {
  const clubsRef = collection(db, 'clubs');
  const snapshot = await getDocs(clubsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
};

export const getActiveClubs = async (): Promise<Club[]> => {
  const clubsRef = collection(db, 'clubs');
  const q = query(clubsRef, where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
};

export const getClubById = async (clubId: string): Promise<Club | null> => {
  const clubRef = doc(db, 'clubs', clubId);
  const clubSnap = await getDoc(clubRef);
  return clubSnap.exists() ? { id: clubSnap.id, ...clubSnap.data() } as Club : null;
};

export const getClubBySlug = async (slug: string): Promise<Club | null> => {
  const clubsRef = collection(db, 'clubs');
  const q = query(clubsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Club;
};

export const createClub = async (data: Omit<Club, 'id' | 'memberCount' | 'featuredCount'>): Promise<string> => {
  const clubsRef = collection(db, 'clubs');
  const newClub = {
    ...data,
    memberCount: 0,
    featuredCount: 0,
    status: data.status || 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(clubsRef, newClub);
  return docRef.id;
};

export const updateClub = async (clubId: string, data: Partial<Club>): Promise<void> => {
  const clubRef = doc(db, 'clubs', clubId);
  await updateDoc(clubRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteClub = async (clubId: string): Promise<void> => {
  // In a transaction, also delete all related data
  const batch = writeBatch(db);
  
  // Delete club
  const clubRef = doc(db, 'clubs', clubId);
  batch.delete(clubRef);

  // Delete all members
  const membersRef = collection(db, 'clubMembers');
  const membersQuery = query(membersRef, where('clubId', '==', clubId));
  const membersSnap = await getDocs(membersQuery);
  membersSnap.docs.forEach(doc => batch.delete(doc.ref));

  // Delete all join requests
  const requestsRef = collection(db, 'clubJoinRequests');
  const requestsQuery = query(requestsRef, where('clubId', '==', clubId));
  const requestsSnap = await getDocs(requestsQuery);
  requestsSnap.docs.forEach(doc => batch.delete(doc.ref));

  await batch.commit();
};

// ============================================================================
// CLUB MEMBERS
// ============================================================================

export const getClubMembers = async (clubId: string): Promise<ClubMember[]> => {
  const membersRef = collection(db, 'clubMembers');
  const q = query(
    membersRef,
    where('clubId', '==', clubId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubMember));
  
  // Sort in JavaScript to avoid requiring a composite index
  return members.sort((a, b) => {
    // First sort by isFeatured (featured first)
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    // Then by joinedDate (newest first)
    const dateA = a.joinedDate?.seconds || 0;
    const dateB = b.joinedDate?.seconds || 0;
    return dateB - dateA;
  });
};

export const getFeaturedMembers = async (clubId: string): Promise<ClubMember[]> => {
  const membersRef = collection(db, 'clubMembers');
  const q = query(
    membersRef,
    where('clubId', '==', clubId),
    where('isActive', '==', true),
    where('isFeatured', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubMember));
};

export const getUserClubMemberships = async (userId: string): Promise<ClubMember[]> => {
  const membersRef = collection(db, 'clubMembers');
  const q = query(
    membersRef,
    where('userId', '==', userId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubMember));
};

export const isUserClubMember = async (userId: string, clubId: string): Promise<boolean> => {
  try {
    // Validate inputs
    if (!userId || !clubId) {
      console.warn('isUserClubMember: Invalid userId or clubId', { userId, clubId });
      return false;
    }

    const membersRef = collection(db, 'clubMembers');
    const q = query(
      membersRef,
      where('userId', '==', userId),
      where('clubId', '==', clubId),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking club membership:', error);
    return false;
  }
};

export const updateMemberRole = async (memberId: string, role: ClubMember['role']): Promise<void> => {
  const memberRef = doc(db, 'clubMembers', memberId);
  await updateDoc(memberRef, {
    role,
    updatedAt: Timestamp.now(),
  });
};

export const updateMemberContribution = async (memberId: string, contribution: string): Promise<void> => {
  const memberRef = doc(db, 'clubMembers', memberId);
  await updateDoc(memberRef, {
    contribution,
    updatedAt: Timestamp.now(),
  });
};

export const toggleFeaturedMember = async (memberId: string): Promise<void> => {
  const memberRef = doc(db, 'clubMembers', memberId);
  const memberSnap = await getDoc(memberRef);
  
  if (!memberSnap.exists()) {
    throw new Error('Member not found');
  }

  const member = memberSnap.data() as ClubMember;
  const newFeaturedStatus = !member.isFeatured;

  // Use batch to update member and club count
  const batch = writeBatch(db);
  
  batch.update(memberRef, {
    isFeatured: newFeaturedStatus,
    updatedAt: Timestamp.now(),
  });

  const clubRef = doc(db, 'clubs', member.clubId);
  batch.update(clubRef, {
    featuredCount: increment(newFeaturedStatus ? 1 : -1),
    updatedAt: Timestamp.now(),
  });

  await batch.commit();
};

export const removeMember = async (memberId: string): Promise<void> => {
  const memberRef = doc(db, 'clubMembers', memberId);
  const memberSnap = await getDoc(memberRef);
  
  if (!memberSnap.exists()) {
    throw new Error('Member not found');
  }

  const member = memberSnap.data() as ClubMember;

  // Use batch to update member status and club counts
  const batch = writeBatch(db);
  
  batch.update(memberRef, {
    isActive: false,
    updatedAt: Timestamp.now(),
  });

  const clubRef = doc(db, 'clubs', member.clubId);
  batch.update(clubRef, {
    memberCount: increment(-1),
    featuredCount: increment(member.isFeatured ? -1 : 0),
    updatedAt: Timestamp.now(),
  });

  await batch.commit();
};

// ============================================================================
// JOIN REQUESTS
// ============================================================================

export const getAllJoinRequests = async (): Promise<ClubJoinRequest[]> => {
  const requestsRef = collection(db, 'clubJoinRequests');
  const q = query(requestsRef, orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubJoinRequest));
};

export const getPendingJoinRequests = async (): Promise<ClubJoinRequest[]> => {
  const requestsRef = collection(db, 'clubJoinRequests');
  const q = query(
    requestsRef,
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubJoinRequest));
  
  // Sort in JavaScript to avoid requiring a composite index
  return requests.sort((a, b) => {
    const aTime = a.submittedAt?.seconds || 0;
    const bTime = b.submittedAt?.seconds || 0;
    return bTime - aTime; // descending order (newest first)
  });
};

export const getUserJoinRequests = async (userId: string): Promise<ClubJoinRequest[]> => {
  // Validate userId to prevent Firestore errors
  if (!userId || typeof userId !== 'string') {
    console.warn('Invalid userId provided to getUserJoinRequests');
    return [];
  }

  try {
    const requestsRef = collection(db, 'clubJoinRequests');
    // Simple query without orderBy to avoid index requirement
    const q = query(
      requestsRef,
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    // Sort in memory instead of using Firestore orderBy
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubJoinRequest));
    return requests.sort((a, b) => {
      const aTime = a.submittedAt?.seconds || 0;
      const bTime = b.submittedAt?.seconds || 0;
      return bTime - aTime; // Descending order (newest first)
    });
  } catch (error) {
    console.error('Error fetching user join requests:', error);
    return [];
  }
};

export const hasUserSentJoinRequest = async (userId: string, clubId: string): Promise<boolean> => {
  const requestsRef = collection(db, 'clubJoinRequests');
  const q = query(
    requestsRef,
    where('userId', '==', userId),
    where('clubId', '==', clubId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const canUserJoinClub = async (userId: string, clubId: string): Promise<{ 
  canJoin: boolean; 
  reason?: string 
}> => {
  // Check if already a member
  const isMember = await isUserClubMember(userId, clubId);
  if (isMember) {
    return { canJoin: false, reason: 'Already a member of this club' };
  }

  // Check if has pending request
  const hasPendingRequest = await hasUserSentJoinRequest(userId, clubId);
  if (hasPendingRequest) {
    return { canJoin: false, reason: 'You already have a pending join request' };
  }

  return { canJoin: true };
};

export const submitJoinRequest = async (
  clubId: string,
  userId: string,
  userProfile: {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    year?: string;
    profilePhoto?: string;
  },
  reason: string
): Promise<string> => {
  // Check if can join
  const { canJoin, reason: cantJoinReason } = await canUserJoinClub(userId, clubId);
  if (!canJoin) {
    throw new Error(cantJoinReason);
  }

  // Get club details
  const club = await getClubById(clubId);
  if (!club) {
    throw new Error('Club not found');
  }

  // Create join request - filter out undefined values
  const requestsRef = collection(db, 'clubJoinRequests');
  const requestData: any = {
    clubId,
    clubName: club.name,
    userId,
    userName: userProfile.name,
    userEmail: userProfile.email,
    reason,
    status: 'pending',
    submittedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  // Only add optional fields if they have values (not undefined)
  if (userProfile.phone) {
    requestData.userPhone = userProfile.phone;
  }
  if (userProfile.department) {
    requestData.userDepartment = userProfile.department;
  }
  if (userProfile.year) {
    requestData.userYear = userProfile.year;
  }
  if (userProfile.profilePhoto) {
    requestData.userPhoto = userProfile.profilePhoto;
  }

  const docRef = await addDoc(requestsRef, requestData);
  return docRef.id;
};

export const approveJoinRequest = async (
  requestId: string,
  adminId: string
): Promise<void> => {
  const requestRef = doc(db, 'clubJoinRequests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error('Join request not found');
  }

  const request = { id: requestSnap.id, ...requestSnap.data() } as ClubJoinRequest;

  if (request.status !== 'pending') {
    throw new Error('Request has already been reviewed');
  }

  // Use batch for atomic operations
  const batch = writeBatch(db);
  const now = Timestamp.now();

  // 1. Update join request status
  batch.update(requestRef, {
    status: 'approved',
    reviewedBy: adminId,
    reviewedAt: now,
    updatedAt: now,
  });

  // 2. Create club member
  const membersRef = collection(db, 'clubMembers');
  const newMemberRef = doc(membersRef);
  
  // Build member data without undefined values
  const newMemberData: any = {
    clubId: request.clubId,
    clubName: request.clubName,
    userId: request.userId,
    userName: request.userName,
    userEmail: request.userEmail,
    role: 'Member',
    contribution: '',
    isFeatured: false,
    isActive: true,
    joinedDate: now,
    approvedBy: adminId,
    approvedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  
  // Only add optional fields if they exist
  if (request.userPhone) {
    newMemberData.userPhone = request.userPhone;
  }
  if (request.userDepartment) {
    newMemberData.userDepartment = request.userDepartment;
  }
  if (request.userYear) {
    newMemberData.userYear = request.userYear;
  }
  if (request.userPhoto) {
    newMemberData.userPhoto = request.userPhoto;
  }
  
  batch.set(newMemberRef, newMemberData);

  // 3. Increment club member count
  const clubRef = doc(db, 'clubs', request.clubId);
  batch.update(clubRef, {
    memberCount: increment(1),
    updatedAt: now,
  });

  await batch.commit();
};

export const rejectJoinRequest = async (
  requestId: string,
  adminId: string,
  rejectionReason?: string
): Promise<void> => {
  const requestRef = doc(db, 'clubJoinRequests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error('Join request not found');
  }

  const request = requestSnap.data() as ClubJoinRequest;

  if (request.status !== 'pending') {
    throw new Error('Request has already been reviewed');
  }

  await updateDoc(requestRef, {
    status: 'rejected',
    reviewedBy: adminId,
    reviewedAt: Timestamp.now(),
    rejectionReason: rejectionReason || 'Application rejected by admin',
    updatedAt: Timestamp.now(),
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const recalculateClubCounts = async (clubId: string): Promise<void> => {
  // Get all active members
  const members = await getClubMembers(clubId);
  const featuredMembers = members.filter(m => m.isFeatured);

  // Update club counts
  const clubRef = doc(db, 'clubs', clubId);
  await updateDoc(clubRef, {
    memberCount: members.length,
    featuredCount: featuredMembers.length,
    updatedAt: Timestamp.now(),
  });
};

// ============================================================================
// CLUB PROJECTS
// ============================================================================

export const getClubProjects = async (clubId: string): Promise<ClubProject[]> => {
  try {
    const projectsRef = collection(db, 'clubProjects');
    const q = query(projectsRef, where('clubId', '==', clubId));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubProject));
    
    // Sort by startDate in JavaScript to avoid requiring a composite index
    return projects.sort((a, b) => {
      // Handle Firestore Timestamp objects
      let dateA = 0;
      let dateB = 0;
      
      if (a.startDate) {
        if (typeof a.startDate === 'object' && 'seconds' in a.startDate) {
          dateA = a.startDate.seconds * 1000;
        } else if (a.startDate instanceof Date) {
          dateA = a.startDate.getTime();
        } else if (typeof a.startDate === 'string') {
          dateA = new Date(a.startDate).getTime();
        }
      }
      
      if (b.startDate) {
        if (typeof b.startDate === 'object' && 'seconds' in b.startDate) {
          dateB = b.startDate.seconds * 1000;
        } else if (b.startDate instanceof Date) {
          dateB = b.startDate.getTime();
        } else if (typeof b.startDate === 'string') {
          dateB = new Date(b.startDate).getTime();
        }
      }
      
      return dateB - dateA; // descending order (newest first)
    });
  } catch (error) {
    console.error('Error fetching club projects:', error);
    return [];
  }
};

export const createClubProject = async (data: Omit<ClubProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const projectsRef = collection(db, 'clubProjects');
    const projectData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(projectsRef, projectData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating club project:', error);
    throw new Error('Failed to create club project');
  }
};

export const updateClubProject = async (projectId: string, data: Partial<ClubProject>): Promise<void> => {
  try {
    const projectRef = doc(db, 'clubProjects', projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating club project:', error);
    throw new Error('Failed to update club project');
  }
};

export const deleteClubProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'clubProjects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting club project:', error);
    throw new Error('Failed to delete club project');
  }
};

// ============================================================================
// MEMBER PROGRESS
// ============================================================================

export const getMemberProgressByUser = async (userId: string, clubId: string): Promise<MemberProgress[]> => {
  try {
    const progressRef = collection(db, 'memberProgress');
    const q = query(
      progressRef, 
      where('userId', '==', userId),
      where('clubId', '==', clubId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberProgress));
  } catch (error) {
    console.error('Error fetching member progress:', error);
    return [];
  }
};

export const createMemberProgress = async (data: Omit<MemberProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const progressRef = collection(db, 'memberProgress');
    const progressData = {
      ...data,
      projectsCompleted: data.projectsCompleted || 0,
      tasksCompleted: data.tasksCompleted || 0,
      hoursContributed: data.hoursContributed || 0,
      skillsLearned: data.skillsLearned || [],
      achievements: data.achievements || [],
      lastActivityDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(progressRef, progressData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating member progress:', error);
    throw new Error('Failed to create member progress');
  }
};

export const updateMemberProgress = async (progressId: string, data: Partial<MemberProgress>): Promise<void> => {
  try {
    const progressRef = doc(db, 'memberProgress', progressId);
    await updateDoc(progressRef, {
      ...data,
      lastActivityDate: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating member progress:', error);
    throw new Error('Failed to update member progress');
  }
};