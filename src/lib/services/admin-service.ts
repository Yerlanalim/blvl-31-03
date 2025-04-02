import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit, 
  orderBy, 
  startAfter,
  QueryConstraint,
  DocumentData,
  addDoc,
  writeBatch,
  getFirestore,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { User, Level, Artifact, UserProgress } from '@/types';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { UploadResult } from 'firebase/storage';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail,
  updateEmail,
  deleteUser as deleteAuthUser,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { initializeUserProgress } from './progress-service';

/**
 * Get a list of users with optional filters
 * @param filters Optional filters: search (name/email) and role
 * @returns List of users
 */
export async function getUsers(filters?: { search?: string; role?: string; }): Promise<User[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Add role filter if provided
    if (filters?.role && filters.role !== 'all') {
      constraints.push(where('role', '==', filters.role));
    }
    
    // Add ordering by registration date (newest first)
    constraints.push(orderBy('createdAt', 'desc'));
    
    const usersQuery = query(collection(db, 'users'), ...constraints);
    const querySnapshot = await getDocs(usersQuery);
    
    let users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    // Apply search filter in memory if provided
    if (filters?.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      users = users.filter(user => 
        user.displayName?.toLowerCase().includes(searchLower) || 
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Get a specific user by ID
 * @param userId User ID
 * @returns User object or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as User;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error('Failed to fetch user');
  }
}

/**
 * Update user role
 * @param userId User ID
 * @param role New role
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      role,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error('Failed to update user role');
  }
}

/**
 * Delete a user (from both Firebase Auth and Firestore)
 * Note: Deleting from Auth requires the user to be recently authenticated.
 * In a real application with Admin SDK, this would be more straightforward.
 * @param userId User ID
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // First delete from Firestore
    await deleteDoc(doc(db, 'users', userId));
    
    // Also delete user progress
    try {
      await deleteDoc(doc(db, 'userProgress', userId));
    } catch (deleteProgressError) {
      console.warn(`Error deleting user progress for ${userId}:`, deleteProgressError);
      // Continue even if progress deletion fails
    }
    
    // Note: Deleting from Firebase Auth is not possible from client-side code
    // unless it's the currently authenticated user.
    // In a real app, you would use Firebase Admin SDK in a Cloud Function.
    console.warn("Note: User was deleted from Firestore but not from Firebase Auth. Use Firebase Console or Admin SDK to complete the deletion.");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(`Failed to delete user: ${(error as Error).message}`);
  }
}

/**
 * Get user statistics
 * @returns Object with totalUsers, activeUsers, and admins counts
 */
export async function getUserStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  admins: number;
}> {
  try {
    // Get total users
    const totalUsersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = totalUsersSnapshot.size;
    
    // Get admin users
    const adminsSnapshot = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'admin'))
    );
    const admins = adminsSnapshot.size;
    
    // For active users, we could define an active user as someone who logged in 
    // within the last 30 days, but this would require storing lastLoginAt in Firestore
    // For now, we'll estimate active users as 80% of total users
    const activeUsers = Math.round(totalUsers * 0.8);
    
    return {
      totalUsers,
      activeUsers,
      admins
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw new Error('Failed to fetch user statistics');
  }
}

/**
 * Get all levels for admin panel with more details than the user-facing version
 * @returns List of all levels with complete details
 */
