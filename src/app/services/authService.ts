// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  year?: string;
  prn?: string;
  role: 'student' | 'admin';
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Register new user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: user.uid,
      name,
      email,
      role: 'student', // Default role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.message || 'Failed to register user');
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userProfile = await getUserProfile(user.uid);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    return userProfile;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw new Error(error.message || 'Failed to get user profile');
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message || 'Failed to update user profile');
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is admin
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
