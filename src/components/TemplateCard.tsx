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
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsClicked(!isClicked);
    }
  };

  return (
    <div ref={ref} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white aspect-square">
      {/* Card Image with Hover Effect */}
      {template.imageUrl && (
        <>
          <div className="relative w-full h-full overflow-hidden md:group" onClick={handleClick}>
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover/Click Overlay for "Open in Canva" */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isMobile 
                  ? isClicked ? 'opacity-100' : 'opacity-0'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              {template.canvaLink && (
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
              )}
            </div>
          </div>

          {/* Mobile Action Bar (below image) */}
          <div className="md:hidden bg-white border-t border-gray-100 p-3">
            {template.canvaLink && (
              <div className="flex items-center space-x-6">
                <a
                  href={template.canvaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#10221B] text-white px-6 py-2 rounded-md text-[20px] font-semibold hover:bg-[#10221B]/80 transition-colors"
                >
                  Open in Canva
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSave();
                  }}
                  className="bg-[#10221B] px-3 py-2 rounded-md flex items-center justify-center h-[44px] w-[44px] cursor-pointer hover:opacity-90 transition-colors"
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
            )}
          </div>
        </>
      )}
    </div>
  );
});

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;