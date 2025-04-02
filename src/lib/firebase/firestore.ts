import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  deleteDoc,
  query,
  QueryConstraint,
  serverTimestamp, 
  DocumentReference,
  DocumentData,
  Timestamp,
  QuerySnapshot,
  CollectionReference,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment,
  where
} from 'firebase/firestore';
import { app } from './config';

// Получаем инстанс Firestore
const firestore = getFirestore(app);

// Constants for collection names
export const USERS_COLLECTION = 'users';
export const USER_PROGRESS_COLLECTION = 'userProgress';
export const LEVELS_COLLECTION = 'levels';
export const ARTIFACTS_COLLECTION = 'artifacts';
export const FAQ_COLLECTION = 'faq';
export const CHATS_COLLECTION = 'chats';
export const MESSAGES_SUBCOLLECTION = 'messages';

/**
 * Получение документа по ID из указанной коллекции
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @returns Promise с данными документа или null, если документ не найден
 */
export const getDocumentById = async <T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertTimestampToDate<T>(docSnap.data() as T);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при получении документа ${documentId} из ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Получение списка документов из коллекции с возможностью фильтрации
 * @param collectionName Название коллекции
 * @param queryConstraints Ограничения запроса (where, orderBy, limit и т.д.)
 * @returns Promise со списком документов
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      convertTimestampToDate<T>({ id: doc.id, ...doc.data() } as T)
    );
  } catch (error) {
    console.error(`Ошибка при получении документов из ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Создание нового документа в коллекции
 * @param collectionName Название коллекции
 * @param data Данные для создания документа
 * @param documentId Опциональный ID документа (если не указан, будет сгенерирован автоматически)
 * @returns Promise с ID созданного документа
 */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  documentId?: string
): Promise<string> => {
  try {
    const collectionRef = collection(firestore, collectionName);
    const docRef = documentId 
      ? doc(collectionRef, documentId) 
      : doc(collectionRef);
    
    const docData = convertDateToTimestamp<T>({
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    await setDoc(docRef, docData);
    return docRef.id;
  } catch (error) {
    console.error(`Ошибка при создании документа в ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Сохранение документа в указанную коллекцию с заданным ID
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @param data Данные для сохранения
 * @returns Promise без возвращаемого значения
 */
export const saveDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    const docData = convertDateToTimestamp<T>({
      ...data,
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, docData);
  } catch (error) {
    console.error(`Ошибка при сохранении документа ${documentId} в ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Обновление существующего документа
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @param data Данные для обновления
 * @returns Promise без возвращаемого значения
 */
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    const docData = convertDateToTimestamp<T>({
      ...data,
      updatedAt: serverTimestamp()
    });
    await updateDoc(docRef, docData);
  } catch (error) {
    console.error(`Ошибка при обновлении документа ${documentId} в ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Удаление документа из коллекции
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @returns Promise без возвращаемого значения
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Ошибка при удалении документа ${documentId} из ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Получение снимка коллекции
 * @param collectionName Название коллекции
 * @param queryConstraints Ограничения запроса (where, orderBy, limit и т.д.)
 * @returns Promise со снимком коллекции
 */
export const getCollectionSnapshot = async <T = DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<QuerySnapshot> => {
  try {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    return await getDocs(q);
  } catch (error) {
    console.error(`Ошибка при получении снимка коллекции ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Получение документов из подколлекции
 * @param collectionName Название родительской коллекции
 * @param documentId ID родительского документа
 * @param subcollectionName Название подколлекции
 * @returns Promise со списком документов из подколлекции
 */
export const getSubcollectionDocuments = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  subcollectionName: string
): Promise<T[]> => {
  try {
    const subcollectionRef = collection(
      firestore, 
      collectionName, 
      documentId, 
      subcollectionName
    );
    const querySnapshot = await getDocs(subcollectionRef);
    
    return querySnapshot.docs.map(doc => 
      convertTimestampToDate<T>({ id: doc.id, ...doc.data() } as T)
    );
  } catch (error) {
    console.error(`Ошибка при получении документов из подколлекции ${subcollectionName}:`, error);
    throw error;
  }
};

/**
 * Добавление элемента в массив
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @param field Название поля с массивом
 * @param item Элемент для добавления
 * @returns Promise без возвращаемого значения
 */
export const arrayUnionItem = async <T>(
  collectionName: string,
  documentId: string,
  field: string,
  item: any
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: arrayUnion(item),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Ошибка при добавлении элемента в массив ${field}:`, error);
    throw error;
  }
};

/**
 * Удаление элемента из массива
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @param field Название поля с массивом
 * @param item Элемент для удаления
 * @returns Promise без возвращаемого значения
 */
export const arrayRemoveItem = async <T>(
  collectionName: string,
  documentId: string,
  field: string,
  item: any
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: arrayRemove(item),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Ошибка при удалении элемента из массива ${field}:`, error);
    throw error;
  }
};

/**
 * Инкрементирование счетчика
 * @param collectionName Название коллекции
 * @param documentId ID документа
 * @param field Название поля со счетчиком
 * @param value Значение инкремента (по умолчанию 1)
 * @returns Promise без возвращаемого значения
 */
export const incrementCounter = async (
  collectionName: string,
  documentId: string,
  field: string,
  value: number = 1
): Promise<void> => {
  try {
    const docRef = doc(firestore, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: increment(value),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Ошибка при инкрементировании счетчика ${field}:`, error);
    throw error;
  }
};

/**
 * Выполнение пакетной операции
 * @param operations Массив операций для выполнения
 * @returns Promise без возвращаемого значения
 */
export const batchWrite = async (
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    collectionName: string;
    documentId: string;
    data?: any;
  }>
): Promise<void> => {
  try {
    const batch = writeBatch(firestore);
    
    for (const operation of operations) {
      const docRef = doc(firestore, operation.collectionName, operation.documentId);
      
      switch (operation.type) {
        case 'create':
          batch.set(
            docRef, 
            convertDateToTimestamp({
              ...operation.data,
              createdAt: operation.data.createdAt || serverTimestamp(),
              updatedAt: serverTimestamp()
            })
          );
          break;
        case 'update':
          batch.update(
            docRef, 
            convertDateToTimestamp({
              ...operation.data,
              updatedAt: serverTimestamp()
            })
          );
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Ошибка при выполнении пакетной операции:', error);
    throw error;
  }
};

/**
 * Создание документа пользователя в коллекции users
 * @param userId ID пользователя (совпадает с UID в Firebase Auth)
 * @param userData Данные пользователя (email, displayName, photoURL)
 * @returns Promise с созданными данными пользователя
 */
export const createUserDocument = async (
  userId: string,
  userData: {
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
  }
): Promise<UserDocument> => {
  try {
    // Создаем структуру данных пользователя
    const userDoc: UserDocument = {
      email: userData.email,
      displayName: userData.displayName || null,
      photoURL: userData.photoURL || null,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      settings: {
        theme: 'light',
        notifications: true,
        emailNotifications: true
      }
    };

    // Сохраняем документ в коллекцию users
    await saveDocument(USERS_COLLECTION, userId, userDoc);
    
    return userDoc;
  } catch (error) {
    console.error(`Ошибка при создании документа пользователя ${userId}:`, error);
    throw error;
  }
};

/**
 * Преобразование Firestore Timestamp в JavaScript Date
 * @param data Данные с Timestamp
 * @returns Данные с преобразованными Date
 */
export const convertTimestampToDate = <T>(data: any): T => {
  if (!data) return data;
  
  if (data instanceof Timestamp) {
    return data.toDate() as any;
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => convertTimestampToDate(item)) as any;
  }
  
  const result: any = {};
  
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      result[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      result[key] = convertTimestampToDate(data[key]);
    } else {
      result[key] = data[key];
    }
  }
  
  return result as T;
};

/**
 * Преобразование JavaScript Date в Firestore Timestamp
 * @param data Данные с Date
 * @returns Данные с преобразованными Timestamp
 */
export const convertDateToTimestamp = <T>(data: any): T => {
  if (!data) return data;
  
  if (data instanceof Date) {
    return Timestamp.fromDate(data) as any;
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => convertDateToTimestamp(item)) as any;
  }
  
  const result: any = {};
  
  for (const key in data) {
    if (data[key] instanceof Date) {
      result[key] = Timestamp.fromDate(data[key]);
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      result[key] = convertDateToTimestamp(data[key]);
    } else {
      result[key] = data[key];
    }
  }
  
  return result as T;
};

// Типы данных
export interface UserDocument {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailNotifications: boolean;
  };
}

// Получение роли пользователя по его UID
export async function getUserRole(uid: string): Promise<string> {
  try {
    const userDoc = await getDocumentById('users', uid);
    if (!userDoc) {
      console.warn(`User document not found for uid: ${uid}`);
      return 'user'; // Default role if no document found
    }
    
    return userDoc.role || 'user'; // Return 'user' if role field is not present
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
}

// Экспортируем firestore для использования в других файлах
export { firestore }; 