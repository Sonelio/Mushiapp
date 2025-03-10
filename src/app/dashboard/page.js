"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // New state variables for filtering
  const [industryFilter, setIndustryFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchTemplates();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch templates from Firestore
  const fetchTemplates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "templates"));
      const templatesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Apply client-side filtering based on selected filters
  const filteredTemplates = templates.filter((template) => {
    return (
      (industryFilter === "All" || template.industry === industryFilter) &&
      (formatFilter === "All" || template.format === formatFilter) &&
      (languageFilter === "All" || template.language === languageFilter)
    );
  });

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.email}</h1>
      <button
        onClick={handleLogout}
        style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}
      >
        Logout
      </button>

      <h2>Available Templates</h2>

      {/* Filter Controls */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          Industry:
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="All">All</option>
            <option value="Retail">Retail</option>
            <option value="Fashion">Fashion</option>
            <option value="Tech">Tech</option>
            {/* Add additional industry options as needed */}
          </select>
        </label>

        <label style={{ marginRight: "1rem" }}>
          Format:
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="All">All</option>
            <option value="Static">Static</option>
            <option value="Video">Video</option>
            <option value="Carousel">Carousel</option>
            {/* Add additional format options as needed */}
          </select>
        </label>

        <label>
          Language:
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="All">All</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            {/* Add additional language options as needed */}
          </select>
        </label>
      </div>

      {/* Template List */}
      {loadingTemplates ? (
        <p>Loading templates...</p>
      ) : filteredTemplates.length > 0 ? (
        <ul>
          {filteredTemplates.map((template) => (
            <li key={template.id} style={{ marginBottom: "1rem" }}>
              <h3>{template.title}</h3>
              <p>{template.description}</p>
              <p>
                <strong>Industry:</strong> {template.industry}
              </p>
              <p>
                <strong>Format:</strong> {template.format}
              </p>
              <p>
                <strong>Language:</strong> {template.language}
              </p>
              {template.imageUrl && (
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  width="200"
                  style={{ display: "block", marginTop: "0.5rem" }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No templates available.</p>
      )}
    </div>
  );
}