export async function getLevelsAdmin(): Promise<Level[]> {
  try {
    const levelsQuery = query(
      collection(db, 'levels'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(levelsQuery);
    
    const levels = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Level[];
    
    return levels;
  } catch (error) {
    console.error("Error getting levels for admin:", error);
    throw new Error('Failed to fetch levels');
  }
}

/**
 * Create a new level
 * @param level Level data without ID
 * @returns ID of the newly created level
 */
export async function createLevel(level: Omit<Level, 'id'>): Promise<string> {
  try {
    const levelsCollection = collection(db, 'levels');
    const docRef = await addDoc(levelsCollection, {
      ...level,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating level:", error);
    throw new Error('Failed to create level');
  }
}

/**
 * Update an existing level
 * @param levelId ID of the level to update
 * @param levelData Partial level data to update
 */
export async function updateLevel(levelId: string, levelData: Partial<Level>): Promise<void> {
  try {
    const levelRef = doc(db, 'levels', levelId);
    
    await updateDoc(levelRef, {
      ...levelData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating level:", error);
    throw new Error('Failed to update level');
  }
}

/**
 * Delete a level
 * @param levelId ID of the level to delete
 */
export async function deleteLevel(levelId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'levels', levelId));
  } catch (error) {
    console.error("Error deleting level:", error);
    throw new Error('Failed to delete level');
  }
}

/**
 * Reorder levels by updating their order field
 * @param levelIds Array of level IDs in the desired order
 */
export async function reorderLevels(levelIds: string[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // Update each level's order property
    levelIds.forEach((levelId, index) => {
      const levelRef = doc(db, 'levels', levelId);
      batch.update(levelRef, { 
        order: index + 1,
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error reordering levels:", error);
    throw new Error('Failed to reorder levels');
  }
}

/**
 * Get all artifacts for admin panel
 * @returns List of all artifacts
 */
export async function getArtifactsAdmin(): Promise<Artifact[]> {
  try {
    const artifactsQuery = query(
      collection(db, 'artifacts'),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(artifactsQuery);
    
    const artifacts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date() // Convert Firestore timestamp to Date
    })) as Artifact[];
    
    return artifacts;
  } catch (error) {
    console.error("Error getting artifacts for admin:", error);
    throw new Error('Failed to fetch artifacts');
  }
}

/**
 * Create a new artifact with file upload
 * @param artifact Artifact data without ID, downloadCount, and uploadedAt
 * @param file File to upload
 * @returns ID of the newly created artifact
 */
export async function createArtifact(
  artifact: Omit<Artifact, 'id' | 'downloadCount' | 'uploadedAt'>, 
  file: File
): Promise<string> {
  try {
    // First create the artifact document to get an ID
    const artifactsCollection = collection(db, 'artifacts');
    const artifactData = {
      ...artifact,
      downloadCount: 0,
      uploadedAt: new Date()
    };
    
    const docRef = await addDoc(artifactsCollection, artifactData);
    const artifactId = docRef.id;
    
    // Get the Firebase storage reference
    const storageRef = ref(storage, `artifacts/${artifactId}/${file.name}`);
    
    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Create a promise that resolves when the upload is complete
    const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {}, // Progress callback (not needed here)
        (error) => reject(error), // Error callback
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              updateDoc(docRef, {
                fileURL: downloadURL,
                fileName: file.name,
                fileType: file.type
              });
              resolve(uploadTask.snapshot);
            })
            .catch(reject);
        }
      );
    });
    
    return artifactId;
  } catch (error) {
    console.error("Error creating artifact:", error);
    throw new Error('Failed to create artifact');
  }
}

/**
 * Update an existing artifact
 * @param artifactId ID of the artifact to update
 * @param artifactData Partial artifact data to update
 * @param file Optional new file to upload
 */
