"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Adjust path

// A simple context storing user & loading state
const AuthContext = createContext({
  user: null,
  loading: true,
});

// The AuthProvider wraps your application
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Listen to Firebase Auth
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If logged in, also listen for Firestore doc changes in /users/{uid}
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            // Merge the firebaseUser object with Firestore doc data
            setAuthState({
              user: { ...firebaseUser, ...docSnap.data() },
              loading: false,
            });
          } else {
            // If no doc found, just store firebaseUser
            setAuthState({ user: firebaseUser, loading: false });
          }
        });
        return () => unsubscribeUser();
      } else {
        // Not logged in => reset to null
        setAuthState({ user: null, loading: false });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Provide { user, loading } to the rest of the app
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth() hook reads the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
