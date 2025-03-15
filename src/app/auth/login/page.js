"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { Route } from "next";

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/main/membership");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center relative overflow-hidden ${poppins.className}`}>
      <Image
        src={isMobile ? "/mobile-loginbackground.png" : "/background.png"}
        alt="Background Pattern"
        fill
        priority
        className="object-cover w-full h-full absolute top-0 left-0 z-0"
      />
      <div className="p-8 md:p-8 rounded-[30px] w-[85%] md:w-full max-w-[450px] relative z-10 mx-4 md:mx-0" style={{ backgroundColor: "#20382E" }}>
        {/* App Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/mushi-logo.png"
            alt="Mushi Logo"
            width={150}
            height={45}
            priority
          />
        </div>
        <h2 className="text-center text-[25px] font-medium text-white mb-6">
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
            Enter Mushi
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6">
          First time here?{" "}
          <a href="https://mushi.agency/" className="font-medium text-[#1D6D1E]" target="_blank" rel="noopener noreferrer">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
