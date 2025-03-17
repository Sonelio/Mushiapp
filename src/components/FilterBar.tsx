"use client";

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
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
          <span className="text-sm text-gray-400">{totalSelected} selected</span>
          <button
            onClick={clearAllSelections}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Industry Filter */}
      <div className="filter-section overflow-hidden">
        <h3 className="filter-section-title text-gray-300 font-semibold mb-2">Industry</h3>
        <div className="space-y-2">
          {industryOptions.map((industry) => (
            <div
              key={industry}
              onClick={() => toggleSelection(industry, selectedIndustry, setSelectedIndustry)}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors w-full flex items-center justify-between ${
                selectedIndustry.includes(industry)
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                width: "100%",
                boxSizing: "border-box"
              }}
              data-selected={selectedIndustry.includes(industry)}
            >
              <span className="uppercase">{industry}</span>
              <img 
                src={selectedIndustry.includes(industry) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                alt=""
                className="w-4 h-4 object-contain"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Format Filter */}
      <div className="filter-section overflow-hidden">
        <h3 className="filter-section-title text-gray-300 font-semibold mb-2">Format</h3>
        <div className="space-y-2">
          {formatOptions.map((format) => (
            <div
              key={format}
              onClick={() => toggleSelection(format, selectedFormat, setSelectedFormat)}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors w-full flex items-center justify-between ${
                selectedFormat.includes(format)
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                width: "100%",
                boxSizing: "border-box"
              }}
              data-selected={selectedFormat.includes(format)}
            >
              <span className="uppercase">{format}</span>
              <img 
                src={selectedFormat.includes(format) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                alt=""
                className="w-4 h-4 object-contain"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="filter-section overflow-hidden">
        <h3 className="filter-section-title text-gray-300 font-semibold mb-2">Language</h3>
        <div className="space-y-2">
          {languageOptions.map((language) => (
            <div
              key={language}
              onClick={() => toggleSelection(language, selectedLanguage, setSelectedLanguage)}
              className={`filter-option cursor-pointer px-3 py-2 rounded-md transition-colors w-full flex items-center justify-between ${
                selectedLanguage.includes(language)
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:bg-[#1a3429]"
              }`}
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                width: "100%",
                boxSizing: "border-box"
              }}
              data-selected={selectedLanguage.includes(language)}
            >
              <span className="uppercase">{language}</span>
              <img 
                src={selectedLanguage.includes(language) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                alt=""
                className="w-4 h-4 object-contain"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}