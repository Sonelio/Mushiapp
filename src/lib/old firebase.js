import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (copy from Firebase Console)
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
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
