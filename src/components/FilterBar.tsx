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
  // Calculate total selected items
  const totalSelected = selectedIndustry.length + selectedFormat.length + selectedLanguage.length;

  // Function to clear all selections
  const clearAllSelections = () => {
    setSelectedIndustry([]);
    setSelectedFormat([]);
    setSelectedLanguage([]);
  };

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
    "DRINK",
    "FOOD",
    "FASHION",
    "BEAUTY",
    "HEALTH"
  ];

  // Format options
  const formatOptions = [
    "Feed",
    "Story"
  ];

  // Language options
  const languageOptions = [
    "LT",
    "EN"
  ];

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-4'}`}>
      {/* Selection Count - Only show in mobile when not embedded */}
      {!embedded && totalSelected > 0 && (
        <div className="flex justify-start items-center mb-4 pb-4 border-b border-gray-700">
          <span className="text-sm text-gray-400">{totalSelected} selected</span>
        </div>
      )}

      {/* Industry Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title text-gray-300">Industry</h3>
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
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors ${
                selectedIndustry.includes(industry)
                  ? "text-white font-medium"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              data-selected={selectedIndustry.includes(industry)}
            >
              {industry}
            </div>
          ))}
        </div>
      </div>

      {/* Format Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title text-gray-300">Format</h3>
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
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors ${
                selectedFormat.includes(format)
                  ? "text-white font-medium"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              data-selected={selectedFormat.includes(format)}
            >
              {format}
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title text-gray-300">Language</h3>
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
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors ${
                selectedLanguage.includes(language)
                  ? "text-white font-medium"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              data-selected={selectedLanguage.includes(language)}
            >
              {language}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}