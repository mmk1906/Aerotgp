// Quiz Service - Firebase-based quiz management
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
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Interfaces
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  timeLimit: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  allowMultipleAttempts: boolean;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  quizTitle: string;
  quizSubject: string;
  userId: string;
  userName: string;
  userEmail: string;
  answers: number[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // in seconds
  completedAt: any;
  createdAt?: any;
}

// Quiz CRUD Operations
export const createQuiz = async (quizData: Quiz): Promise<string> => {
  try {
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      isPublished: quizData.isPublished ?? false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return quizRef.id;
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    throw new Error(error.message || 'Failed to create quiz');
  }
};

export const getQuiz = async (quizId: string): Promise<Quiz | null> => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (quizDoc.exists()) {
      return { id: quizDoc.id, ...quizDoc.data() } as Quiz;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting quiz:', error);
    throw new Error(error.message || 'Failed to get quiz');
  }
};

export const updateQuiz = async (quizId: string, quizData: Partial<Quiz>): Promise<void> => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, {
      ...quizData,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error('Error updating quiz:', error);
    throw new Error(error.message || 'Failed to update quiz');
  }
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
  } catch (error: any) {
    console.error('Error deleting quiz:', error);
    throw new Error(error.message || 'Failed to delete quiz');
  }
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const quizzesSnapshot = await getDocs(
      query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'))
    );
    return quizzesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[];
  } catch (error: any) {
    console.error('Error getting all quizzes:', error);
    throw new Error(error.message || 'Failed to get quizzes');
  }
};

export const getPublishedQuizzes = async (): Promise<Quiz[]> => {
  try {
    const quizzesSnapshot = await getDocs(
      query(
        collection(db, 'quizzes'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      )
    );
    return quizzesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[];
  } catch (error: any) {
    console.error('Error getting published quizzes:', error);
    throw new Error(error.message || 'Failed to get published quizzes');
  }
};

// Quiz Attempt Operations
export const saveQuizAttempt = async (attemptData: QuizAttempt): Promise<string> => {
  try {
    const attemptRef = await addDoc(collection(db, 'quizAttempts'), {
      ...attemptData,
      completedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    return attemptRef.id;
  } catch (error: any) {
    console.error('Error saving quiz attempt:', error);
    throw new Error(error.message || 'Failed to save quiz attempt');
  }
};

export const getUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const attemptsSnapshot = await getDocs(
      query(
        collection(db, 'quizAttempts'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      )
    );
    return attemptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizAttempt[];
  } catch (error: any) {
    console.error('Error getting user quiz attempts:', error);
    throw new Error(error.message || 'Failed to get quiz attempts');
  }
};

export const getAllQuizAttempts = async (): Promise<QuizAttempt[]> => {
  try {
    const attemptsSnapshot = await getDocs(
      query(collection(db, 'quizAttempts'), orderBy('completedAt', 'desc'))
    );
    return attemptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizAttempt[];
  } catch (error: any) {
    console.error('Error getting all quiz attempts:', error);
    throw new Error(error.message || 'Failed to get all quiz attempts');
  }
};

export const getQuizAttempts = async (quizId: string): Promise<QuizAttempt[]> => {
  try {
    const attemptsSnapshot = await getDocs(
      query(
        collection(db, 'quizAttempts'),
        where('quizId', '==', quizId),
        orderBy('completedAt', 'desc')
      )
    );
    return attemptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizAttempt[];
  } catch (error: any) {
    console.error('Error getting quiz attempts:', error);
    throw new Error(error.message || 'Failed to get quiz attempts');
  }
};

// Initialize default quizzes (run once to migrate from mockQuizzes)
export const initializeDefaultQuizzes = async (quizzes: Quiz[]): Promise<void> => {
  try {
    for (const quiz of quizzes) {
      await createQuiz({ ...quiz, isPublished: true });
    }
  } catch (error: any) {
    console.error('Error initializing default quizzes:', error);
    throw new Error(error.message || 'Failed to initialize default quizzes');
  }
};
