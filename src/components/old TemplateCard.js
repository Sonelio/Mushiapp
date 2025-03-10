"use client";
import { useState } from "react";

export default function TemplateCard({ template }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative bg-[#2A2F2E] rounded-md p-0 shadow hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* The Preview Image */}
      <img
        src={template.imageUrl}
        alt="Template"
        className="rounded-xl w-full h-70 object-cover"
      />

      {/* Hover Overlay */}
      {hover && (
        <div className="absolute inset-0 bg-grey bg-opacity-20 flex items-center justify-center rounded">
          {/* Download button or direct link */}
          <a
            href={template.canvaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold px-4 py-2 bg-[#173628] rounded hover:bg-[#173628] transition-colors"
          >
            Get Canva Template
          </a>
        </div>
      )}
    </div>
  );
}
