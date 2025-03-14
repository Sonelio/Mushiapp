import React, { forwardRef, useState } from "react";
import Image from "next/image";

interface Template {
  id: string;
  imageUrl?: string;
  canvaLink?: string;
  title: string;
}

interface TemplateCardProps {
  template: Template;
  isSaved: boolean;
  onToggleSave: () => void;
}

const TemplateCard = forwardRef<HTMLDivElement, TemplateCardProps>(({ template, isSaved, onToggleSave }, ref) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClicked(!isClicked);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClicked(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Don't hide immediately on touch end to allow button interaction
  };

  return (
    <div 
      ref={ref} 
      className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white aspect-square"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card Image with Hover Effect */}
      {template.imageUrl && (
        <>
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover/Click Overlay for "Open in Canva" */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isClicked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="flex items-center space-x-6">
                <a
                  href={template.canvaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#10221B] text-white px-6 py-2 rounded-md text-[20px] font-semibold hover:bg-[#10221B]/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open in Canva
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSave();
                  }}
                  className="bg-[#10221B] px-3 py-4 rounded-md flex items-center justify-center h-[44px] w-[44px] cursor-pointer hover:opacity-90 transition-colors"
                  aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
                >
                  <img 
                    src={isSaved ? "/hover-icon-scs.png" : "/hover-icon.png"} 
                    alt={isSaved ? "Saved to favorites" : "Add to favorites"} 
                    width={13} 
                    height={14} 
                    className="object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;