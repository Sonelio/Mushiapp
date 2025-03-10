"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#121617] text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold">
        Mushi
      </Link>

      {/* Navigation Links */}
      <nav className="space-x-6">
        <Link href="/membership" className="hover:text-gray-400 transition">
          Templates
        </Link>
        <Link href="/courses" className="hover:text-gray-400 transition">
          Courses
        </Link>
      </nav>

      {/* Account Placeholder */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-600 rounded-full"></div> {/* Placeholder Avatar */}
        <button className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );
}
