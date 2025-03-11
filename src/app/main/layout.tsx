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
      <div id="main-layout-container">
        <Navbar />
        <main id="main-content">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
