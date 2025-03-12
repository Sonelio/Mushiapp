"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseView() {
  const router = useRouter();
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    theory: true,
    stepByStep: false,
    optimization: false,
    troubleshooting: false
  });

  // Type-safe toggle function
  const toggleSection = (section: 'theory' | 'stepByStep' | 'optimization' | 'troubleshooting') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left Sidebar */}
      <aside className="w-[300px] bg-black h-screen flex flex-col min-h-screen">
        {/* Back Button */}
        <div className="p-6">
          <button 
            onClick={() => router.push('/main/courses')}
            className="flex items-center text-white gap-2 hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 8 12 12 16" />
              <line x1="16" y1="12" x2="8" y2="12" />
            </svg>
            <span>Back to Courses</span>
          </button>
        </div>

        {/* Course Sections */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Theory Section */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center bg-[#10221B] p-4 rounded-md"
                onClick={() => toggleSection('theory')}
              >
                <span className="font-semibold">THEORY</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedSections.theory ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {expandedSections.theory && (
                <div className="mt-2 ml-4 space-y-2">
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Introduction
                  </div>
                  <div className="p-2 bg-[#10221B] rounded-md cursor-pointer">
                    Meta Ads Overview
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Understanding the Algorithm
                  </div>
                </div>
              )}
            </div>

            {/* Step-By-Step Guide Section */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center bg-[#10221B] p-4 rounded-md"
                onClick={() => toggleSection('stepByStep')}
              >
                <span className="font-semibold">STEP-BY-STEP GUIDE</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedSections.stepByStep ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {expandedSections.stepByStep && (
                <div className="mt-2 ml-4 space-y-2">
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Setting Up Your Account
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Creating Your First Campaign
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Configuring Targeting
                  </div>
                </div>
              )}
            </div>

            {/* Optimization Section */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center bg-[#10221B] p-4 rounded-md"
                onClick={() => toggleSection('optimization')}
              >
                <span className="font-semibold">OPTIMIZATION</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedSections.optimization ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {expandedSections.optimization && (
                <div className="mt-2 ml-4 space-y-2">
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Improving CTR
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Budget Allocation
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    A/B Testing
                  </div>
                </div>
              )}
            </div>

            {/* Troubleshooting Section */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center bg-[#10221B] p-4 rounded-md"
                onClick={() => toggleSection('troubleshooting')}
              >
                <span className="font-semibold">TROUBLESHOOTING</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedSections.troubleshooting ? 'transform rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {expandedSections.troubleshooting && (
                <div className="mt-2 ml-4 space-y-2">
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Common Errors
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Performance Issues
                  </div>
                  <div className="p-2 hover:bg-[#10221B] rounded-md cursor-pointer">
                    Account Recovery
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Video Content */}
        <div className="h-full">
          <div className="aspect-video w-full bg-[#111111]">
            <img 
              src="/course-video-placeholder.jpg" 
              alt="Course Video"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML += `
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-xl mb-4">Video Player</div>
                        <p class="text-gray-400">The course video will display here</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>

          {/* Content Below Video */}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Meta Ads Overview</h1>
            <p className="text-gray-300 mb-8">
              Learn the fundamentals of Meta advertising platform and how to leverage it for your business growth.
            </p>

            {/* Lesson Content */}
            <div className="space-y-6 mb-16">
              <h2 className="text-2xl font-semibold">Key Takeaways</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Understanding the Meta Ads platform structure</li>
                <li>Learning about different campaign objectives</li>
                <li>Identifying your target audience effectively</li>
                <li>Setting up tracking and conversion measurement</li>
                <li>Budgeting strategies for maximum ROI</li>
              </ul>
            </div>

            {/* Continue Button */}
            <div className="absolute bottom-8 right-8">
              <button className="bg-[#10221B] hover:bg-[#153226] text-white font-semibold py-3 px-6 rounded-md flex items-center gap-2">
                COMPLETE & CONTINUE
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 