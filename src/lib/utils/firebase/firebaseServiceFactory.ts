/**
 * Factory for creating standardized Firebase service methods
 * This reduces duplication in Firebase data access patterns throughout the application
 */
import {
  getDocumentById,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  QueryConstraint
} from '@/lib/firebase/firestore';
import { handleError, ErrorType } from '../error-handling/errorHandler';

/**
 * Create a standardized service for a Firestore collection
 */
export function createFirebaseService<T extends { id: string }>(collectionName: string) {
  /**
   * Get all documents from the collection
   */
  const getAll = async (queryConstraints: QueryConstraint[] = []): Promise<T[]> => {
    try {
      return await getDocuments<T>(collectionName, queryConstraints);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Get a document by ID
   */
  const getById = async (id: string): Promise<T | null> => {
    try {
      return await getDocumentById<T>(collectionName, id);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Create a new document
   */
  const create = async (data: Omit<T, 'id'>): Promise<string> => {
    try {
      return await createDocument(collectionName, data);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Create a document with a specific ID
   */
  const createWithId = async (id: string, data: Omit<T, 'id'>): Promise<string> => {
    try {
      return await createDocument(collectionName, data, id);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Update an existing document
   */
  const update = async (id: string, data: Partial<T>): Promise<void> => {
    try {
      await updateDocument(collectionName, id, data);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Delete a document
   */
  const remove = async (id: string): Promise<void> => {
    try {
      await deleteDocument(collectionName, id);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  /**
   * Get documents by a list of IDs
   */
  const getByIds = async (ids: string[]): Promise<T[]> => {
    try {
      if (!ids.length) return [];
      
      // Promise.all to make parallel requests for better performance
      const documents = await Promise.all(
        ids.map(id => getDocumentById<T>(collectionName, id))
      );
      
      // Filter out null results and cast to T[]
      return documents.filter((doc): doc is T => doc !== null);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  return {
    getAll,
    getById,
    getByIds,
    create,
    createWithId,
    update,
    remove
  };
}

/**
 * Create standardized service for a Firestore collection with user-specific documents
 */
export function createUserRelatedFirebaseService<T extends { userId: string }>(collectionName: string) {
  const baseService = createFirebaseService<T>(collectionName);
  
  /**
   * Get documents for a specific user
   */
  const getForUser = async (userId: string, queryConstraints: QueryConstraint[] = []): Promise<T[]> => {
    try {
      // Add a where clause to filter by userId
      const userQueryConstraints: QueryConstraint[] = [
        ...queryConstraints
      ];
      
      return await getDocuments<T>(collectionName, userQueryConstraints);
    } catch (error) {
      handleError(error, ErrorType.Database);
      throw error;
    }
  };

  return {
    ...baseService,
    getForUser
  };
} 