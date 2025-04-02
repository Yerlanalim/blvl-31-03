import { where } from 'firebase/firestore';
import { 
  getDocumentById, 
  getDocuments, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  ARTIFACTS_COLLECTION,
  incrementCounter
} from '../firebase/firestore';
import { 
  uploadArtifactFile, 
  deleteFile, 
  ARTIFACTS_PATH 
} from '../firebase/storage';
import { Artifact } from '@/types';

/**
 * Gets the list of artifacts with optional filtering by level
 * @param filters Optional filters for the artifacts
 * @returns Promise with array of artifacts
 */
export const getArtifacts = async (filters?: { levelId?: string }): Promise<Artifact[]> => {
  try {
    const queryConstraints = [];
    
    if (filters?.levelId) {
      queryConstraints.push(where('levelId', '==', filters.levelId));
    }
    
    return await getDocuments<Artifact>(ARTIFACTS_COLLECTION, queryConstraints);
  } catch (error) {
    console.error('Error getting artifacts:', error);
    throw new Error(`Failed to get artifacts: ${(error as Error).message}`);
  }
};

/**
 * Gets an artifact by its ID
 * @param artifactId ID of the artifact
 * @returns Promise with the artifact or null if not found
 */
export const getArtifactById = async (artifactId: string): Promise<Artifact | null> => {
  try {
    return await getDocumentById<Artifact>(ARTIFACTS_COLLECTION, artifactId);
  } catch (error) {
    console.error(`Error getting artifact with ID ${artifactId}:`, error);
    throw new Error(`Failed to get artifact: ${(error as Error).message}`);
  }
};

/**
 * Creates a new artifact with the provided data and file
 * @param artifactData Data for the new artifact (without id, downloadCount, and uploadedAt)
 * @param file File to upload
 * @returns Promise with the ID of the created artifact
 */
export const createArtifact = async (
  artifactData: Omit<Artifact, 'id' | 'downloadCount' | 'uploadedAt'>, 
  file: File
): Promise<string> => {
  try {
    // First create the artifact document to get an ID
    const artifactId = await createDocument(ARTIFACTS_COLLECTION, {
      ...artifactData,
      downloadCount: 0,
      uploadedAt: new Date()
    });
    
    // Upload the file using the new artifact ID
    const fileURL = await uploadArtifactFile(artifactId, file);
    
    // Update the artifact with the file URL
    await updateDocument(ARTIFACTS_COLLECTION, artifactId, {
      fileURL,
      fileName: file.name,
      fileType: file.type
    });
    
    return artifactId;
  } catch (error) {
    console.error('Error creating artifact:', error);
    throw new Error(`Failed to create artifact: ${(error as Error).message}`);
  }
};

/**
 * Updates an existing artifact
 * @param artifactId ID of the artifact to update
 * @param artifactData Data to update
 * @param file Optional new file to upload
 * @returns Promise that resolves when the update is complete
 */
export const updateArtifact = async (
  artifactId: string, 
  artifactData: Partial<Artifact>, 
  file?: File
): Promise<void> => {
  try {
    if (file) {
      // If a new file is provided, upload it
      const fileURL = await uploadArtifactFile(artifactId, file);
      
      // Get the current artifact to check if we need to delete an old file
      const currentArtifact = await getArtifactById(artifactId);
      
      // Update the artifact with the new file data
      await updateDocument(ARTIFACTS_COLLECTION, artifactId, {
        ...artifactData,
        fileURL,
        fileName: file.name,
        fileType: file.type
      });
      
      // Delete the old file if it exists
      if (currentArtifact?.fileURL) {
        try {
          // Extract the path from the URL or use the URL directly
          // This will depend on how your storage paths are structured
          await deleteFile(`${ARTIFACTS_PATH}/${artifactId}`);
        } catch (deleteError) {
          console.warn('Error deleting old file, continuing anyway:', deleteError);
          // Continue with the update even if the old file deletion fails
        }
      }
    } else {
      // If no file is provided, just update the artifact data
      await updateDocument(ARTIFACTS_COLLECTION, artifactId, artifactData);
    }
  } catch (error) {
    console.error(`Error updating artifact with ID ${artifactId}:`, error);
    throw new Error(`Failed to update artifact: ${(error as Error).message}`);
  }
};

/**
 * Deletes an artifact and its associated file
 * @param artifactId ID of the artifact to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteArtifact = async (artifactId: string): Promise<void> => {
  try {
    // Get the artifact to find its file URL
    const artifact = await getArtifactById(artifactId);
    
    if (!artifact) {
      throw new Error(`Artifact with ID ${artifactId} not found`);
    }
    
    // Delete the document from Firestore
    await deleteDocument(ARTIFACTS_COLLECTION, artifactId);
    
    // Delete the file from Storage if it exists
    if (artifact.fileURL) {
      try {
        // Extract the path from the URL or use the URL directly
        await deleteFile(`${ARTIFACTS_PATH}/${artifactId}`);
      } catch (deleteError) {
        console.warn('Error deleting file, continuing anyway:', deleteError);
        // Continue with the deletion even if the file deletion fails
      }
    }
  } catch (error) {
    console.error(`Error deleting artifact with ID ${artifactId}:`, error);
    throw new Error(`Failed to delete artifact: ${(error as Error).message}`);
  }
};

/**
 * Gets multiple artifacts by their IDs
 * @param artifactIds Array of artifact IDs
 * @returns Promise with an array of artifacts
 */
export const getArtifactsByIds = async (artifactIds: string[]): Promise<Artifact[]> => {
  try {
    if (!artifactIds.length) {
      return [];
    }
    
    // Since Firestore doesn't have a direct "IN" query,
    // we'll fetch each artifact individually and combine them
    const artifactPromises = artifactIds.map(id => getArtifactById(id));
    
    const artifacts = await Promise.all(artifactPromises);
    
    // Filter out any null results (artifacts that weren't found)
    return artifacts.filter(artifact => artifact !== null) as Artifact[];
  } catch (error) {
    console.error('Error getting artifacts by IDs:', error);
    throw new Error(`Failed to get artifacts by IDs: ${(error as Error).message}`);
  }
};

/**
 * Gets all artifacts for a specific level
 * @param levelId ID of the level
 * @returns Promise with an array of artifacts for the level
 */
export const getLevelArtifacts = async (levelId: string): Promise<Artifact[]> => {
  try {
    return await getArtifacts({ levelId });
  } catch (error) {
    console.error(`Error getting artifacts for level ${levelId}:`, error);
    throw new Error(`Failed to get level artifacts: ${(error as Error).message}`);
  }
};

/**
 * Increments the download count for an artifact
 * @param artifactId ID of the artifact
 * @returns Promise that resolves when the update is complete
 */
export const incrementArtifactDownloadCount = async (artifactId: string): Promise<void> => {
  try {
    await incrementCounter(ARTIFACTS_COLLECTION, artifactId, 'downloadCount', 1);
  } catch (error) {
    console.error(`Error incrementing download count for artifact ${artifactId}:`, error);
    throw new Error(`Failed to increment download count: ${(error as Error).message}`);
  }
}; 