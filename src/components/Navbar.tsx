"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { Route } from 'next';

interface User {
  photoURL?: string;
  displayName?: string;
}

export default function Navbar() {
  const { user, loading } = useAuth() as { user: User | null; loading: boolean };
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isTemplatesActive = pathname === '/main/membership';
  const isCoursesActive = pathname.startsWith('/main/courses');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ProfileImage = () => (
    <div className="w-14 h-14 rounded-[15px] bg-gray-400 overflow-hidden">
      {user?.photoURL ? (
        <Image
          src={user.photoURL}
          alt="Profile"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-full text-gray-600" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
    </div>
  );

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="mx-4 my-6">
        <nav className="bg-[#11231C] rounded-[15px] overflow-hidden">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href={"/main/membership" as Route} className="flex items-center">
                  <Image
                    src="/mushi-logo.png"
                    alt="Mushi Logo"
                    width={120}
                    height={36}
                    priority
                    className="object-contain"
                  />
                </Link>
              </div>

              {/* Main Navigation - Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href={"/main/membership" as Route}
                  className={`text-white text-[20px] font-semibold tracking-wide px-6 py-4 rounded-md transition-colors ${
                    isTemplatesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                  }`}
                >
                  TEMPLATES
                </Link>
                <Link
                  href={"/main/courses" as Route}
                  className={`text-white text-[20px] font-semibold tracking-wide px-6 py-4 rounded-md transition-colors ${
                    isCoursesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                  }`}
                >
                  COURSES
                </Link>
              </div>

              {/* Account Section - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <Link href={"/main/account" as Route} className="flex items-center space-x-2">
                  <ProfileImage />
                  <div className="text-sm mr-2 hidden md:block" style={{ marginTop: "2px" }}>
                    <p className="text-[15px] font-semibold text-white" style={{ marginBottom: "4px", padding: "0px 2px" }}>Account</p>
                    <p className="text-[15px] font-semibold text-[#667B66]" style={{ padding: "0px 2px" }}>{user?.displayName || 'My Account'}</p>
                  </div>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
                {/* Account Section - Mobile */}
                <div className="py-2">
                  <Link href={"/main/account" as Route} className="flex items-center space-x-3 px-3 py-2">
                    <ProfileImage />
                    <div style={{ marginTop: "2px" }}>
                      <p className="text-[15px] font-semibold text-white" style={{ marginBottom: "4px", padding: "0px 2px" }}>Account</p>
                      <p className="text-[15px] font-semibold text-[#667B66]" style={{ padding: "0px 2px" }}>{user?.displayName || 'My Account'}</p>
                    </div>
                  </Link>
                </div>

                {/* Navigation Links - Mobile */}
                <Link
                  href={"/main/membership" as Route}
                  className={`block px-3 py-2 text-white text-[20px] font-semibold tracking-wide rounded-md transition-colors ${
                    isTemplatesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TEMPLATES
                </Link>
                <Link
                  href={"/main/courses" as Route}
                  className={`block px-3 py-2 text-white text-[20px] font-semibold tracking-wide rounded-md transition-colors ${
                    isCoursesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  COURSES
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}