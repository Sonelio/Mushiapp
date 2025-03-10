"use client";

import { useState, useEffect } from "react";

interface FilterBarProps {
  selectedIndustry: string[];
  setSelectedIndustry: (value: string[]) => void;
  selectedFormat: string[];
  setSelectedFormat: (value: string[]) => void;
  selectedLanguage: string[];
  setSelectedLanguage: (value: string[]) => void;
  embedded?: boolean;
}

export default function FilterBar({
  selectedIndustry,
  setSelectedIndustry,
  selectedFormat,
  setSelectedFormat,
  selectedLanguage,
  setSelectedLanguage,
  embedded = false,
}: FilterBarProps) {
  const toggleSelection = (
    value: string,
    selectedArray: string[],
    setSelectedArray: (value: string[]) => void
  ) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item: string) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  // Industry options
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "E-commerce",
    "Entertainment",
    "Travel",
    "Food & Beverage",
    "Real Estate",
    "Manufacturing",
  ];

  // Format options
  const formatOptions = [
    "Landing Page",
    "Dashboard",
    "Blog",
    "E-commerce",
    "Portfolio",
    "Documentation",
    "Admin Panel",
    "Mobile App",
  ];

  // Language options
  const languageOptions = [
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Svelte",
    "Node.js",
    "Python",
    "PHP",
  ];

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-4'}`}>
      {/* Industry Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Industry</h3>
        <div className="space-y-2">
          {industryOptions.map((industry) => (
            <div
              key={industry}
              onClick={() => {
                if (selectedIndustry.includes(industry)) {
                  setSelectedIndustry(selectedIndustry.filter((i) => i !== industry));
                } else {
                  setSelectedIndustry([...selectedIndustry, industry]);
                }
              }}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition ${
                selectedIndustry.includes(industry)
                  ? "bg-[#0A1910] text-white"
                  : "text-gray-300 hover:bg-[#0A1910]/70"
              }`}
            >
              {industry}
            </div>
          ))}
        </div>
      </div>

      {/* Format Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Format</h3>
        <div className="space-y-2">
          {formatOptions.map((format) => (
            <div
              key={format}
              onClick={() => {
                if (selectedFormat.includes(format)) {
                  setSelectedFormat(selectedFormat.filter((f) => f !== format));
                } else {
                  setSelectedFormat([...selectedFormat, format]);
                }
              }}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition ${
                selectedFormat.includes(format)
                  ? "bg-[#0A1910] text-white"
                  : "text-gray-300 hover:bg-[#0A1910]/70"
              }`}
            >
              {format}
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Language/Framework</h3>
        <div className="space-y-2">
          {languageOptions.map((language) => (
            <div
              key={language}
              onClick={() => {
                if (selectedLanguage.includes(language)) {
                  setSelectedLanguage(selectedLanguage.filter((l) => l !== language));
                } else {
                  setSelectedLanguage([...selectedLanguage, language]);
                }
              }}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition ${
                selectedLanguage.includes(language)
                  ? "bg-[#0A1910] text-white"
                  : "text-gray-300 hover:bg-[#0A1910]/70"
              }`}
            >
              {language}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}