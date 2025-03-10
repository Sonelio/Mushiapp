import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDr1A4mCQFmmY-_3CbcNOaqxTg1XyFxLvA",
  authDomain: "mushi-a9949.firebaseapp.com",
  projectId: "mushi-a9949",
  storageBucket: "mushi-a9949.firebasestorage.app",
  messagingSenderId: "970701679657",
  appId: "1:970701679657:web:599e10dfc39115f70ec038"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
