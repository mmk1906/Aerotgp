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
    where('isActive', '==', true),
    orderBy('isFeatured', 'desc'),
    orderBy('joinedDate', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubMember));
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
  const membersRef = collection(db, 'clubMembers');
  const q = query(
    membersRef,
    where('userId', '==', userId),
    where('clubId', '==', clubId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
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
    where('status', '==', 'pending'),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubJoinRequest));
};

export const getUserJoinRequests = async (userId: string): Promise<ClubJoinRequest[]> => {
  const requestsRef = collection(db, 'clubJoinRequests');
  const q = query(
    requestsRef,
    where('userId', '==', userId),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubJoinRequest));
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

  // Create join request
  const requestsRef = collection(db, 'clubJoinRequests');
  const request: Omit<ClubJoinRequest, 'id'> = {
    clubId,
    clubName: club.name,
    userId,
    userName: userProfile.name,
    userEmail: userProfile.email,
    userPhone: userProfile.phone,
    userDepartment: userProfile.department,
    userYear: userProfile.year,
    reason,
    status: 'pending',
    submittedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(requestsRef, request);
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
  const newMember: Omit<ClubMember, 'id'> = {
    clubId: request.clubId,
    clubName: request.clubName,
    userId: request.userId,
    userName: request.userName,
    userEmail: request.userEmail,
    userPhone: request.userPhone,
    userDepartment: request.userDepartment,
    userYear: request.userYear,
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
  batch.set(newMemberRef, newMember);

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
