"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Correct import path

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
    let unsubscribeUser = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const setupFirestoreListener = (firebaseUser, attempt = 0) => {
      if (attempt >= MAX_RETRIES) {
        console.error("Max retries reached for Firestore listener");
        setAuthState({ user: firebaseUser, loading: false });
        return null;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        return onSnapshot(
          userRef,
          {
            next: (docSnap) => {
              if (docSnap.exists()) {
                const userData = docSnap.data();
                setAuthState({
                  user: { ...firebaseUser, ...userData },
                  loading: false,
                });
              } else {
                setAuthState({ user: firebaseUser, loading: false });
              }
            },
            error: (error) => {
              console.error("Firestore listener error:", error);
              // Clear the current listener
              if (unsubscribeUser) {
                unsubscribeUser();
                unsubscribeUser = null;
              }
              
              // Retry after delay
              setTimeout(() => {
                unsubscribeUser = setupFirestoreListener(firebaseUser, attempt + 1);
              }, RETRY_DELAY);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        return null;
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Clear any existing Firestore listener
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = null;
        }

        // Set up new Firestore listener
        unsubscribeUser = setupFirestoreListener(firebaseUser);
      } else {
        // Not logged in
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = null;
        }
        setAuthState({ user: null, loading: false });
      }
    });

    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
      unsubscribeAuth();
    };
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
  const context = useContext(AuthContext);
  console.log("useAuth hook called, current state:", context);
  return context;
}
