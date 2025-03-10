"use client";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return { user, logout: () => signOut(auth) };
}
