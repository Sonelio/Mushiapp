"use client";

import { useState } from "react";
import { useAuth } from "../../../lib/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function SetupAdminPage() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const makeAdmin = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        role: "admin",
        updatedAt: new Date()
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/upload-templates");
      }, 2000);
    } catch (error) {
      console.error("Error setting up admin:", error);
      setError(error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please log in first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Setup Admin Access</h1>
        
        <div className="bg-[#11231C] p-6 rounded-lg">
          <p className="mb-4">Click the button below to make your account an admin account.</p>
          
          {error && (
            <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 text-green-500 p-4 rounded-lg mb-4">
              Success! Your account is now an admin account. Redirecting...
            </div>
          )}

          <button
            onClick={makeAdmin}
            disabled={success}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              success
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#0C1813] hover:bg-[#1a3429]"
            }`}
          >
            Make My Account Admin
          </button>
        </div>
      </div>
    </div>
  );
} 