"use client";

import { AuthProvider } from "../../lib/useAuth";

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 