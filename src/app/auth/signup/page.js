"use client";
import { useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      router.push("/membership");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "repeating-radial-gradient(circle at center, #0B0F0F 0, #0B0F0F 80px, #222 80px, #222 82px)",
      }}
    >
      <div className="p-8 rounded-md w-full max-w-sm" style={{ backgroundColor: "#20382E" }}>
        <h1 className="text-center text-3xl font-bold mb-2" style={{ color: "#D6E7D3" }}>
          Mushi
        </h1>
        <h2 className="text-center text-lg mb-6" style={{ color: "#9DB396" }}>
          Create your account
        </h2>

        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#2C4C3E] text-[#D6E7D3] placeholder-[#6A806F] border border-[#2C4C3E] 
                       rounded-md px-4 py-2 focus:outline-none focus:border-[#67C97E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#2C4C3E] text-[#D6E7D3] placeholder-[#6A806F] border border-[#2C4C3E] 
                       rounded-md px-4 py-2 focus:outline-none focus:border-[#67C97E]"
          />
          <button
            type="submit"
            className="w-full bg-[#2F6E3F] hover:bg-[#2D6B39] text-[#D6E7D3] py-2 rounded-md font-semibold"
          >
            Continue
          </button>
        </form>

        <p className="mt-4 text-center" style={{ color: "#D6E7D3" }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold" style={{ color: "#67C97E" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
