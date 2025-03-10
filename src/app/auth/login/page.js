"use client";
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/membership");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      // A repeating radial gradient that creates concentric circles.
      style={{
        background: "repeating-radial-gradient(circle at center, #0B0F0F 0, #0B0F0F 80px, #222 80px, #222 82px)",
      }}
    >
      {/* The dark green card container */}
      <div className="p-8 rounded-md w-full max-w-sm" style={{ backgroundColor: "#20382E" }}>
        {/* App Title */}
        <h1 className="text-center text-3xl font-bold mb-2" style={{ color: "#D6E7D3" }}>
          Mushi
        </h1>
        <h2 className="text-center text-lg mb-6" style={{ color: "#9DB396" }}>
          Sign in to Continue
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            Enter Mushi
          </button>
        </form>

        <p className="mt-4 text-center" style={{ color: "#D6E7D3" }}>
          First time here?{" "}
          <Link href="/auth/signup" className="font-semibold" style={{ color: "#67C97E" }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
