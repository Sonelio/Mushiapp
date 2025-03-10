// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ← Ensure Firestore is imported
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDr1A4mCQFmmY-_3CbcNOaqxTg1XyFxLvA",
  authDomain: "mushi-a9949.firebaseapp.com",
  projectId: "mushi-a9949",
  storageBucket: "mushi-a9949.firebasestorage.app",
  messagingSenderId: "970701679657",
  appId: "1:970701679657:web:599e10dfc39115f70ec038",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // ← Add this line to enable Firestore

export { auth, googleProvider, db }; // ← Export Firestore `db`
export const storage = getStorage(app);