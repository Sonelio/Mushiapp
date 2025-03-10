"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../../lib/useAuth";
import { doc, getDoc, setDoc, updateDoc, DocumentData } from "firebase/firestore";
import { sendPasswordResetEmail, signOut, User } from "firebase/auth";
import { db, auth, storage } from "../../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

interface UserData extends DocumentData {
  email?: string;
  name?: string;
  displayName?: string;
  photoURL?: string;
  savedTemplates?: string[];
  // Add other user fields as needed
}

interface AuthUser extends User {
  uid: string;
  email: string | null;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isLoadingUserDoc, setIsLoadingUserDoc] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchUserDoc();
  }, [loading, user, router]);

  const fetchUserDoc = async () => {
    try {
      if (!user) {
        setError("No user found");
        setIsLoadingUserDoc(false);  // Use this instead
        return;
      }

      const typedUser = user as AuthUser;
      const userRef = doc(db, "users", typedUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        setUserData(data);
        setDisplayName(data.displayName || "");
        setPhotoURL(data.photoURL || "");
      } else {
        // Create a new user document if it doesn't exist
        const newUserData: UserData = {
          email: typedUser.email || "",
          displayName: "",
          photoURL: "",
          savedTemplates: []
        };
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching user document:", error);
    } finally {
      setIsLoadingUserDoc(false);
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const typedUser = user as AuthUser;
    try {
      const userRef = doc(db, "users", typedUser.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        photoURL: photoURL,
      });

      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!user) return;
    const typedUser = user as AuthUser;
    try {
      await sendPasswordResetEmail(auth, typedUser.email || "");
      alert("Check your email for password reset instructions.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const typedUser = user as AuthUser;
    try {
      setIsUploading(true);
      
      // Generate a unique filename with timestamp
      const filename = `${Date.now()}-${file.name}`;
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `profile-images/${typedUser.uid}/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update state
      setPhotoURL(downloadURL);
      
      // Update the user document immediately
      const userRef = doc(db, "users", typedUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading || isLoadingUserDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <div className="text-red-500 text-xl">⚠️ Error</div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
      style={{
        background: "repeating-radial-gradient(circle at center, #0B0F0F 0, #0B0F0F 80px, #222 80px, #222 82px)",
      }}
    >
      <div className="p-8 rounded-md w-full max-w-sm" style={{ backgroundColor: "#20382E" }}>
        {/* User Avatar with Upload Option */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={photoURL || "/default-avatar.png"}
              alt="Profile"
              className="h-24 w-24 rounded-full border-2 border-[#2C4C3E] object-cover mb-4"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={triggerFileInput}
            >
              <span className="text-[#D6E7D3] text-sm">Change</span>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {isUploading && <p className="text-xs text-[#9DB396] mb-2">Uploading...</p>}
          <h1 className="text-2xl font-bold text-[#D6E7D3]">{displayName || "User"}</h1>
          <p className="text-[#9DB396] text-sm">{userData.email}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9DB396] mb-1">
              Display Name
            </label>
            <input
              type="text"
              className="w-full bg-[#2C4C3E] text-[#D6E7D3] placeholder-[#6A806F] border border-[#2C4C3E] 
                       rounded-md px-4 py-2 focus:outline-none focus:border-[#67C97E]"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          {/* Upload Image Button */}
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full bg-[#2C4C3E] text-[#D6E7D3] px-4 py-2 rounded-md hover:bg-[#2F6E3F] transition flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            Change Profile Picture
          </button>

          <button
            type="submit"
            className="w-full bg-[#2F6E3F] hover:bg-[#2D6B39] text-[#D6E7D3] py-2 rounded-md font-semibold"
          >
            Save Changes
          </button>
        </form>

        {/* Account Management Buttons */}
        <div className="space-y-3 mt-6">
          {/* Reset Password */}
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full bg-[#2C4C3E] text-[#D6E7D3] px-4 py-2 rounded-md hover:bg-[#2F6E3F] transition"
          >
            Reset Password
          </button>
          
          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-[#2C4C3E] text-[#D6E7D3] px-4 py-2 rounded-md hover:bg-red-900/50 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}