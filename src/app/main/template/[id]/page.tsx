"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// Define the template interface
interface Template {
  id: string;
  title: string;
  description: string;
  industry: string;
  format: string;
  language: string;
  imageUrl?: string;
  [key: string]: any; // For any additional properties
}

export default function TemplateDetail() {
  const params = useParams();
  const id = params.id; // Properly access the id parameter
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      if (!id) return; // Guard against undefined id
      
      try {
        // Reference the document in the "templates" collection with the given id
        const docRef = doc(db, "templates", Array.isArray(id) ? id[0] : id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTemplate({ id: docSnap.id, ...docSnap.data() } as Template);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1E1E] text-white">
        <p>Loading template...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1E1E] text-white">
        <p>Template not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1E1E] text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>
      {/* Template Details */}
      <div className="bg-[#2A2F2E] p-6 rounded shadow">
        {template.imageUrl && (
          <img
            src={template.imageUrl}
            alt={template.title}
            className="rounded mb-4 w-full h-64 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="mb-4">{template.description}</p>
        <div className="text-sm">
          <p>
            <strong>Industry:</strong> {template.industry}
          </p>
          <p>
            <strong>Format:</strong> {template.format}
          </p>
          <p>
            <strong>Language:</strong> {template.language}
          </p>
        </div>
      </div>
    </div>
  );
} 