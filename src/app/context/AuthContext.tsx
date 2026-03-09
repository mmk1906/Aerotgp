import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  registerUser as firebaseRegister,
  loginUser as firebaseLogin,
  logoutUser as firebaseLogout,
  getUserProfile,
  updateUserProfile,
  onAuthStateChange,
} from '../services/authService';
import type { UserProfile } from '../services/authService';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  phone?: string;
  department?: string;
  year?: string;
  prn?: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser({
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              role: userProfile.role,
              phone: userProfile.phone,
              department: userProfile.department,
              year: userProfile.year,
              prn: userProfile.prn,
              profilePhoto: userProfile.profilePhoto,
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userProfile = await firebaseLogin(email, password);
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        phone: userProfile.phone,
        department: userProfile.department,
        year: userProfile.year,
        prn: userProfile.prn,
        profilePhoto: userProfile.profilePhoto,
      });
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userProfile = await firebaseRegister(name, email, password);
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        phone: userProfile.phone,
        department: userProfile.department,
        year: userProfile.year,
        prn: userProfile.prn,
        profilePhoto: userProfile.profilePhoto,
      });
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Display user-friendly error message
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      try {
        await updateUserProfile(user.id, userData as Partial<UserProfile>);
        setUser({ ...user, ...userData });
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export AuthContext for debugging purposes
export { AuthContext };