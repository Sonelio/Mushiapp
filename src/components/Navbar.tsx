"use client";

import { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  ref={menuButtonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <img
                      src="/mobile-menu2.png"
                      alt="Menu"
                      className="h-6 w-6 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  ) : (
                    <img
                      src="/mobile-menu1.png"
                      alt="Menu"
                      className="h-6 w-6 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  )}
                </button>
              </div>

              {/* Logo - Centered on mobile */}
              <div className="flex-shrink-0 md:flex-shrink-0">
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
              <div className="hidden md:flex items-center">
                <Link href={"/main/account" as Route} className="flex items-center space-x-2">
                  <ProfileImage />
                  <div className="text-sm mr-2" style={{ marginTop: "2px" }}>
                    <p className="text-[15px] font-semibold text-white" style={{ marginBottom: "4px", padding: "0px 2px" }}>Account</p>
                    <p className="text-[15px] font-semibold text-[#667B66]" style={{ padding: "0px 2px" }}>{user?.displayName || 'My Account'}</p>
                  </div>
                </Link>
              </div>

              {/* Mobile Profile Picture */}
              <div className="md:hidden">
                <Link href={"/main/account" as Route}>
                  <ProfileImage />
                </Link>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div ref={menuRef} className="md:hidden absolute top-full left-0 right-0 mx-4" style={{ marginTop: "1px" }}>
                <div className="bg-[#11231C] overflow-hidden">
                  <div style={{ padding: "8px 4px 12px 4px" }}>
                    {/* Navigation Links - Mobile */}
                    <Link
                      href={"/main/membership" as Route}
                      className={`block text-white text-[20px] font-semibold tracking-wide rounded-md transition-colors text-center ${
                        isTemplatesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                      }`}
                      style={{ width: '150px', margin: '0 auto', padding: '4px 1px' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      TEMPLATES
                    </Link>
                    <Link
                      href={"/main/courses" as Route}
                      className={`block text-white text-[20px] font-semibold tracking-wide rounded-md transition-colors text-center ${
                        isCoursesActive ? 'bg-[#0C1813]' : 'hover:bg-[#0C1813]'
                      }`}
                      style={{ width: '130px', margin: '0 auto', padding: '4px 1px' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      COURSES
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}