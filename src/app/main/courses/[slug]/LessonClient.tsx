"use client";

import { useEffect } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

interface LessonClientProps {
  slug: string;
}

export default function LessonClient({ slug }: LessonClientProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0F] text-white flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0E1814] min-h-screen p-6 space-y-6">
        <Link 
          href={"/main/courses" as Route}
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Courses
        </Link>

        {/* Course Navigation */}
        <nav className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase">Current Lesson</h3>
            <div className="bg-[#11231C] p-4 rounded-lg">
              <h4 className="font-medium">How Digital Advertising Works</h4>
              <p className="text-sm text-gray-400 mt-1">Understanding the basics</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase">Next Up</h3>
            <div className="space-y-2">
              <Link href={"#" as Route} className="block p-4 hover:bg-[#11231C] rounded-lg transition-colors">
                <h4 className="font-medium">Data & Pixel</h4>
                <p className="text-sm text-gray-400">Setting up tracking</p>
              </Link>
              <Link href={"#" as Route} className="block p-4 hover:bg-[#11231C] rounded-lg transition-colors">
                <h4 className="font-medium">Key Performance Indicators</h4>
                <p className="text-sm text-gray-400">Measuring success</p>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Video Section */}
        <div className="bg-black aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Loading video player...</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">How Digital Advertising Works</h1>
            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isCompleted
                  ? 'bg-[#2F6E3F] text-white'
                  : 'bg-[#11231C] text-gray-300 hover:bg-[#1a3429]'
              }`}
            >
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>Overview</h2>
            <p>
              In this lesson, you'll learn the fundamentals of digital advertising and how it works in today's online landscape.
              We'll cover the basic concepts, key terminology, and the overall ecosystem of digital advertising.
            </p>

            <h2>Key Points</h2>
            <ul>
              <li>Understanding the digital advertising ecosystem</li>
              <li>Different types of digital ads and their purposes</li>
              <li>How the bidding process works</li>
              <li>Target audience identification and segmentation</li>
              <li>Introduction to ad platforms and their differences</li>
            </ul>

            <h2>Additional Resources</h2>
            <div className="bg-[#11231C] p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-medium">Downloads</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href={"#" as Route}
                    className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    Lesson Slides (PDF)
                  </a>
                </li>
                <li>
                  <a 
                    href={"#" as Route}
                    className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    Exercise Workbook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-6 border-t border-gray-800">
            <button
              className="px-6 py-3 bg-[#11231C] text-gray-300 rounded-md hover:bg-[#1a3429] transition-colors inline-flex items-center"
              disabled
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              Previous Lesson
            </button>
            <button
              className="px-6 py-3 bg-[#2F6E3F] text-white rounded-md hover:bg-[#2D6B39] transition-colors inline-flex items-center"
            >
              Next Lesson
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 