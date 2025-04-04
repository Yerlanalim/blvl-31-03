'use client';

import { useState, useEffect } from 'react';
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

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'running';
  message?: string;
  data?: any;
}

export default function FirebaseConnectionTest() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Firestore', status: 'pending' },
    { name: 'Auth', status: 'pending' },
    { name: 'Storage', status: 'pending' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  
  // Test connection to Firestore
  const testFirestore = async (): Promise<TestResult> => {
    try {
      setResults(prev => prev.map(r => 
        r.name === 'Firestore' ? { ...r, status: 'running' } : r
      ));
      
      // Test collection name - this is a temporary collection for testing
      const TEST_COLLECTION = 'connection_test';
      
      // 1. Create a test document
      const testData = {
        message: 'Test connection document',
        timestamp: serverTimestamp(),
        testId: `test-${Date.now()}`
      };
      
      const docRef = await addDoc(collection(db, TEST_COLLECTION), testData);
      
      // 2. Read the created document
      const docSnap = await getDoc(doc(db, TEST_COLLECTION, docRef.id));
      
      if (!docSnap.exists()) {
        throw new Error('Document not found after creation');
      }
      
      // 3. Update the document
      await updateDoc(doc(db, TEST_COLLECTION, docRef.id), {
        message: 'Test connection document - UPDATED',
        updatedAt: serverTimestamp()
      });
      
      // 4. Read again to verify update
      const updatedDocSnap = await getDoc(doc(db, TEST_COLLECTION, docRef.id));
      if (!updatedDocSnap.exists() || !updatedDocSnap.data().message.includes('UPDATED')) {
        throw new Error('Document update failed');
      }
      
      // 5. Clean up by deleting the test document
      await deleteDoc(doc(db, TEST_COLLECTION, docRef.id));
      
      // 6. Query to make sure it's deleted
      const q = query(collection(db, TEST_COLLECTION), limit(10));
      const querySnapshot = await getDocs(q);
      
      return { 
        name: 'Firestore', 
        status: 'success',
        message: 'Successfully performed create, read, update, and delete operations',
        data: { 
          remainingDocs: querySnapshot.docs.length,
          testId: testData.testId
        }
      };
    } catch (error) {
      console.error('❌ Firestore test failed:', error);
      return { 
        name: 'Firestore', 
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  // Test Firebase Auth connection
  const testAuth = async (): Promise<TestResult> => {
    try {
      setResults(prev => prev.map(r => 
        r.name === 'Auth' ? { ...r, status: 'running' } : r
      ));
      
      // We're only testing the connection, not actual auth functionality
      if (auth) {
        return { 
          name: 'Auth', 
          status: 'success',
          message: 'Auth is initialized correctly',
          data: {
            currentUser: auth.currentUser ? auth.currentUser.email : 'No user logged in'
          }
        };
      } else {
        throw new Error('Auth initialization failed');
      }
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      return { 
        name: 'Auth', 
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  // Test Firebase Storage connection
  const testStorage = async (): Promise<TestResult> => {
    try {
      setResults(prev => prev.map(r => 
        r.name === 'Storage' ? { ...r, status: 'running' } : r
      ));
      
      if (storage) {
        return { 
          name: 'Storage', 
          status: 'success',
          message: 'Storage is initialized correctly',
          data: {
            storageBucket: storage.app.options.storageBucket
          }
        };
      } else {
        throw new Error('Storage initialization failed');
      }
    } catch (error) {
      console.error('❌ Storage test failed:', error);
      return { 
        name: 'Storage', 
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  const runTests = async () => {
    setIsRunning(true);
    setTestComplete(false);
    
    try {
      const firestoreResult = await testFirestore();
      setResults(prev => prev.map(r => r.name === 'Firestore' ? firestoreResult : r));
      
      const authResult = await testAuth();
      setResults(prev => prev.map(r => r.name === 'Auth' ? authResult : r));
      
      const storageResult = await testStorage();
      setResults(prev => prev.map(r => r.name === 'Storage' ? storageResult : r));
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
      setTestComplete(true);
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{result.name}</h2>
              <div className="flex items-center">
                {result.status === 'pending' && <span className="text-gray-500">Pending</span>}
                {result.status === 'running' && <span className="text-blue-500">Running...</span>}
                {result.status === 'success' && <span className="text-green-500">✅ Success</span>}
                {result.status === 'error' && <span className="text-red-500">❌ Failed</span>}
              </div>
            </div>
            
            {(result.status === 'success' || result.status === 'error') && (
              <div className="mt-2">
                <p className="text-sm">{result.message}</p>
                {result.data && (
                  <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {testComplete && (
        <div className="mt-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Overall Result</h2>
          <p className={results.every(r => r.status === 'success') ? 'text-green-500' : 'text-red-500'}>
            {results.every(r => r.status === 'success') 
              ? '✅ All tests passed! Firebase connection is working properly.'
              : '❌ Some tests failed. There might be issues with the Firebase connection.'}
          </p>
        </div>
      )}
    </div>
  );
} 