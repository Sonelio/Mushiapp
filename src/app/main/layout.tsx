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
      <div>
        <Navbar />
        <main className="pt-24 pb-10 px-4">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
