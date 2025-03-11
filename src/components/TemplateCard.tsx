import React, { forwardRef } from "react";

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
  return (
    <div ref={ref} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
      {/* Card Image with Hover Effect */}
      {template.imageUrl && (
        <>
          <div className="relative h-[400px] sm:h-[350px] lg:h-[400px] overflow-hidden">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Desktop Hover Overlay for "Open in Canva" */}
            <div
              className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              {template.canvaLink && (
                <a
                  href={template.canvaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#20382E] text-white px-4 py-2 rounded-md font-medium hover:bg-[#2C4C3E] transition-colors"
                >
                  Open in Canva
                </a>
              )}
            </div>

            {/* Desktop Like Button (only visible on hover) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSave();
              }}
              className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {isSaved ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#67C97E"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12.1 8.64l-.1.1-.1-.1C9.14 5.61 6.5 5.24 4.24 7.5c-2.27 2.27-2.27 5.95 0 8.22l7.46 7.46c.39.39 1.02.39 1.41 0l7.46-7.46c2.27-2.27 2.27-5.95 0-8.22-2.26-2.26-4.9-1.89-7.06.27z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Action Bar (below image) */}
          <div className="md:hidden bg-white border-t border-gray-100 p-3 flex items-center justify-between">
            {template.canvaLink && (
              <a
                href={template.canvaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#20382E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#2C4C3E] transition-colors flex-grow mr-3 text-center"
              >
                Open in Canva
              </a>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSave();
              }}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
            >
              {isSaved ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#67C97E"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12.1 8.64l-.1.1-.1-.1C9.14 5.61 6.5 5.24 4.24 7.5c-2.27 2.27-2.27 5.95 0 8.22l7.46 7.46c.39.39 1.02.39 1.41 0l7.46-7.46c2.27-2.27 2.27-5.95 0-8.22-2.26-2.26-4.9-1.89-7.06.27z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
});

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;