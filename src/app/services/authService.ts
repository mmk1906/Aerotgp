// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

// Check if email already exists in database
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error: any) {
    console.error('Error checking email existence:', error);
    // If there's an error checking, assume email doesn't exist to allow registration attempt
    return false;
  }
};

// Register new user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    // STEP 1: Check if email already exists in Firestore
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // STEP 2: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // STEP 3: Update display name
    await updateProfile(user, { displayName: name });

    // STEP 4: Create user profile in Firestore
    const userProfile: UserProfile = {
      id: user.uid,
      name,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      role: 'student', // Default role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    // Handle specific error cases
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      throw new Error('This email is already registered. Please log in instead.');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please log in instead.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format. Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    } else {
      throw new Error(error.message || 'Failed to register user. Please try again.');
    }
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
    // Validate userId
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided to getUserProfile:', userId);
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data
      } as UserProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    // Don't throw, just return null to prevent cascade errors
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    // Filter out undefined values to prevent Firestore errors
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...filteredData,
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

// Change user password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('No authenticated user found');
    }

    // Reauthenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update to new password
    await updatePassword(user, newPassword);
  } catch (error: any) {
    console.error('Error changing password:', error);
    
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('New password is too weak. Please use at least 6 characters.');
    } else {
      throw new Error(error.message || 'Failed to change password');
    }
  }
};