"use client";
import { useState } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Store basic user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      router.push("/main/membership");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center relative overflow-hidden ${poppins.className}`}>
      <Image
        src="/background.png"
        alt="Background Pattern"
        fill
        priority
        className="object-cover w-full h-full absolute top-0 left-0 z-0"
      />
      <div className="p-8 rounded-[30px] w-full max-w-[450px] relative z-10" style={{ backgroundColor: "#20382E" }}>
        {/* App Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/mushi logo.png"
            alt="Mushi Logo"
            width={150}
            height={45}
            priority
          />
        </div>
        <h2 className="text-center text-[25px] font-medium text-white mb-6">
          Create your account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black text-[20px] font-normal text-[#D6E7D3] placeholder-[#6A806F] border border-[#2C4C3E] 
                       rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#67C97E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black text-[20px] font-normal text-[#D6E7D3] placeholder-[#6A806F] border border-[#2C4C3E] 
                       rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#67C97E]"
          />
          <button
            type="submit"
            className="w-full h-[50px] bg-[#1D6D1E] hover:bg-[#1D6D1E]/90 text-[#D6E7D3] rounded-[10px] font-medium text-[25px]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-[20px] font-normal" style={{ color: "#D6E7D3" }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-[#1D6D1E]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
