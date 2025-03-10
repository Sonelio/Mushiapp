"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth"; // ✅ Ensure correct import

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      setCheckingAuth(true); // Wait for Firebase to load user state
    } else {
      setCheckingAuth(false);
      if (!user) {
        router.push("/auth/login"); // Redirect if no user after loading
      }
    }
  }, [user]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
