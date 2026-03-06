// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
