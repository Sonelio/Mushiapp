"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CourseContent() {
  const [expandedSections, setExpandedSections] = useState({
    theory: true,
    stepByStep: false,
    optimization: false,
    troubleshooting: false
  });

  const [selectedLesson, setSelectedLesson] = useState<string>('digital-advertising');

  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'digital-advertising',
    'data-pixel'
  ]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleLessonClick = (lessonId: string) => {
    setSelectedLesson(lessonId);
  };

  const courseContent = {
    theory: [
      { id: 'digital-advertising', title: 'How Digital Advertising Works' },
      { id: 'data-pixel', title: 'Data & Pixel' },
      { id: 'kpi', title: 'Key Performance Indicators' },
      { id: 'creative-testing', title: 'Creative Testing' },
      { id: 'budget', title: 'Budget & Ad Spend' }
    ],
    stepByStep: [
      { id: 'setup', title: 'Setting Up Your Account' },
      { id: 'campaign', title: 'Creating Your First Campaign' },
      { id: 'targeting', title: 'Configuring Targeting' }
    ],
    optimization: [
      { id: 'ctr', title: 'Improving CTR' },
      { id: 'budget', title: 'Budget Allocation' },
      { id: 'testing', title: 'A/B Testing' }
    ],
    troubleshooting: [
      { id: 'errors', title: 'Common Errors' },
      { id: 'performance', title: 'Performance Issues' },
      { id: 'recovery', title: 'Account Recovery' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0B0F0F] text-white p-8 pb-24 lg:pb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player Section - Moved up for mobile */}
        <div className="flex-1 space-y-6 order-1 lg:order-2">
          {/* Video Player */}
          <div className="bg-[#10221B] rounded-[20px] aspect-video relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4">Video Player</div>
                <p className="text-[#667B66]">Content will be available soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content List - Moved down for mobile */}
        <div className="w-full lg:w-[350px] space-y-6 order-2 lg:order-1">
          {/* Back Button */}
          <Link 
            href="/main/courses"
            className="hidden lg:inline-flex items-center text-white bg-[#10221B] hover:bg-[#10221B] transition-colors gap-2 px-4 py-2 rounded-[15px]"
          >
            <Image 
              src="/courses-back.png"
              alt="Back"
              width={20}
              height={20}
            />
            Back to Courses
          </Link>

          {/* Course Content List */}
          <div className="bg-[#10221B] rounded-[20px]">
            {/* Course Sections */}
            <div className="bg-[#10221B] rounded-[20px]">
              {/* Theory Section */}
              <div>
                <button
                  onClick={() => toggleSection('theory')}
                  className="w-full flex justify-between items-center p-4 bg-[#10221B] text-white first:rounded-t-[20px]"
                >
                  <span className="font-semibold">THEORY</span>
                  <Image
                    src={expandedSections.theory ? "/courses-expanded.png" : "/courses-unexpanded.png"}
                    alt={expandedSections.theory ? "Collapse section" : "Expand section"}
                    width={20}
                    height={20}
                    className={`transition-transform duration-200`}
                  />
                </button>
                {expandedSections.theory && (
                  <div className="space-y-1 bg-[#10221B]">
                    {courseContent.theory.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 cursor-pointer text-white transition-colors ${
                          selectedLesson === item.id ? 'bg-black' : 'bg-[#10221B]'
                        }`}
                        onClick={() => handleLessonClick(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(item.id);
                            }}
                          >
                            <Image
                              src={completedLessons.includes(item.id) ? "/courses-checked.png" : "/courses-unchecked.png"}
                              alt={completedLessons.includes(item.id) ? "Completed" : "Not completed"}
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step-By-Step Guide Section */}
              <div>
                <button
                  onClick={() => toggleSection('stepByStep')}
                  className="w-full flex justify-between items-center p-4 bg-[#10221B] text-white"
                >
                  <span className="font-semibold">STEP-BY-STEP GUIDE</span>
                  <Image
                    src={expandedSections.stepByStep ? "/courses-expanded.png" : "/courses-unexpanded.png"}
                    alt={expandedSections.stepByStep ? "Collapse section" : "Expand section"}
                    width={20}
                    height={20}
                    className={`transition-transform duration-200`}
                  />
                </button>
                {expandedSections.stepByStep && (
                  <div className="space-y-1 bg-[#10221B]">
                    {courseContent.stepByStep.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 cursor-pointer text-white transition-colors ${
                          selectedLesson === item.id ? 'bg-black' : 'bg-[#10221B]'
                        }`}
                        onClick={() => handleLessonClick(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(item.id);
                            }}
                          >
                            <Image
                              src={completedLessons.includes(item.id) ? "/courses-checked.png" : "/courses-unchecked.png"}
                              alt={completedLessons.includes(item.id) ? "Completed" : "Not completed"}
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Optimization Section */}
              <div>
                <button
                  onClick={() => toggleSection('optimization')}
                  className="w-full flex justify-between items-center p-4 bg-[#10221B] text-white"
                >
                  <span className="font-semibold">OPTIMIZATION</span>
                  <Image
                    src={expandedSections.optimization ? "/courses-expanded.png" : "/courses-unexpanded.png"}
                    alt={expandedSections.optimization ? "Collapse section" : "Expand section"}
                    width={20}
                    height={20}
                    className={`transition-transform duration-200`}
                  />
                </button>
                {expandedSections.optimization && (
                  <div className="space-y-1 bg-[#10221B]">
                    {courseContent.optimization.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 cursor-pointer text-white transition-colors ${
                          selectedLesson === item.id ? 'bg-black' : 'bg-[#10221B]'
                        }`}
                        onClick={() => handleLessonClick(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(item.id);
                            }}
                          >
                            <Image
                              src={completedLessons.includes(item.id) ? "/courses-checked.png" : "/courses-unchecked.png"}
                              alt={completedLessons.includes(item.id) ? "Completed" : "Not completed"}
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Troubleshooting Section */}
              <div>
                <button
                  onClick={() => toggleSection('troubleshooting')}
                  className="w-full flex justify-between items-center p-4 bg-[#10221B] text-white"
                >
                  <span className="font-semibold">TROUBLESHOOTING</span>
                  <Image
                    src={expandedSections.troubleshooting ? "/courses-expanded.png" : "/courses-unexpanded.png"}
                    alt={expandedSections.troubleshooting ? "Collapse section" : "Expand section"}
                    width={20}
                    height={20}
                    className={`transition-transform duration-200`}
                  />
                </button>
                {expandedSections.troubleshooting && (
                  <div className="space-y-1 bg-[#10221B]">
                    {courseContent.troubleshooting.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 cursor-pointer text-white transition-colors ${
                          selectedLesson === item.id ? 'bg-black' : 'bg-[#10221B]'
                        }`}
                        onClick={() => handleLessonClick(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(item.id);
                            }}
                          >
                            <Image
                              src={completedLessons.includes(item.id) ? "/courses-checked.png" : "/courses-unchecked.png"}
                              alt={completedLessons.includes(item.id) ? "Completed" : "Not completed"}
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Button - Fixed at bottom on mobile */}
      <div className="fixed lg:static bottom-0 left-0 right-0 p-4 lg:p-0 bg-[#0B0F0F] lg:bg-transparent lg:mt-6">
        <div className="container mx-auto px-8 lg:px-0">
          <div className="flex justify-center lg:justify-end max-w-[350px] mx-auto lg:ml-0">
            <button className="bg-[#10221B] hover:bg-[#1A3429] text-white px-6 py-3 rounded-[15px] flex items-center gap-2 transition-colors w-full justify-center">
              <span className="text-lg font-semibold">COMPLETE & CONTINUE</span>
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
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 