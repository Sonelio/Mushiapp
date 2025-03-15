"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../../lib/useAuth";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import FilterBar from "../../../components/FilterBar";
import TemplateCard from "../../../components/TemplateCard";

export default function MembershipPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [fetchingTemplates, setFetchingTemplates] = useState(true);
  const [error, setError] = useState(null);
  const [userSavedTemplates, setUserSavedTemplates] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const [sortOption, setSortOption] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(null);

  const [visibleTemplates, setVisibleTemplates] = useState(20);
  const observer = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filterPanelRef = useRef(null);
  const filterButtonRef = useRef(null);

  // Handle clicks outside the filter panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterOpen && 
          filterPanelRef.current && 
          filterButtonRef.current &&
          !filterPanelRef.current.contains(event.target) &&
          !filterButtonRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  // Check if we're on a mobile device
  useEffect(() => {
    // Function to handle resize
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Updated lastTemplateElementRef with better handling
  const lastTemplateElementRef = useCallback(node => {
    if (loading || fetchingTemplates || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleTemplates < sortedTemplates.length) {
        setIsLoadingMore(true);
        
        // Use setTimeout to ensure state updates are processed separately
        setTimeout(() => {
          setVisibleTemplates(prevVisibleTemplates => {
            return prevVisibleTemplates + 20;
          });
          
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 300);
        }, 300);
      }
    }, { threshold: 0.1 });
    
    if (node) observer.current.observe(node);
  }, [loading, fetchingTemplates, isLoadingMore]);

  // Separate filter states:
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Fetch templates from Firestore
    const templatesRef = collection(db, "templates");
    const unsubscribe = onSnapshot(
      templatesRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTemplates(data);
        setFetchingTemplates(false);
      },
      (error) => {
        console.error("Error fetching templates:", error);
        setFetchingTemplates(false);
      }
    );

    // Fetch user's saved templates (favorites)
    const fetchSavedTemplates = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().savedTemplates) {
          setUserSavedTemplates(userDoc.data().savedTemplates);
        } else {
          // Initialize savedTemplates if missing
          await updateDoc(userDocRef, { savedTemplates: [] });
          setUserSavedTemplates([]);
        }
      } catch (error) {
        console.error("Error fetching saved templates:", error);
        setUserSavedTemplates([]);
      }
    };

    fetchSavedTemplates();
    return () => unsubscribe();
  }, [user, loading, router]);

  // Toggle saving (favoriting) a template
  const toggleSaveTemplate = async (templateId) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const isSaved = userSavedTemplates.includes(templateId);
      const updatedSavedTemplates = isSaved
        ? userSavedTemplates.filter((id) => id !== templateId)
        : [...userSavedTemplates, templateId];

      await updateDoc(userDocRef, { savedTemplates: updatedSavedTemplates });
      setUserSavedTemplates(updatedSavedTemplates);
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  // Memoize filtered and sorted templates
  const sortedTemplates = useMemo(() => {
    // First filter the templates
    let filtered = templates.filter((template) => {
      const industryMatch =
        selectedIndustry.length === 0 || selectedIndustry.includes(template.category);
      const formatMatch =
        selectedFormat.length === 0 || selectedFormat.includes(template.format);
      const languageMatch =
        selectedLanguage.length === 0 || selectedLanguage.includes(template.language);
      return industryMatch && formatMatch && languageMatch;
    });

    // If sort option is "saved", filter to only show saved templates
    if (sortOption === "saved") {
      filtered = filtered.filter((template) => userSavedTemplates.includes(template.id));
    }

    // Sort the filtered templates
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case "oldest":
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case "popular":
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });
  }, [templates, selectedIndustry, selectedFormat, selectedLanguage, sortOption, userSavedTemplates]);

  // Get total active filter count
  const activeFilterCount = selectedIndustry.length + selectedFormat.length + selectedLanguage.length;

  if (loading || fetchingTemplates) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <div className="text-red-500 text-xl">⚠️ Error loading templates</div>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Added a load more function for manual testing if needed
  const loadMore = () => {
    setVisibleTemplates(prev => prev + 20);
  };

  return (
    <div
      className="min-h-screen flex text-white relative pt-6"
      style={{
        background: "#000000"
      }}
    >
      <style jsx>{`
        @media (min-width: 1280px) and (max-width: 1440px) {
          .template-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 py-2">
        <div className="template-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
          {sortedTemplates.slice(0, visibleTemplates).map((item, index) => {
            // Only add the ref to the last item if there are more items to load
            if (index === visibleTemplates - 1 && visibleTemplates < sortedTemplates.length) {
              return (
                <TemplateCard
                  ref={lastTemplateElementRef}
                  key={item.id}
                  template={item}
                  isSaved={userSavedTemplates.includes(item.id)}
                  onToggleSave={() => toggleSaveTemplate(item.id)}
                />
              );
            } else {
              return (
                <TemplateCard
                  key={item.id}
                  template={item}
                  isSaved={userSavedTemplates.includes(item.id)}
                  onToggleSave={() => toggleSaveTemplate(item.id)}
                />
              );
            }
          })}
          {sortedTemplates.length === 0 && (
            <p className="text-gray-400 text-center col-span-full">
              No templates found.
            </p>
          )}
        </div>

        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="flex justify-center mt-6">
            <div className="text-white">Loading more templates...</div>
          </div>
        )}

        {/* Fallback "Load More" button in case infinite scroll doesn't work */}
        {!isLoadingMore && visibleTemplates < sortedTemplates.length && (
          <div className="flex justify-center mt-6 pb-20">
            <button 
              onClick={loadMore}
              className="bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-4 py-2 rounded-md"
            >
              Load More ({sortedTemplates.length - visibleTemplates} remaining)
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-between items-center z-20 w-full">
        <div className="flex items-center gap-3 mx-4">
          <button
            ref={filterButtonRef}
            onClick={() => setFilterOpen(!filterOpen)}
            className="bg-[#11231C] text-white w-[280px] h-[60px] rounded-lg flex items-center justify-end pr-6 relative"
          >
            <img 
              src={filterOpen ? "/mobile-filter2.png" : "/mobile-filter1.png"}
              alt="Filter icon"
              className="md:hidden w-6 h-6 object-contain absolute left-5"
            />
            <span className="uppercase text-2xl font-semibold">
              Filters & Sort {activeFilterCount > 0 && `(${activeFilterCount})`}
            </span>
          </button>

          <button
            onClick={() => window.open('mailto:support@example.com')}
            className="bg-[#11231C] text-white w-[64px] h-[60px] rounded-lg flex items-center justify-center"
          >
            <img
              src="/mobile-support1.png"
              alt="Support icon"
              className="w-7 h-7 object-contain"
            />
          </button>
        </div>

        {/* MOBILE FILTER PANEL */}
        <div 
          ref={filterPanelRef}
          className={`md:hidden absolute bottom-full left-0 right-0 bg-[#11231C] z-30 transition-all duration-300 shadow-lg rounded-xl mx-4 ${
            filterOpen ? 'opacity-100 translate-y-0 mb-4' : 'opacity-0 translate-y-1/4 pointer-events-none'
          }`}
          style={{ maxHeight: "80vh" }}
        >
          <div className="p-4 overflow-y-auto flex flex-col" style={{ maxHeight: "calc(80vh - 40px)" }}>
            {/* Sort Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold uppercase mb-4 text-center">Sort By</h3>
              <div className="flex items-center justify-between px-2">
                {["popular", "oldest", "newest", "saved"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortOption(option)}
                    className={`px-3 py-2 text-[13px] font-bold uppercase rounded-lg ${
                      sortOption === option 
                        ? "bg-[#0C1813] text-white" 
                        : "bg-[#10221B] text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold uppercase mb-4 text-center">Industry</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {["FOOD", "DRINK", "FASHION", "BEAUTY", "HEALTH"].map((industry) => (
                  <button
                    key={industry}
                    onClick={() => {
                      if (selectedIndustry.includes(industry)) {
                        setSelectedIndustry(selectedIndustry.filter(i => i !== industry));
                      } else {
                        setSelectedIndustry([...selectedIndustry, industry]);
                      }
                    }}
                    className={`px-4 py-2 text-[15px] font-bold uppercase rounded-lg ${
                      selectedIndustry.includes(industry)
                        ? "bg-[#0C1813] text-white"
                        : "bg-[#10221B] text-gray-300"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Format and Language Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Format */}
              <div>
                <h3 className="text-2xl font-bold uppercase mb-4 text-center">Format</h3>
                <div className="flex gap-3 items-center justify-center">
                  {["Feed", "Story"].map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        if (selectedFormat.includes(format)) {
                          setSelectedFormat(selectedFormat.filter(f => f !== format));
                        } else {
                          setSelectedFormat([...selectedFormat, format]);
                        }
                      }}
                      className={`px-4 py-2 text-[15px] font-bold uppercase rounded-lg ${
                        selectedFormat.includes(format)
                          ? "bg-[#0C1813] text-white"
                          : "bg-[#10221B] text-gray-300"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-2xl font-bold uppercase mb-4 text-center">Language</h3>
                <div className="flex gap-3 items-center justify-center">
                  {["LT", "EN"].map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        if (selectedLanguage.includes(language)) {
                          setSelectedLanguage(selectedLanguage.filter(l => l !== language));
                        } else {
                          setSelectedLanguage([...selectedLanguage, language]);
                        }
                      }}
                      className={`px-4 py-2 text-[15px] font-bold uppercase rounded-lg ${
                        selectedLanguage.includes(language)
                          ? "bg-[#0C1813] text-white"
                          : "bg-[#10221B] text-gray-300"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 mb-4 text-center">
              <span className="text-[20px] font-semibold text-[#667B66]">
                {sortedTemplates.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR - Contains both Filter and Sort */}
      <div className="fixed bottom-4 flex justify-between z-20 w-full px-10" role="toolbar" aria-label="Template controls">
        {/* LEFT SIDE - Filters */}
        <div className="hidden md:flex items-center gap-2">
          {/* Industry Filter */}
          <div className="relative">
            <button
              onClick={() => setDesktopFilterOpen(prev => prev === 'industry' ? null : 'industry')}
              className="bg-[#10221B] text-white rounded-lg flex items-center"
              aria-expanded={desktopFilterOpen === 'industry'}
              aria-controls="industry-dropdown"
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                width: "155px",
                height: "60px",
                paddingLeft: "13px",
                paddingRight: "14px",
                boxSizing: "border-box"
              }}
            >
              <div className="flex items-center" style={{flex: "1"}}>
                <span className="uppercase text-xl font-semibold">Industry</span>
                {selectedIndustry.length > 0 && (
                  <span className="ml-1 text-xs">
                    {selectedIndustry.length}
                  </span>
                )}
              </div>
              <img 
                src="/filter-bar-1.png"
                alt="Filter icon"
                className="w-4 h-4 object-contain"
                aria-hidden="true"
                style={{marginLeft: "8px", flexShrink: 0}}
              />
            </button>
            
            {desktopFilterOpen === 'industry' && (
              <div 
                id="industry-dropdown"
                className="absolute bottom-full left-0 mb-2 w-[180px] bg-[#10221B] text-white rounded-lg shadow-lg z-30 overflow-hidden"
                role="dialog"
                aria-label="Industry options"
                onClick={(e) => e.stopPropagation()}
                style={{minWidth: "180px"}}
              >
                {["DRINK", "FOOD", "FASHION", "BEAUTY", "HEALTH"].map((industry) => (
                  <div
                    key={industry}
                    onClick={() => {
                      if (selectedIndustry.includes(industry)) {
                        setSelectedIndustry(selectedIndustry.filter(i => i !== industry));
                      } else {
                        setSelectedIndustry([...selectedIndustry, industry]);
                      }
                    }}
                    className={`cursor-pointer px-3 py-2 text-xl font-semibold text-left uppercase flex items-center justify-between ${
                      selectedIndustry.includes(industry)
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                    style={{
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "0.5rem 0.75rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{industry}</span>
                    <img 
                      src={selectedIndustry.includes(industry) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                      alt=""
                      className="w-4 h-4 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Format Filter */}
          <div className="relative">
            <button
              onClick={() => setDesktopFilterOpen(prev => prev === 'format' ? null : 'format')}
              className="bg-[#10221B] text-white rounded-lg flex items-center"
              aria-expanded={desktopFilterOpen === 'format'}
              aria-controls="format-dropdown"
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                width: "140px",
                height: "60px",
                paddingLeft: "13px",
                paddingRight: "16px",
                boxSizing: "border-box"
              }}
            >
              <div className="flex items-center" style={{flex: "1"}}>
                <span className="uppercase text-xl font-semibold">Format</span>
                {selectedFormat.length > 0 && (
                  <span className="ml-1 text-xs">
                    {selectedFormat.length}
                  </span>
                )}
              </div>
              <img 
                src="/filter-bar-1.png"
                alt="Filter icon"
                className="w-4 h-4 object-contain"
                aria-hidden="true"
                style={{marginLeft: "8px", flexShrink: 0}}
              />
            </button>
            
            {desktopFilterOpen === 'format' && (
              <div 
                id="format-dropdown"
                className="absolute bottom-full left-0 mb-2 w-[150px] bg-[#10221B] text-white rounded-lg shadow-lg z-30 overflow-hidden"
                role="dialog"
                aria-label="Format options"
                onClick={(e) => e.stopPropagation()}
                style={{minWidth: "150px"}}
              >
                {["Feed", "Story"].map((format) => (
                  <div
                    key={format}
                    onClick={() => {
                      if (selectedFormat.includes(format)) {
                        setSelectedFormat(selectedFormat.filter(f => f !== format));
                      } else {
                        setSelectedFormat([...selectedFormat, format]);
                      }
                    }}
                    className={`cursor-pointer px-3 py-2 text-xl font-semibold text-left uppercase flex items-center justify-between ${
                      selectedFormat.includes(format)
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                    style={{
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "0.5rem 0.75rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{format}</span>
                    <img 
                      src={selectedFormat.includes(format) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                      alt=""
                      className="w-4 h-4 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => setDesktopFilterOpen(prev => prev === 'language' ? null : 'language')}
              className="bg-[#10221B] text-white rounded-lg flex items-center"
              aria-expanded={desktopFilterOpen === 'language'}
              aria-controls="language-dropdown"
              style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                width: "175px",
                height: "60px",
                paddingLeft: "13px",
                paddingRight: "17px",
                boxSizing: "border-box"
              }}
            >
              <div className="flex items-center" style={{flex: "1"}}>
                <span className="uppercase text-xl font-semibold">Language</span>
                {selectedLanguage.length > 0 && (
                  <span className="ml-1 text-xs">
                    {selectedLanguage.length}
                  </span>
                )}
              </div>
              <img 
                src="/filter-bar-1.png"
                alt="Filter icon"
                className="w-4 h-4 object-contain"
                aria-hidden="true"
                style={{marginLeft: "8px", flexShrink: 0}}
              />
            </button>
            
            {desktopFilterOpen === 'language' && (
              <div 
                id="language-dropdown"
                className="absolute bottom-full left-0 mb-2 w-[180px] bg-[#10221B] text-white rounded-lg shadow-lg z-30 overflow-hidden"
                role="dialog"
                aria-label="Language options"
                onClick={(e) => e.stopPropagation()}
                style={{minWidth: "180px"}}
              >
                {["LT", "EN"].map((language) => (
                  <div
                    key={language}
                    onClick={() => {
                      if (selectedLanguage.includes(language)) {
                        setSelectedLanguage(selectedLanguage.filter(l => l !== language));
                      } else {
                        setSelectedLanguage([...selectedLanguage, language]);
                      }
                    }}
                    className={`cursor-pointer px-3 py-2 text-xl font-semibold text-left uppercase flex items-center justify-between ${
                      selectedLanguage.includes(language)
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                    style={{
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "0.5rem 0.75rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{language}</span>
                    <img 
                      src={selectedLanguage.includes(language) ? "/filter-bar-2.png" : "/filter-bar-3.png"}
                      alt=""
                      className="w-4 h-4 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Sort and Results */}
        <div className="hidden md:flex items-center gap-2">
          <div 
            className="bg-[#10221B] rounded-[10px] flex items-center px-4"
            style={{
              width: "274px",
              height: "60px",
              paddingLeft: "13px",
              paddingRight: "0px"
            }}
          >
            {/* SORT DROPDOWN */}
            <div className="relative border border-[#203C1F] rounded-[10px]">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="bg-[#203C1F] text-white rounded-[10px] flex items-center justify-between px-3"
                style={{
                  width: "130px",
                  height: "36px"
                }}
                aria-expanded={sortOpen}
                aria-controls="sort-dropdown"
                aria-label="Sort templates"
              >
                <span className="uppercase text-[20px] font-semibold">Sort</span>
                <img 
                  src="/filter-bar-1.png"
                  alt="Sort icon"
                  className="w-4 h-4 object-contain"
                  aria-hidden="true"
                />
              </button>
              {sortOpen && (
                <div 
                  id="sort-dropdown"
                  className="absolute bottom-full left-0 mb-2 w-[150px] bg-[#203C1F] text-white rounded-lg shadow-lg z-30"
                  role="listbox"
                  aria-label="Sort options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <div className="flex justify-between items-center px-3 py-1 border-b border-white/10">
                      <h3 className="font-bold text-xl uppercase">Sort By</h3>
                    </div>
                    {["popular", "newest", "oldest", "saved"].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setSortOpen(false);
                        }}
                        className={`cursor-pointer px-3 py-1 text-xl font-semibold text-left uppercase ${
                          sortOption === option 
                            ? "bg-[#10221B] text-white" 
                            : "text-gray-300"
                        }`}
                        role="option"
                        aria-selected={sortOption === option}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[20px] font-semibold text-[#667B66] ml-4" role="status">
              {sortedTemplates.length} results
            </span>
          </div>

          {/* Support Button */}
          <button
            onClick={() => window.open('mailto:support@example.com')}
            className="bg-[#10221B] text-white w-[150px] h-[60px] rounded-lg flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-2">
              <img
                src="/supporticon.png"
                alt="Support icon"
                className="w-6 h-6 object-contain"
              />
              <span className="uppercase text-xl font-semibold">Support</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}