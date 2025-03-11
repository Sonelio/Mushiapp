"use client";

import { useParams } from "next/navigation";

export default function AccountDetailPage() {
  const params = useParams();
  const id = params.id;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1E1E] text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Account Details</h1>
        <p>Account ID: {id}</p>
      </div>
    </div>
  );
} 