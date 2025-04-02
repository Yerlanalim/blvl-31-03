/**
 * Script to upload test artifacts to Firebase Storage and create corresponding entries in Firestore
 * 
 * This script will:
 * 1. Use Firebase Admin SDK to access Firestore and Storage
 * 2. Upload test files to Firebase Storage
 * 3. Create entries in Firestore for each artifact
 * 4. Update level documents with references to artifacts
 * 
 * Prerequisites:
 * - Firebase project is set up
 * - Service account key is downloaded and available
 * - Test files are placed in the sample-files directory
 * 
 * Usage:
 * node src/scripts/upload-artifacts.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key file
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

// Initialize Firebase Admin SDK
let app;
try {
  if (admin.apps.length === 0) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bizlevel-app.appspot.com"
    });
  } else {
    app = admin.apps[0];
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Constants
const ARTIFACTS_PATH = 'artifacts';
const ARTIFACTS_COLLECTION = 'artifacts';
const LEVELS_COLLECTION = 'levels';
const SAMPLE_FILES_DIR = path.resolve(process.cwd(), 'sample-files');

// Make sure sample-files directory exists
if (!fs.existsSync(SAMPLE_FILES_DIR)) {
  fs.mkdirSync(SAMPLE_FILES_DIR, { recursive: true });
  console.log(`Created ${SAMPLE_FILES_DIR} directory`);
}

// Test artifact data
const testArtifacts = [
  // Level 1 artifacts
  {
    title: "Базовый шаблон бизнес-плана",
    description: "Полный шаблон бизнес-плана с инструкциями и примерами для начинающих предпринимателей.",
    file: "business-plan-template.pdf",
    type: "application/pdf",
    levelId: "level-1"
  },
  {
    title: "Таблица финансового планирования",
    description: "Excel-таблица для прогнозирования доходов и расходов на первый год работы бизнеса.",
    file: "financial-planning-spreadsheet.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    levelId: "level-1"
  },
  {
    title: "Чек-лист анализа рынка",
    description: "Подробный чек-лист для проведения анализа рынка и конкурентов.",
    file: "market-analysis-checklist.pdf",
    type: "application/pdf",
    levelId: "level-1"
  },

  // Level 2 artifacts
  {
    title: "Руководство по базовому маркетингу",
    description: "Подробное руководство по основам маркетинга для малого бизнеса.",
    file: "basic-marketing-guide.pdf",
    type: "application/pdf",
    levelId: "level-2"
  },
  {
    title: "Шаблон маркетингового плана",
    description: "Готовый шаблон для создания маркетингового плана с примерами и инструкциями.",
    file: "marketing-plan-template.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    levelId: "level-2"
  },
  {
    title: "Калькулятор ROI маркетинговых кампаний",
    description: "Excel-инструмент для расчета возврата инвестиций в маркетинговые кампании.",
    file: "marketing-roi-calculator.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    levelId: "level-2"
  },

  // Level 3 artifacts
  {
    title: "Руководство по управлению персоналом",
    description: "Практическое руководство по основам управления персоналом в малом бизнесе.",
    file: "hr-management-guide.pdf",
    type: "application/pdf",
    levelId: "level-3"
  },
  {
    title: "Шаблон должностной инструкции",
    description: "Универсальный шаблон должностной инструкции с примерами для разных позиций.",
    file: "job-description-template.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    levelId: "level-3"
  },
  {
    title: "Калькулятор эффективности сотрудников",
    description: "Таблица для измерения и отслеживания эффективности работы сотрудников.",
    file: "employee-performance-calculator.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    levelId: "level-3"
  }
];

// Function to generate sample files
const generateSampleFiles = () => {
  console.log('Generating sample files...');
  
  testArtifacts.forEach(artifact => {
    const filePath = path.join(SAMPLE_FILES_DIR, artifact.file);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File ${artifact.file} already exists. Skipping.`);
      return;
    }
    
    // Generate a sample file based on type
    try {
      if (artifact.file.endsWith('.pdf')) {
        // Create a simple text file with .pdf extension
        fs.writeFileSync(filePath, `This is a sample PDF file for ${artifact.title}.\n\nDescription: ${artifact.description}`);
      } else if (artifact.file.endsWith('.docx')) {
        // Create a simple text file with .docx extension
        fs.writeFileSync(filePath, `This is a sample DOCX file for ${artifact.title}.\n\nDescription: ${artifact.description}`);
      } else if (artifact.file.endsWith('.xlsx')) {
        // Create a simple text file with .xlsx extension
        fs.writeFileSync(filePath, `This is a sample XLSX file for ${artifact.title}.\n\nDescription: ${artifact.description}`);
      }
      
      console.log(`Created sample file: ${filePath}`);
    } catch (error) {
      console.error(`Error creating sample file ${artifact.file}:`, error);
    }
  });
  
  console.log('Sample files generation completed.');
};

// Function to upload a file to Firebase Storage
const uploadFileToStorage = async (artifactId, localFilePath, fileType) => {
  try {
    const destination = `${ARTIFACTS_PATH}/${artifactId}/${path.basename(localFilePath)}`;
    
    // Upload file to Firebase Storage
    const uploadResponse = await bucket.upload(localFilePath, {
      destination,
      metadata: {
        contentType: fileType,
        metadata: {
          artifactId,
          uploadedAt: new Date().toISOString()
        }
      }
    });
    
    // Get download URL
    const [file] = uploadResponse;
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100' // Far future expiration
    });
    
    console.log(`Uploaded file ${localFilePath} to ${destination}`);
    return url;
  } catch (error) {
    console.error(`Error uploading file ${localFilePath}:`, error);
    throw error;
  }
};

// Function to create an artifact document in Firestore
const createArtifactDocument = async (artifactData) => {
  try {
    // Generate a custom ID for the artifact
    const artifactId = `artifact-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Add the artifact to Firestore
    await db.collection(ARTIFACTS_COLLECTION).doc(artifactId).set({
      ...artifactData,
      id: artifactId,
      downloadCount: 0,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Created artifact document with ID: ${artifactId}`);
    return artifactId;
  } catch (error) {
    console.error('Error creating artifact document:', error);
    throw error;
  }
};

// Function to update level document with artifact IDs
const updateLevelWithArtifacts = async (levelId, artifactIds) => {
  try {
    // Get the current level document
    const levelDoc = await db.collection(LEVELS_COLLECTION).doc(levelId).get();
    
    if (!levelDoc.exists) {
      console.error(`Level ${levelId} does not exist`);
      return;
    }
    
    // Get current relatedArtifactIds or initialize as empty array
    const levelData = levelDoc.data();
    const currentArtifactIds = levelData.relatedArtifactIds || [];
    
    // Add new artifact IDs (avoiding duplicates)
    const updatedArtifactIds = [...new Set([...currentArtifactIds, ...artifactIds])];
    
    // Update the level document
    await db.collection(LEVELS_COLLECTION).doc(levelId).update({
      relatedArtifactIds: updatedArtifactIds,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated level ${levelId} with artifact IDs: ${artifactIds.join(', ')}`);
  } catch (error) {
    console.error(`Error updating level ${levelId} with artifacts:`, error);
    throw error;
  }
};

// Main function to process all artifacts
const processArtifacts = async () => {
  console.log('Starting artifact upload process...');
  
  // Generate sample files if they don't exist
  generateSampleFiles();
  
  // Group artifacts by level
  const artifactsByLevel = {};
  
  // Process each artifact
  for (const artifact of testArtifacts) {
    try {
      const filePath = path.join(SAMPLE_FILES_DIR, artifact.file);
      
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File ${filePath} does not exist. Skipping artifact.`);
        continue;
      }
      
      // Create artifact document first to get an ID
      const artifactId = await createArtifactDocument({
        title: artifact.title,
        description: artifact.description,
        fileName: artifact.file,
        fileType: artifact.type,
        levelId: artifact.levelId
      });
      
      // Upload file to Storage
      const fileURL = await uploadFileToStorage(artifactId, filePath, artifact.type);
      
      // Update artifact document with file URL
      await db.collection(ARTIFACTS_COLLECTION).doc(artifactId).update({
        fileURL
      });
      
      console.log(`Processed artifact: ${artifact.title} (ID: ${artifactId})`);
      
      // Add to artifactsByLevel for later level updates
      if (!artifactsByLevel[artifact.levelId]) {
        artifactsByLevel[artifact.levelId] = [];
      }
      artifactsByLevel[artifact.levelId].push(artifactId);
      
    } catch (error) {
      console.error(`Error processing artifact ${artifact.title}:`, error);
    }
  }
  
  // Update levels with artifact IDs
  for (const [levelId, artifactIds] of Object.entries(artifactsByLevel)) {
    try {
      await updateLevelWithArtifacts(levelId, artifactIds);
    } catch (error) {
      console.error(`Error updating level ${levelId}:`, error);
    }
  }
  
  console.log('Artifact upload process completed.');
};

// Execute the main function
processArtifacts()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 