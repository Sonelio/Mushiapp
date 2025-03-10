"use client";

import Link from "next/link";
import { useAuth } from "../lib/useAuth";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full px-2 py-3">
      <nav className="bg-[#11231C] text-white p-4 flex justify-between items-center shadow-md rounded-[15px] border-2 border-black w-full max-w-[98%] mx-auto relative z-10">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold ml-2">
          Mushi
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/membership" 
            className={`px-3 py-2 rounded-md transition ${
              pathname?.includes("/membership") 
                ? "bg-[#0e1814] text-white" 
                : "hover:bg-[#0e1814]/30 hover:text-gray-200"
            }`}
          >
            Templates
          </Link>
          <Link 
            href="/courses" 
            className={`px-3 py-2 rounded-md transition ${
              pathname?.includes("/courses") 
                ? "bg-[#0e1814] text-white" 
                : "hover:bg-[#0e1814]/30 hover:text-gray-200"
            }`}
          >
            Courses
          </Link>
        </div>

        {/* Desktop Profile Section */}
        <div className="hidden md:block">
          {user ? (
            <Link href="/account" className="flex items-center space-x-3 hover:bg-[#0e1814] px-3 py-2 rounded-md transition mr-2">
              {/* User Profile Image */}
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-gray-400"
              />
              {/* Name & Account Label */}
              <div className="text-left">
                <p className="text-sm font-semibold">Account</p>
                <p className="text-xs text-gray-300">{user.displayName || "User"}</p>
              </div>
            </Link>
          ) : (
            <Link href="/auth/login" className="bg-blue-600 px-5 py-2 rounded-full text-white hover:bg-blue-700 mr-2">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu (Slides down when open) */}
      <div 
        className={`bg-[#11231C] text-white shadow-md rounded-b-[15px] border-2 border-t-0 border-black w-full max-w-[98%] mx-auto overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-60' : 'max-h-0'
        } md:hidden`}
      >
        <div className="p-4 space-y-3">
          <Link 
            href="/membership" 
            className={`block px-3 py-2 rounded-md transition ${
              pathname?.includes("/membership") 
                ? "bg-[#0e1814] text-white" 
                : "hover:bg-[#0e1814]/30 hover:text-gray-200"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Templates
          </Link>
          <Link 
            href="/courses" 
            className={`block px-3 py-2 rounded-md transition ${
              pathname?.includes("/courses") 
                ? "bg-[#0e1814] text-white" 
                : "hover:bg-[#0e1814]/30 hover:text-gray-200"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </Link>
          
          {/* Mobile Profile Section */}
          <div className="pt-2 border-t border-gray-700">
            {user ? (
              <Link 
                href="/account" 
                className="flex items-center space-x-3 hover:bg-[#0e1814] px-3 py-2 rounded-md transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-400"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold">Account</p>
                  <p className="text-xs text-gray-300">{user.displayName || "User"}</p>
                </div>
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                className="block bg-blue-600 px-5 py-2 rounded-full text-center text-white hover:bg-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}