"use client";

import { AuthProvider } from "../../lib/useAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </AuthProvider>
  );
} 