export async function updateArtifact(
  artifactId: string, 
  artifactData: Partial<Artifact>, 
  file?: File
): Promise<void> {
  try {
    const artifactRef = doc(db, 'artifacts', artifactId);
    
    if (file) {
      // Upload new file
      const storageRef = ref(storage, `artifacts/${artifactId}/${file.name}`);
      
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Create a promise that resolves when the upload is complete
      await new Promise<UploadResult>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {}, // Progress callback (not needed here)
          (error) => reject(error), // Error callback
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                updateDoc(artifactRef, {
                  ...artifactData,
                  fileURL: downloadURL,
                  fileName: file.name,
                  fileType: file.type,
                  updatedAt: new Date().toISOString()
                });
                resolve(uploadTask.snapshot);
              })
              .catch(reject);
          }
        );
      });
    } else {
      // Just update the document without file
      await updateDoc(artifactRef, {
        ...artifactData,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating artifact:", error);
    throw new Error('Failed to update artifact');
  }
}

/**
 * Delete an artifact and its file
 * @param artifactId ID of the artifact to delete
 */
export async function deleteArtifact(artifactId: string): Promise<void> {
  try {
    // Get the artifact to retrieve file URL
    const artifactDoc = await getDoc(doc(db, 'artifacts', artifactId));
    if (!artifactDoc.exists()) {
      throw new Error(`Artifact with ID ${artifactId} not found`);
    }
    
    const artifactData = artifactDoc.data();
    
    // Delete the document from Firestore
    await deleteDoc(doc(db, 'artifacts', artifactId));
    
    // If there's a file, attempt to delete it
    if (artifactData.fileURL) {
      try {
        // Create a reference to the file
        const fileRef = ref(storage, `artifacts/${artifactId}`);
        
        // Delete the file (and any other files in the directory)
        const listResult = await listAll(fileRef);
        const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
        await Promise.all(deletePromises);
      } catch (storageError) {
        console.warn(`Error deleting artifact files: ${storageError}`);
        // Continue regardless of file deletion errors
      }
    }
  } catch (error) {
    console.error("Error deleting artifact:", error);
    throw new Error('Failed to delete artifact');
  }
}

/**
 * Reset download count for an artifact
 * @param artifactId ID of the artifact
 */
export async function resetDownloadCount(artifactId: string): Promise<void> {
  try {
    const artifactRef = doc(db, 'artifacts', artifactId);
    
    await updateDoc(artifactRef, {
      downloadCount: 0,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error resetting download count:", error);
    throw new Error('Failed to reset download count');
  }
}

/**
 * Create a new user with email and password
 * @param email User's email
 * @param password User's password
 * @param userData User data (without id, email, and createdAt)
 * @returns ID of the newly created user
 */
export async function createUser(
  email: string, 
  password: string, 
  userData: Omit<User, 'id' | 'email' | 'createdAt'>
): Promise<string> {
  try {
    const auth = getAuth();
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name if provided
    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL || null
      });
    }
    
    // Create user document in Firestore
    const userDoc = {
      email: email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      role: userData.role || 'user',
      settings: userData.settings || {
        theme: 'system',
        notificationsEnabled: true
      },
      createdAt: new Date().toISOString()
    };
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, userDoc).catch(async () => {
      // If the document doesn't exist yet, create it
      await setDoc(doc(db, 'users', user.uid), userDoc);
    });
    
    // Initialize user progress
    await initializeUserProgress(user.uid);
    
    return user.uid;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${(error as Error).message}`);
  }
}

/**
 * Update user profile information
 * @param userId User ID
 * @param userData Partial user data to update
 */
export async function updateUserProfile(
  userId: string, 
  userData: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Update the Firestore document
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    
    // If email is being updated, also update in Auth
    if (userData.email) {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser && currentUser.uid === userId) {
        await updateEmail(currentUser, userData.email);
      } else {
        console.warn("Cannot update email in Firebase Auth: no matching authenticated user");
      }
    }
    
    // If displayName or photoURL is being updated, also update in Auth
    if (userData.displayName || userData.photoURL) {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser && currentUser.uid === userId) {
        await updateProfile(currentUser, {
          displayName: userData.displayName || currentUser.displayName,
          photoURL: userData.photoURL || currentUser.photoURL
        });
      } else {
        console.warn("Cannot update profile in Firebase Auth: no matching authenticated user");
      }
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(`Failed to update user profile: ${(error as Error).message}`);
  }
}

/**
 * Reset user password by sending a password reset email
 * @param email User's email
 */
export async function resetUserPassword(email: string): Promise<void> {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error(`Failed to reset password: ${(error as Error).message}`);
  }
}

/**
 * Get users with their progress information
 * @returns List of users with their progress information
 */
export async function getUsersWithProgress(): Promise<Array<User & {progress?: UserProgress}>> {
  try {
    // Get all users
    const users = await getUsers();
    
    // Get all user progress
    const progressQuery = query(collection(db, 'userProgress'));
    const progressSnapshot = await getDocs(progressQuery);
    
    // Create a map of userId -> progress
    const progressMap = new Map<string, UserProgress>();
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const progress = {
        id: doc.id,
        userId: doc.id,
        currentLevelId: data.currentLevelId || '',
        completedLevelIds: data.completedLevelIds || [],
        watchedVideoIds: data.watchedVideoIds || [],
        downloadedArtifactIds: data.downloadedArtifactIds || [],
        passedTestIds: data.passedTestIds || [],
        completedTestIds: data.completedTestIds || [],
        skillProgress: data.skillProgress || {},
        badges: data.badges || [],
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || ''
      } as UserProgress;
      
      progressMap.set(doc.id, progress);
    });
    
    // Combine users with their progress
    return users.map(user => ({
      ...user,
      progress: progressMap.get(user.id)
    }));
  } catch (error) {
    console.error("Error getting users with progress:", error);
    throw new Error('Failed to fetch users with progress');
  }
}

/**
 * Get download statistics for an artifact by time periods
 * @param artifactId ID of the artifact
 * @returns Object with download statistics for various time periods
 */
export async function getArtifactDownloadStats(artifactId: string): Promise<{
  daily: { date: string; count: number }[];
  monthly: { month: string; count: number }[];
  byLevel: { levelId: string; levelName: string; count: number }[];
  totalDownloads: number;
}> {
  try {
    // NOTE: In a real implementation, this would fetch actual data from Firestore
    // For now, we're generating mock data for the UI
    
    // Get the artifact
    const artifactRef = doc(db, 'artifacts', artifactId);
    const artifactDoc = await getDoc(artifactRef);
    
    if (!artifactDoc.exists()) {
      throw new Error('Artifact not found');
    }
    
    const artifact = {
      id: artifactDoc.id,
      ...artifactDoc.data()
    } as Artifact;
    
    // Get all levels for level names
    const levelsQuery = query(collection(db, 'levels'), orderBy('order', 'asc'));
    const levelsSnapshot = await getDocs(levelsQuery);
    const levels = levelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Level[];
    
    // Generate mock data based on the artifact's download count
    const totalDownloads = artifact.downloadCount || 0;
    
    // Generate daily data for the last 14 days
    const daily = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Higher counts for more recent days
      let count = Math.floor(Math.random() * Math.min(5, totalDownloads / 14));
      
      // Weekend adjustment (lower on weekends)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count = Math.max(0, count - 2);
      }
      
      daily.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    // Generate monthly data for the last 6 months
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().split('T')[0].substring(0, 7);
      
      monthly.push({
        month,
        count: Math.floor(Math.random() * Math.min(20, totalDownloads / 6))
      });
    }
    
    // Generate download distribution by level
    const byLevel = [];
    const levelCount = levels.length;
    let remainingPercentage = 100;
    
    for (let i = 0; i < levelCount; i++) {
      const isLast = i === levelCount - 1;
      const percentage = isLast 
        ? remainingPercentage 
        : Math.floor(Math.random() * Math.min(remainingPercentage, 50)) + 10;
      
      remainingPercentage -= percentage;
      
      byLevel.push({
        levelId: levels[i].id,
        levelName: levels[i].title,
        count: Math.round((percentage / 100) * totalDownloads)
      });
    }
    
    return {
      daily,
      monthly,
      byLevel,
      totalDownloads
    };
  } catch (error) {
    console.error("Error getting artifact download stats:", error);
    throw new Error('Failed to fetch artifact download statistics');
  }
}

/**
 * Get list of users who downloaded a specific artifact
 * @param artifactId ID of the artifact
 * @returns List of users with download timestamp
 */
export async function getArtifactDownloadUsers(artifactId: string): Promise<{
  userId: string;
  displayName: string;
  email: string;
  role: string;
  downloadedAt: string;
}[]> {
  try {
    // NOTE: In a real implementation, this would fetch actual data from Firestore
    // For now, we're generating mock data for the UI
    
    // Get the artifact
    const artifactRef = doc(db, 'artifacts', artifactId);
    const artifactDoc = await getDoc(artifactRef);
    
    if (!artifactDoc.exists()) {
      throw new Error('Artifact not found');
    }
    
    const artifact = {
      id: artifactDoc.id,
      ...artifactDoc.data()
    } as Artifact;
    
    // Get all users
    const usersQuery = query(collection(db, 'users'), limit(20));
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    // Generate mock download history
    const totalDownloads = artifact.downloadCount || 0;
    const numberOfUsers = Math.min(users.length, totalDownloads, 10); // Cap at 10 users for mock data
    
    const mockUsers = [];
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    // Generate random download dates within the last 30 days
    for (let i = 0; i < numberOfUsers; i++) {
      const user = shuffledUsers[i];
      const daysAgo = Math.floor(Math.random() * 30);
      const downloadDate = new Date();
      downloadDate.setDate(downloadDate.getDate() - daysAgo);
      
      mockUsers.push({
        userId: user.id,
        displayName: user.displayName || 'Unknown User',
        email: user.email || 'unknown@example.com',
        role: user.role || 'user',
        downloadedAt: downloadDate.toISOString()
      });
    }
    
    // Sort by download date (most recent first)
    return mockUsers.sort((a, b) => 
      new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
    );
  } catch (error) {
    console.error("Error getting artifact download users:", error);
    throw new Error('Failed to fetch users who downloaded this artifact');
  }
}

/**
 * Update artifact level association
 * @param artifactId Artifact ID
 * @param levelId Level ID
 */
export async function updateArtifactLevel(artifactId: string, levelId: string): Promise<void> {
  try {
    const artifactRef = doc(db, 'artifacts', artifactId);
    
    await updateDoc(artifactRef, {
      levelId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating artifact level:", error);
    throw new Error('Failed to update artifact level');
  }
}

// Firebase Direct Integration Functions

/**
 * Get collections from Firestore
 * @returns List of collection names
 */
export async function getCollections(): Promise<string[]> {
  try {
    // Since we can't directly get collections from client SDK,
    // we'll use a predefined list of common collections in the app
    const commonCollections = [
      'users', 
      'levels', 
      'artifacts', 
      'userProgress', 
      'faq', 
      'chatHistory'
    ];
    
    const existingCollections: string[] = [];
    
    for (const collName of commonCollections) {
      try {
        const docsSnapshot = await getDocs(collection(db, collName));
        if (docsSnapshot.size > 0 || collName === 'users') {  // Always include users collection
          existingCollections.push(collName);
        }
      } catch (error) {
        console.warn(`Collection ${collName} not found or not accessible`);
      }
    }
    
    return existingCollections.sort();
  } catch (error) {
    console.error("Error getting collections:", error);
    throw new Error('Failed to fetch collections');
  }
}

/**
 * Get documents from a collection
 * @param collectionName Name of the collection
 * @returns List of document IDs
 */
export async function getDocuments(collectionName: string): Promise<string[]> {
  try {
    const docsSnapshot = await getDocs(collection(db, collectionName));
    return docsSnapshot.docs.map(doc => doc.id).sort();
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw new Error(`Failed to fetch documents from ${collectionName}`);
  }
}

/**
 * Get a document by ID
 * @param collectionName Name of the collection
 * @param documentId ID of the document
 * @returns Document data
 */
export async function getDocument(collectionName: string, documentId: string): Promise<any> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error(`Document ${documentId} not found in ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error getting document ${documentId} from ${collectionName}:`, error);
    throw new Error(`Failed to fetch document ${documentId} from ${collectionName}`);
  }
}

/**
 * Update a document
 * @param collectionName Name of the collection
 * @param documentId ID of the document
 * @param data Document data
 */
export async function updateDocument(collectionName: string, documentId: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data, { merge: false });
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
    throw new Error(`Failed to update document ${documentId} in ${collectionName}`);
  }
}

/**
 * Create a new document
 * @param collectionName Name of the collection
 * @param documentId Optional document ID (if not provided, one will be generated)
 * @param data Document data
 * @returns ID of the created document
 */
export async function createDocument(collectionName: string, documentId: string | null, data: any): Promise<string> {
  try {
    if (documentId) {
      // Use provided document ID
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, data);
      return documentId;
    } else {
      // Generate automatic document ID
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw new Error(`Failed to create document in ${collectionName}`);
  }
}

/**
 * Delete a document
 * @param collectionName Name of the collection
 * @param documentId ID of the document
 */
export async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${documentId} from ${collectionName}:`, error);
    throw new Error(`Failed to delete document ${documentId} from ${collectionName}`);
  }
} 