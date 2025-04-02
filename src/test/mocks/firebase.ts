import { vi } from 'vitest';

// Мок для Firebase App
const appMock = {
  name: 'testApp',
  options: {},
  automaticDataCollectionEnabled: false,
};

// Мок для Firebase Auth
const authMock = {
  currentUser: null,
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updatePassword: vi.fn(),
  updateEmail: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
};

// Мок для Firestore
const dbMock = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  writeBatch: vi.fn(),
  increment: vi.fn(),
};

// Мок для Storage
const storageMock = {
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
  listAll: vi.fn(),
};

// Создаем моки для использования в тестах
vi.mock('firebase/app', async () => {
  const actual = await vi.importActual('firebase/app');
  return {
    ...actual,
    initializeApp: vi.fn(() => appMock),
    getApp: vi.fn(() => appMock),
    getApps: vi.fn(() => []),
  };
});

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(() => authMock),
    signInWithEmailAndPassword: authMock.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: authMock.createUserWithEmailAndPassword,
    signOut: authMock.signOut,
    sendPasswordResetEmail: authMock.sendPasswordResetEmail,
    updatePassword: authMock.updatePassword,
    updateEmail: authMock.updateEmail,
    reauthenticateWithCredential: authMock.reauthenticateWithCredential,
    onAuthStateChanged: authMock.onAuthStateChanged,
    EmailAuthProvider: {
      credential: vi.fn(),
    },
  };
});

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => dbMock),
    collection: dbMock.collection,
    doc: dbMock.doc,
    getDoc: dbMock.getDoc,
    getDocs: dbMock.getDocs,
    setDoc: dbMock.setDoc,
    updateDoc: dbMock.updateDoc,
    deleteDoc: dbMock.deleteDoc,
    query: dbMock.query,
    where: dbMock.where,
    orderBy: dbMock.orderBy,
    limit: dbMock.limit,
    serverTimestamp: dbMock.serverTimestamp,
    arrayUnion: dbMock.arrayUnion,
    arrayRemove: dbMock.arrayRemove,
    writeBatch: dbMock.writeBatch,
    increment: dbMock.increment,
  };
});

vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual('firebase/storage');
  return {
    ...actual,
    getStorage: vi.fn(() => storageMock),
    ref: storageMock.ref,
    uploadBytes: storageMock.uploadBytes,
    uploadBytesResumable: storageMock.uploadBytesResumable,
    getDownloadURL: storageMock.getDownloadURL,
    deleteObject: storageMock.deleteObject,
    listAll: storageMock.listAll,
  };
});

// Мок для Firebase конфигурации
vi.mock('@/lib/firebase', () => ({
  app: appMock,
  auth: authMock,
  db: dbMock,
  storage: storageMock,
}));

// Экспортируем моки для использования в тестах
export {
  appMock,
  authMock,
  dbMock,
  storageMock,
}; 