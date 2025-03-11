"use client";

import Navbar from "../../components/Navbar";
import { AuthProvider } from "../../lib/useAuth";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div style={{ backgroundColor: 'black', minHeight: '100vh' }} className="bg-black">
        <Navbar />
        <main style={{ backgroundColor: 'black' }} className="pt-24 pb-10 px-4">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
