"use client";

import { useState } from "react";
import { useAuth } from "../../../lib/useAuth";
import { useRouter } from "next/navigation";
import { uploadBulkTemplates } from "../../../lib/uploadTemplates";

export default function UploadTemplatesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      // Parse the JSON input
      const templates = JSON.parse(jsonInput);
      
      // Validate templates
      if (!Array.isArray(templates)) {
        throw new Error("Input must be an array of templates");
      }

      // Validate each template has required fields
      const requiredFields = ['title', 'category', 'format', 'language', 'imageUrl', 'canvaUrl'];
      for (const template of templates) {
        const missingFields = requiredFields.filter(field => !template[field]);
        if (missingFields.length > 0) {
          throw new Error(`Template missing required fields: ${missingFields.join(', ')}`);
        }
      }

      // Upload templates
      await uploadBulkTemplates(templates);
      
      setSuccess(true);
      setJsonInput(""); // Clear input after successful upload
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Templates</h1>
        
        <div className="bg-[#11231C] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Template Structure</h2>
          <pre className="bg-[#0C1813] p-4 rounded-lg mb-6 overflow-x-auto">
            {JSON.stringify({
              title: "Template Title",
              description: "Template Description",
              category: "FOOD | DRINK | FASHION | BEAUTY | HEALTH",
              format: "Feed | Story",
              language: "LT | EN",
              imageUrl: "https://example.com/image.jpg",
              canvaUrl: "https://canva.com/template",
              popularity: 0,
              savedCount: 0
            }, null, 2)}
          </pre>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Paste JSON Array of Templates
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 bg-[#0C1813] text-white p-4 rounded-lg font-mono"
              placeholder="Paste your JSON array here..."
            />
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 text-green-500 p-4 rounded-lg mb-4">
              Templates uploaded successfully!
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !jsonInput.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              uploading || !jsonInput.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#0C1813] hover:bg-[#1a3429]"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Templates"}
          </button>
        </div>

        <div className="mt-8 bg-[#11231C] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Example JSON</h2>
          <pre className="bg-[#0C1813] p-4 rounded-lg overflow-x-auto">
            {JSON.stringify([
              {
                title: "Food Template 1",
                description: "Beautiful food template",
                category: "FOOD",
                format: "Feed",
                language: "EN",
                imageUrl: "https://example.com/image1.jpg",
                canvaUrl: "https://canva.com/template1",
                popularity: 0,
                savedCount: 0
              },
              {
                title: "Fashion Template 1",
                description: "Elegant fashion template",
                category: "FASHION",
                format: "Story",
                language: "LT",
                imageUrl: "https://example.com/image2.jpg",
                canvaUrl: "https://canva.com/template2",
                popularity: 0,
                savedCount: 0
              }
            ], null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 