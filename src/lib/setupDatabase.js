import { db } from "./firebaseConfig"; // Adjust path if necessary
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

async function ensureTemplateFields() {
  try {
    const templatesRef = collection(db, "templates");
    const snapshot = await getDocs(templatesRef);

    const updatePromises = snapshot.docs.map(async (document) => {
      const templateData = document.data();
      const templateRef = doc(db, "templates", document.id);
      const updates = {};

      // Ensure the template has a createdAt field
      if (!templateData.createdAt) {
        updates.createdAt = serverTimestamp();
      }

      // Ensure the template has a popularity field
      if (templateData.popularity === undefined) {
        updates.popularity = Math.floor(Math.random() * 100); // Assign random popularity
      }

      // Ensure the template has category (industry)
      if (!templateData.category) {
        updates.category = "Other"; // Default category if missing
      }

      // Ensure the template has a format field
      if (!templateData.format) {
        updates.format = "Story"; // Default format if missing
      }

      // Ensure the template has a language field
      if (!templateData.language) {
        updates.language = "EN"; // Default language if missing
      }

      // Only update if there are missing fields
      if (Object.keys(updates).length > 0) {
        await updateDoc(templateRef, updates);
      }
    });

    await Promise.all(updatePromises);
    console.log("✅ All templates have required fields for filtering!");
  } catch (error) {
    console.error("❌ Error updating templates:", error);
  }
}

// Run the script
ensureTemplateFields();
