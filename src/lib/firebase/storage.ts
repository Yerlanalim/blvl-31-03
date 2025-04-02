import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage as getFirebaseStorage } from 'firebase/storage';
import { storage } from './config';

// Constants for base paths in Storage
export const AVATARS_PATH = 'avatars';
export const ARTIFACTS_PATH = 'artifacts';

/**
 * Returns a Firebase Storage instance
 * @returns Firebase Storage instance
 */
export const getStorage = () => {
  return storage;
};

/**
 * Uploads a file to Firebase Storage
 * @param file File to upload
 * @param path Path to save the file (e.g., 'avatars/userId')
 * @param metadata Optional metadata for the file
 * @returns Promise with the URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string, metadata?: any): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${(error as Error).message}`);
  }
};

/**
 * Gets the download URL for a file in Storage
 * @param path Path to the file in Storage
 * @returns Promise with the download URL
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const fileRef = ref(storage, path);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error(`Failed to get file URL: ${(error as Error).message}`);
  }
};

/**
 * Deletes a file from Firebase Storage
 * @param path Path to the file in Storage
 * @returns Promise without a return value
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${(error as Error).message}`);
  }
};

/**
 * Uploads a user avatar
 * @param userId User ID
 * @param file Image file for the avatar
 * @returns Promise with the URL of the uploaded avatar
 */
export const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
  try {
    // Generate a unique filename based on userId and timestamp
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const filename = `${userId}_${timestamp}.${fileExtension}`;
    const path = `${AVATARS_PATH}/${userId}/${filename}`;
    
    // Set metadata for the file
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString()
      }
    };
    
    return await uploadFile(file, path, metadata);
  } catch (error) {
    console.error('Error uploading user avatar:', error);
    throw new Error(`Failed to upload user avatar: ${(error as Error).message}`);
  }
};

/**
 * Uploads an artifact file
 * @param artifactId Artifact ID
 * @param file File to upload
 * @returns Promise with the URL of the uploaded artifact
 */
export const uploadArtifactFile = async (artifactId: string, file: File): Promise<string> => {
  try {
    // Generate a unique filename based on artifactId and timestamp
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const filename = `${artifactId}_${timestamp}.${fileExtension}`;
    const path = `${ARTIFACTS_PATH}/${artifactId}/${filename}`;
    
    // Set metadata for the file
    const metadata = {
      contentType: file.type,
      customMetadata: {
        artifactId,
        originalFilename: file.name,
        uploadedAt: new Date().toISOString()
      }
    };
    
    return await uploadFile(file, path, metadata);
  } catch (error) {
    console.error('Error uploading artifact file:', error);
    throw new Error(`Failed to upload artifact file: ${(error as Error).message}`);
  }
}; 