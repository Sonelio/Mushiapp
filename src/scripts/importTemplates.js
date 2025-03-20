const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parse');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to import from JSON
async function importFromJSON(filePath) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const batch = db.batch();
    const templatesRef = db.collection('templates');

    jsonData.forEach(template => {
      const docRef = templatesRef.doc();
      batch.set(docRef, {
        ...template,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log('Successfully imported templates from JSON!');
  } catch (error) {
    console.error('Error importing from JSON:', error);
  }
}

// Function to import from CSV
async function importFromCSV(filePath) {
  try {
    const templates = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        templates.push({
          title: row.title,
          description: row.description,
          category: row.category,
          format: row.format,
          language: row.language,
          imageUrl: row.imageUrl,
          canvaUrl: row.canvaUrl,
          popularity: parseInt(row.popularity) || 0,
          savedCount: parseInt(row.savedCount) || 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      })
      .on('end', async () => {
        const batch = db.batch();
        const templatesRef = db.collection('templates');

        templates.forEach(template => {
          const docRef = templatesRef.doc();
          batch.set(docRef, template);
        });

        await batch.commit();
        console.log('Successfully imported templates from CSV!');
      });
  } catch (error) {
    console.error('Error importing from CSV:', error);
  }
}

// Example usage:
// importFromJSON('./templates.json');
// importFromCSV('./templates.csv'); 