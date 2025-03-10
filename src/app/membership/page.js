"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../lib/useAuth";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import FilterBar from "../../components/FilterBar";
import TemplateCard from "../../components/TemplateCard";

export default function MembershipPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [fetchingTemplates, setFetchingTemplates] = useState(true);
  const [userSavedTemplates, setUserSavedTemplates] = useState([]);

  const [sortOption, setSortOption] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [visibleTemplates, setVisibleTemplates] = useState(20);
  const observer = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
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

  // Apply filtering based on selected filters:
  let filteredTemplates = templates.filter((template) => {
    const industryMatch =
      selectedIndustry.length === 0 || selectedIndustry.includes(template.category);
    const formatMatch =
      selectedFormat.length === 0 || selectedFormat.includes(template.format);
    const languageMatch =
      selectedLanguage.length === 0 || selectedLanguage.includes(template.language);
    return industryMatch && formatMatch && languageMatch;
  });

  // If sort option is "saved", only include saved templates.
  if (sortOption === "saved") {
    filteredTemplates = filteredTemplates.filter((template) =>
      userSavedTemplates.includes(template.id)
    );
  }

  // Sort the filtered templates properly
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      case "oldest":
        return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      case "popular":
      case "saved": // For saved, we also sort by popularity (saved ones only)
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  // Get total active filter count
  const activeFilterCount = selectedIndustry.length + selectedFormat.length + selectedLanguage.length;

  if (loading || fetchingTemplates) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Added a load more function for manual testing if needed
  const loadMore = () => {
    setVisibleTemplates(prev => prev + 20);
  };

  return (
    <div
      className="min-h-screen flex text-white relative"
      style={{
        background:
          "repeating-radial-gradient(circle at center, #0B0F0F 0, #0B0F0F 80px, #222 80px, #222 82px)",
      }}
    >
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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

      {/* MOBILE FILTER PANEL - Slides up from bottom when filterOpen is true */}
      <div 
        className={`md:hidden fixed inset-x-0 bottom-0 bg-[#0e1814] z-30 transition-transform duration-300 shadow-lg rounded-t-xl ${
          filterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 40px)" }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button 
              onClick={() => setFilterOpen(false)} 
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <FilterBar
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => setFilterOpen(false)}
              className="bg-[#0e1814] hover:bg-[#0e1814]/80 border border-white/30 text-white px-8 py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR - Contains both Filter and Sort */}
      <div className="fixed bottom-4 flex gap-3 z-20 w-full px-4">
{/* FILTER CONTROL - Left side */}
<div className="hidden md:flex">
  <div className="bg-[#0e1814]/90 backdrop-blur-md p-3 flex items-center shadow-md rounded-lg">
    <div className="relative">
      <button
        onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
        className="bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-4 py-2 rounded-md flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
        </svg>
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-[#11231C] px-1.5 py-0.5 rounded-full text-xs">
            {activeFilterCount}
          </span>
        )}
        <span className="ml-1">{desktopFilterOpen ? "▲" : "▼"}</span>
      </button>
      
      {/* Simplified filter dropdown */}
      {desktopFilterOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#11231C] text-white rounded-md shadow-lg z-30">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filters</h3>
              {activeFilterCount > 0 && (
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400">
                    {activeFilterCount} selected
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedIndustry([]);
                      setSelectedFormat([]);
                      setSelectedLanguage([]);
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
            
            <style jsx>{`
              /* Ensure the filter sections have a consistent background color */
              :global(.filter-section) {
                background-color: #11231C !important;
                padding: 0.5rem 0 !important;
                margin-bottom: 0.5rem !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
              }
              :global(.filter-section:last-child) {
                border-bottom: none !important;
                margin-bottom: 0 !important;
              }
              :global(.filter-section *) {
                background-color: transparent !important;
              }
              :global(.filter-option) {
                transition: background-color 0.15s ease;
              }
              :global(.filter-option:hover) {
                background-color: rgba(10, 25, 16, 0.7) !important;
              }
              :global(.filter-option.selected) {
                background-color: #0A1910 !important;
              }
              :global(.filter-section-title) {
                font-size: 0.8rem !important;
                font-weight: 500 !important;
                margin-bottom: 0.5rem !important;
                color: rgba(255, 255, 255, 0.7) !important;
              }
            `}</style>
            
            <div className="max-h-[40vh] overflow-y-auto pr-2">
              <FilterBar
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                embedded={true}
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setDesktopFilterOpen(false)}
                className="bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-4 py-1.5 rounded text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

        {/* MOBILE FILTER BUTTON and RIGHT-SIDE CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 ml-auto">
          {/* MOBILE FILTER BUTTON - Only visible on mobile */}
          <button 
            onClick={() => setFilterOpen(true)}
            className="md:hidden bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
            </svg>
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-[#11231C] px-1.5 py-0.5 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* SORT DROPDOWN & CARD COUNT */}
          <div className="bg-[#0e1814]/90 backdrop-blur-md p-3 flex items-center space-x-4 shadow-md rounded-lg">
            <span className="text-sm text-gray-200 hidden sm:inline">
              {sortedTemplates.length} results
            </span>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-4 py-2 rounded-md flex items-center"
              >
                <span className="hidden sm:inline">Sort By </span>
                <span>{sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}</span>
                <span className="ml-1">{sortOpen ? "▲" : "▼"}</span>
              </button>
              {sortOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-40 bg-[#0e1814] text-white rounded-md shadow-lg z-10">
                  {["popular", "newest", "oldest", "saved"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setSortOpen(false);
                      }}
                      className={`block px-4 py-2 w-full text-left hover:bg-[#122017] ${
                        sortOption === option ? "bg-[#122017]" : ""
                      }`}                  
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Support button */}
<button 
  onClick={() => {
    // If you've added the toast component
    if (typeof addToast === 'function') {
      addToast("Support chat will be available soon!", TOAST_TYPES.INFO);
    }
    
    // You can also open a mailto link
    window.open("mailto:nojus@mushi.agency?subject=Support Request");
  }}
  className="bg-[#0e1814] hover:bg-[#0e1814]/80 text-white px-5 py-3 rounded-full shadow-lg transition-colors duration-200"
>
  <span className="hidden sm:inline">Support</span>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
</button>
        </div>
      </div>
    </div>
  );
}