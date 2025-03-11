"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1E1E] text-white p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-xl text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          {/* @ts-ignore */}
          <Link href="/" className="bg-[#11231C] hover:bg-[#0A1910] text-white px-6 py-3 rounded-md transition">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}