"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function CoursesPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Run once after hydration is complete
  useEffect(() => {
    setIsHydrated(true);
    
    // Create our grid element
    if (containerRef.current) {
      const gridDiv = document.createElement('div');
      gridDiv.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6";
      
      // Create and append card element
      const card = createCardElement();
      gridDiv.appendChild(card);
      
      // Append to our container
      containerRef.current.appendChild(gridDiv);
    }
  }, []);

  // Function to create our card element
  const createCardElement = () => {
    // Create link wrapper
    const link = document.createElement('a');
    link.href = "/main/courses/ppc-for-beginners/view";
    
    // Create card div
    const cardDiv = document.createElement('div');
    cardDiv.className = "bg-[#10221B] shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer hover:opacity-95 rounded-[20px]";
    
    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.className = "relative h-[210px] overflow-hidden mb-4 rounded-[15px]";
    
    // Create image
    const img = document.createElement('img');
    img.src = "https://firebasestorage.googleapis.com/v0/b/mushi-a9949.firebasestorage.app/o/1%204.png?alt=media&token=15e944d8-1121-4c36-b137-9e88d02c72dc";
    img.alt = "PPC for Beginners - Woman with laptop";
    img.className = "w-full h-full object-cover rounded-[15px]";
    imgContainer.appendChild(img);
    
    // Create home icon
    const iconDiv = document.createElement('div');
    iconDiv.className = "absolute top-3 right-3";
    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>`;
    imgContainer.appendChild(iconDiv);
    
    // Create content div
    const contentDiv = document.createElement('div');
    contentDiv.className = "pb-2 text-left";
    
    // Create header
    const header = document.createElement('div');
    header.className = "flex justify-between items-center mb-2";
    
    // Create title
    const title = document.createElement('h3');
    title.className = "text-[25px] font-semibold text-white";
    title.textContent = "PPC for Beginners";
    header.appendChild(title);
    
    // Create course icon
    const courseIcon = document.createElement('img');
    courseIcon.src = "/course-icon.png";
    courseIcon.alt = "Course Icon";
    courseIcon.className = "h-6 w-6 object-contain";
    header.appendChild(courseIcon);
    
    // Create description
    const description = document.createElement('p');
    description.className = "text-[15px] font-medium text-[#667B66]";
    description.textContent = "Master Meta Ads in 3 hours. Learn to set up, launch, and optimize ads with formulas to start generating sales.";
    
    // Assemble the card
    contentDiv.appendChild(header);
    contentDiv.appendChild(description);
    cardDiv.appendChild(imgContainer);
    cardDiv.appendChild(contentDiv);
    link.appendChild(cardDiv);
    
    return link;
  };

  return (
    <div className="min-h-screen bg-[#0B0F0F] text-white flex items-center justify-center p-8">
      <div className="text-center space-y-4" ref={containerRef}>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Coming Soon</h1>
        <p className="text-lg text-gray-400">Our courses are currently under development. Check back later for exciting learning opportunities.</p>
        {/* Server renders only h1 and p - we'll add the grid via JS */}
      </div>
      {isHydrated && (
        <style jsx global>{`
          .text-center.space-y-4 {
            width: 100%;
            margin-top: -30vh;
          }
          h1.text-4xl, p.text-lg {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      )}
    </div>
  );
} 