"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
      style={{
        background: "repeating-radial-gradient(circle at center, #0B0F0F 0, #0B0F0F 80px, #222 80px, #222 82px)",
      }}
    >
      <div className="bg-[#0e1814]/90 backdrop-blur-md rounded-xl p-8 max-w-md text-center shadow-lg border border-white/10">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <p className="mb-8 text-gray-300">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="bg-[#11231C] hover:bg-[#0A1910] text-white px-6 py-3 rounded-md transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}