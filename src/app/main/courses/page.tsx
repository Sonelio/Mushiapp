"use client";

import { useEffect, useState, useRef } from "react";

interface CourseCardData {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function CoursesPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Run once after hydration is complete
  useEffect(() => {
    setIsHydrated(true);
    
    // Create our grid element
    if (containerRef.current) {
      const gridDiv = document.createElement('div');
      gridDiv.className = "grid grid-cols-1 gap-6";
      
      // Create and append first card (PPC for Beginners)
      const firstCard = createCardElement({
        title: "PPC for Beginners",
        description: "Master Meta Ads in 3 Hours. Learn to set up, launch, and optimize ads with Domantė to start generating sales.",
        image: "https://firebasestorage.googleapis.com/v0/b/mushi-a9949.firebasestorage.app/o/1%204.png?alt=media&token=15e944d8-1121-4c36-b137-9e88d02c72dc",
        link: "/main/courses/ppc-for-beginners"
      });
      gridDiv.appendChild(firstCard);
      
      // Append to our container
      containerRef.current.appendChild(gridDiv);
    }
  }, []);

  // Function to create our card element
  const createCardElement = ({ title, description, image, link }: CourseCardData) => {
    // Create link wrapper
    const link_el = document.createElement('a');
    link_el.href = link;
    
    // Create card div
    const cardDiv = document.createElement('div');
    cardDiv.className = "bg-[#10221B] shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer hover:opacity-95 rounded-[20px]";
    
    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.className = "relative h-[400px] overflow-hidden mb-4 rounded-[15px]"; // Increased height to 300px
    
    // Create image
    const img = document.createElement('img');
    img.src = image;
    img.alt = `${title} course image`;
    img.className = "w-full h-full object-cover rounded-[15px]";
    imgContainer.appendChild(img);
    
    // Create content div
    const contentDiv = document.createElement('div');
    contentDiv.className = "pb-2 text-left";
    
    // Create header
    const header = document.createElement('div');
    header.className = "flex justify-between items-center mb-2";
    
    // Create title
    const titleEl = document.createElement('h3');
    titleEl.className = "text-[25px] font-semibold text-white";
    titleEl.textContent = title;
    header.appendChild(titleEl);
    
    // Create course icon
    const courseIcon = document.createElement('img');
    courseIcon.src = "/course-icon.png";
    courseIcon.alt = "Course Icon";
    courseIcon.className = "h-6 w-6 object-contain";
    header.appendChild(courseIcon);
    
    // Create description
    const descriptionEl = document.createElement('p');
    descriptionEl.className = "text-[15px] font-medium text-[#667B66]";
    descriptionEl.textContent = description;
    
    // Assemble the card
    contentDiv.appendChild(header);
    contentDiv.appendChild(descriptionEl);
    cardDiv.appendChild(imgContainer);
    cardDiv.appendChild(contentDiv);
    link_el.appendChild(cardDiv);
    
    return link_el;
  };

  return (
    <div className="min-h-screen bg-[#0B0F0F] text-white flex items-start justify-start">
      <div className="space-y-4 max-w-[400px]" ref={containerRef}>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Coming Soon</h1>
        <p className="text-lg text-gray-400">Our courses are currently under development. Check back later for exciting learning opportunities.</p>
      </div>
      {isHydrated && (
        <style jsx global>{`
          .space-y-4 {
            margin-top: 20;
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