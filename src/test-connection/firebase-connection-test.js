// Firebase Connection Test
// This script verifies that the connection to Firebase services is working properly
// It tests:
// 1. Firebase initialization
// 2. Firestore read operations
// 3. Firestore write operations
// 4. Authentication (connection only)
// 5. Storage (connection only)

import { app, auth, db, storage } from '../lib/firebase/config';
import { 
  collection, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp,
  query,
  getDocs,
  limit
} from 'firebase/firestore';

// Test connection to Firestore
const testFirestore = async () => {
  console.log('Testing Firestore connection...');
  
  try {
    // Test collection name - this is a temporary collection for testing
    const TEST_COLLECTION = 'connection_test';
    
    // 1. Create a test document
    console.log('1. Testing document creation...');
    const testData = {
      message: 'Test connection document',
      timestamp: serverTimestamp(),
      testId: `test-${Date.now()}`
    };
    
    const docRef = await addDoc(collection(db, TEST_COLLECTION), testData);
    console.log(`✅ Document created successfully with ID: ${docRef.id}`);
    
    // 2. Read the created document
    console.log('2. Testing document retrieval...');
    const docSnap = await getDoc(doc(db, TEST_COLLECTION, docRef.id));
    
    if (docSnap.exists()) {
      console.log(`✅ Document retrieved successfully: `, docSnap.data());
    } else {
      console.error('❌ Document not found!');
      return false;
    }
    
    // 3. Update the document
    console.log('3. Testing document update...');
    await updateDoc(doc(db, TEST_COLLECTION, docRef.id), {
      message: 'Test connection document - UPDATED',
      updatedAt: serverTimestamp()
    });
    
    // 4. Read again to verify update
    const updatedDocSnap = await getDoc(doc(db, TEST_COLLECTION, docRef.id));
    if (updatedDocSnap.exists() && updatedDocSnap.data().message.includes('UPDATED')) {
      console.log(`✅ Document updated successfully: `, updatedDocSnap.data());
    } else {
      console.error('❌ Document update failed!');
      return false;
    }
    
    // 5. Clean up by deleting the test document
    console.log('5. Testing document deletion...');
    await deleteDoc(doc(db, TEST_COLLECTION, docRef.id));
    console.log(`✅ Document deleted successfully`);
    
    // 6. Query to make sure it's deleted
    const q = query(collection(db, TEST_COLLECTION), limit(10));
    const querySnapshot = await getDocs(q);
    console.log(`Current documents in ${TEST_COLLECTION}: ${querySnapshot.docs.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
};

// Test Firebase Auth connection
const testAuth = async () => {
  console.log('\nTesting Firebase Auth connection...');
  
  try {
    // We're only testing the connection, not actual auth functionality
    if (auth) {
      console.log(`✅ Auth initialized successfully`);
      console.log(`Current user: ${auth.currentUser ? auth.currentUser.email : 'No user logged in'}`);
      return true;
    } else {
      console.error('❌ Auth initialization failed!');
      return false;
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
};

// Test Firebase Storage connection
const testStorage = async () => {
  console.log('\nTesting Firebase Storage connection...');
  
  try {
    if (storage) {
      console.log(`✅ Storage initialized successfully`);
      console.log(`Storage bucket: ${storage.app.options.storageBucket}`);
      return true;
    } else {
      console.error('❌ Storage initialization failed!');
      return false;
    }
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('Starting Firebase Connection Tests...');
  console.log('====================================');
  
  const firestoreResult = await testFirestore();
  const authResult = await testAuth();
  const storageResult = await testStorage();
  
  console.log('\n====================================');
  console.log('Firebase Connection Test Results:');
  console.log(`Firestore: ${firestoreResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Auth: ${authResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Storage: ${storageResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Overall: ${firestoreResult && authResult && storageResult ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
};

// Execute the tests
runAllTests(); 