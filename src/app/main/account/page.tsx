"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAuth } from "../../../lib/useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { db, auth, storage } from "../../../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

interface UserData extends DocumentData {
  email?: string;
  name?: string;
  surname?: string;
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

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
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
        setIsLoadingUserDoc(false);
        return;
      }

      const typedUser = user as AuthUser;
      const userRef = doc(db, "users", typedUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        setUserData(data);
        setName(data.name || "");
        setSurname(data.surname || "");
        setPhotoURL(data.photoURL || "");
        setEmail(typedUser.email || "");
      } else {
        // Create a new user document if it doesn't exist
        const newUserData: UserData = {
          email: typedUser.email || "",
          name: "",
          surname: "",
          displayName: "",
          photoURL: "",
          savedTemplates: []
        };
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
        setEmail(typedUser.email || "");
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
        name: name.trim(),
        surname: surname.trim(),
        displayName: `${name.trim()} ${surname.trim()}`.trim(),
        photoURL: photoURL,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
      <div className={`min-h-screen flex items-center justify-center bg-black ${poppins.className}`}>
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-white space-y-4 ${poppins.className}`}>
        <div className="text-red-500 text-xl">⚠️ Error</div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-white ${poppins.className}`}>
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-black ${poppins.className}`}>
      <div className="p-8 w-full max-w-[450px] relative bg-black">
        <div className="flex flex-col items-center mb-6 bg-black">
          <div className="relative group mb-4">
            <img
              src={photoURL || "/default-avatar.png"}
              alt="Profile"
              className="h-24 w-24 rounded-[15px] object-cover"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
        </div>

        <h2 className="text-center font-extrabold text-white mb-8 tracking-tight leading-none" style={{ fontSize: "45px" }}>
          Account Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-4 bg-black">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#10221B] text-[20px] font-normal text-[#D6E7D3] placeholder-[#6A806F] 
                     rounded-[10px] px-4 py-2 focus:outline-none focus:border-none"
          />

          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full bg-[#10221B] text-[20px] font-normal text-[#D6E7D3] placeholder-[#6A806F] 
                     rounded-[10px] px-4 py-2 focus:outline-none focus:border-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled
            className="w-full bg-[#10221B] text-[20px] font-normal text-[#D6E7D3] placeholder-[#6A806F] 
                     rounded-[10px] px-4 py-2 focus:outline-none focus:border-none opacity-70"
          />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="submit"
              className="h-[50px] bg-[#1D6D1E] hover:bg-[#1D6D1E]/90 text-[#D6E7D3] rounded-[10px] font-medium text-[20px]"
            >
              Save
            </button>
            
            <button
              type="button"
              onClick={handleLogout}
              className="h-[50px] bg-[#2C4C3E] hover:bg-red-900/50 text-[#D6E7D3] rounded-[10px] font-medium text-[20px]"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}