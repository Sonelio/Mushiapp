import { useState, useEffect } from "react";

export default function FilterBar({
  selectedIndustry,
  setSelectedIndustry,
  selectedFormat,
  setSelectedFormat,
  selectedLanguage,
  setSelectedLanguage,
}) {
  const toggleSelection = (value, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  // This component is now focused only on rendering the filter options
  // No more dropdown management - that's handled by the parent component
  return (
    <div className="flex flex-col gap-5">
      {/* Industry Filter Section */}
      <div className="filter-section">
        <div className="filter-section-title">Industry</div>
        <div className="space-y-1.5">
          {["Pets", "Food", "Fashion", "Health", "Electronics", "Supplements"].map((option) => (
            <div
              key={option}
              onClick={() => toggleSelection(option, selectedIndustry, setSelectedIndustry)}
              className={`filter-option px-3 py-1.5 cursor-pointer rounded text-sm ${
                selectedIndustry.includes(option) ? "selected" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Format Filter Section */}
      <div className="filter-section">
        <div className="filter-section-title">Format</div>
        <div className="space-y-1.5">
          {["Story", "Feed"].map((option) => (
            <div
              key={option}
              onClick={() => toggleSelection(option, selectedFormat, setSelectedFormat)}
              className={`filter-option px-3 py-1.5 cursor-pointer rounded text-sm ${
                selectedFormat.includes(option) ? "selected" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter Section */}
      <div className="filter-section">
        <div className="filter-section-title">Language</div>
        <div className="space-y-1.5">
          {["EN", "LT"].map((option) => (
            <div
              key={option}
              onClick={() => toggleSelection(option, selectedLanguage, setSelectedLanguage)}
              className={`filter-option px-3 py-1.5 cursor-pointer rounded text-sm ${
                selectedLanguage.includes(option) ? "selected" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}