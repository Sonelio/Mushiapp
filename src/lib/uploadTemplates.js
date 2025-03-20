import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Example template structure
const templateStructure = {
  title: "",
  description: "",
  category: "", // FOOD, DRINK, FASHION, BEAUTY, HEALTH
  format: "", // Feed or Story
  language: "", // LT or EN
  imageUrl: "",
  canvaUrl: "",
  popularity: 0,
  savedCount: 0, // New field to track number of saves
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Upload a single template to Firebase
 * @param {Object} template - The template object to upload
 * @returns {Promise<string>} The ID of the uploaded template
 */
export async function uploadSingleTemplate(template) {
  try {
    const docRef = await addDoc(collection(db, "templates"), {
      ...template,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Template uploaded with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error uploading template:", error);
    throw error;
  }
}

/**
 * Upload multiple templates in bulk using Firestore batch writes
 * @param {Array<Object>} templates - Array of template objects to upload
 * @returns {Promise<void>}
 */
export async function uploadBulkTemplates(templates) {
  try {
    const batch = writeBatch(db);
    const templatesCollection = collection(db, "templates");

    // Add each template to the batch
    templates.forEach((template) => {
      // Use the title as the document ID (converted to a URL-friendly format)
      const docId = template.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      const docRef = doc(templatesCollection, docId);
      batch.set(docRef, {
        ...template,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Commit the batch
    await batch.commit();
    console.log(`Successfully uploaded ${templates.length} templates`);
  } catch (error) {
    console.error("Error uploading templates:", error);
    throw error;
  }
}

// Example usage:
/*
const templates = [
  {
    title: "Food Template 1",
    description: "Beautiful food template",
    category: "FOOD",
    format: "Feed",
    language: "EN",
    imageUrl: "https://example.com/image1.jpg",
    canvaUrl: "https://canva.com/template1",
    popularity: 0
  },
  // ... more templates
];

// Upload single template
await uploadSingleTemplate(templates[0]);

// Or upload multiple templates
await uploadBulkTemplates(templates);
*/ 