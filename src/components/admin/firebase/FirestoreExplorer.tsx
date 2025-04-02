'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash, RefreshCw, FileEdit, Search } from 'lucide-react';
import { toast } from 'sonner';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  getFirestore 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface for collection data
interface CollectionData {
  id: string;
  docCount: number;
}

// Interface for document data
interface DocumentData {
  id: string;
  data: Record<string, any>;
}

export default function FirestoreExplorer() {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newDocumentId, setNewDocumentId] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Fetch collections when component mounts
  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch documents when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchDocuments(selectedCollection);
    }
  }, [selectedCollection]);

  // Update document content when selected document changes
  useEffect(() => {
    if (selectedDocument) {
      setDocumentContent(JSON.stringify(selectedDocument.data, null, 2));
    } else {
      setDocumentContent('');
    }
  }, [selectedDocument]);

  // Fetch all collections from Firestore
  const fetchCollections = async () => {
    setLoading(true);
    try {
      const collectionsSnapshot = await getDocs(collection(db, '__collection__'));
      const collectionsList: CollectionData[] = [];
      
      // Since we can't directly get collection names, we have to fetch them indirectly
      // This is a mock approach - in a real app, you would use Firebase Admin SDK or store metadata
      // For now, we'll use a predefined list of common collections in the app
      const commonCollections = [
        'users', 
        'levels', 
        'artifacts', 
        'userProgress', 
        'faq', 
        'chatHistory'
      ];
      
      for (const collName of commonCollections) {
        try {
          const docsSnapshot = await getDocs(collection(db, collName));
          collectionsList.push({
            id: collName,
            docCount: docsSnapshot.size
          });
        } catch (error) {
          console.warn(`Collection ${collName} not found or not accessible`);
        }
      }
      
      setCollections(collectionsList);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents from a specific collection
  const fetchDocuments = async (collectionName: string) => {
    setLoading(true);
    try {
      const docsSnapshot = await getDocs(collection(db, collectionName));
      const docsList = docsSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));
      setDocuments(docsList);
    } catch (error) {
      console.error(`Error fetching documents from ${collectionName}:`, error);
      toast.error(`Failed to fetch documents from ${collectionName}`);
    } finally {
      setLoading(false);
    }
  };

  // Load a specific document
  const loadDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSelectedDocument({
          id: docSnap.id,
          data: docSnap.data()
        });
        setIsDocumentDialogOpen(true);
      } else {
        toast.error(`Document ${documentId} not found`);
      }
    } catch (error) {
      console.error(`Error loading document ${documentId}:`, error);
      toast.error(`Failed to load document ${documentId}`);
    }
  };

  // Save document changes
  const saveDocument = async () => {
    if (!selectedCollection || !selectedDocument) return;
    
    try {
      let jsonData: Record<string, any>;
      try {
        jsonData = JSON.parse(documentContent);
      } catch (parseError) {
        toast.error('Invalid JSON format');
        return;
      }
      
      const docRef = doc(db, selectedCollection, selectedDocument.id);
      await setDoc(docRef, jsonData);
      toast.success('Document saved successfully');
      
      // Refresh the document list
      fetchDocuments(selectedCollection);
      setIsDocumentDialogOpen(false);
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  // Create a new document
  const createDocument = async () => {
    if (!selectedCollection) return;
    
    try {
      let jsonData: Record<string, any>;
      try {
        jsonData = JSON.parse(documentContent);
      } catch (parseError) {
        toast.error('Invalid JSON format');
        return;
      }
      
      if (newDocumentId.trim()) {
        // Use custom ID
        const docRef = doc(db, selectedCollection, newDocumentId);
        await setDoc(docRef, jsonData);
      } else {
        // Generate automatic ID
        await addDoc(collection(db, selectedCollection), jsonData);
      }
      
      toast.success('Document created successfully');
      
      // Refresh the document list
      fetchDocuments(selectedCollection);
      setIsDocumentDialogOpen(false);
      setIsCreateMode(false);
      setNewDocumentId('');
      setDocumentContent('');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  // Delete a document
  const deleteDocument = async () => {
    if (!selectedCollection || !selectedDocument) return;
    
    try {
      const docRef = doc(db, selectedCollection, selectedDocument.id);
      await deleteDoc(docRef);
      toast.success('Document deleted successfully');
      
      // Refresh the document list
      fetchDocuments(selectedCollection);
      setIsDeleteDialogOpen(false);
      setIsDocumentDialogOpen(false);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  // Handle creating a new document
  const handleNewDocument = () => {
    setIsCreateMode(true);
    setSelectedDocument(null);
    setDocumentContent('{\n  \n}');
    setNewDocumentId('');
    setIsDocumentDialogOpen(true);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Firestore Explorer</CardTitle>
        <CardDescription>
          Просмотр и редактирование данных в Firestore
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 h-full p-0 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Загрузка...</span>
          </div>
        )}
        
        {!loading && (
          <div className="flex h-full">
            {/* Collections sidebar */}
            <div className="w-64 border-r p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Коллекции</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={fetchCollections}
                  title="Обновить"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-1">
                  {collections.map((coll) => (
                    <Button
                      key={coll.id}
                      variant={selectedCollection === coll.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedCollection(coll.id)}
                    >
                      {coll.id}
                      <Badge className="ml-auto">{coll.docCount}</Badge>
                    </Button>
                  ))}
                  {collections.length === 0 && (
                    <div className="text-sm text-muted-foreground py-2">
                      Нет доступных коллекций
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Documents section */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {selectedCollection ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{selectedCollection}</h3>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Поиск документов..."
                          className="pl-8 w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleNewDocument} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Новый документ
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID документа</TableHead>
                          <TableHead>Поля</TableHead>
                          <TableHead className="w-[100px]">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.id}</TableCell>
                            <TableCell>
                              {Object.keys(doc.data).length} полей
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadDocument(selectedCollection, doc.id)}
                              >
                                <FileEdit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredDocuments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                              {searchQuery
                                ? 'Ничего не найдено. Попробуйте изменить запрос.'
                                : 'Нет документов в этой коллекции.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Выберите коллекцию слева для просмотра документов
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Document edit dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode
                ? 'Создать новый документ'
                : `Редактировать документ: ${selectedDocument?.id}`}
            </DialogTitle>
            <DialogDescription>
              {isCreateMode
                ? 'Введите ID документа (опционально) и содержимое в формате JSON'
                : 'Редактируйте содержимое документа в формате JSON'}
            </DialogDescription>
          </DialogHeader>
          
          {isCreateMode && (
            <div className="mb-4">
              <label className="text-sm font-medium">
                ID документа (оставьте пустым для автоматической генерации)
              </label>
              <Input
                value={newDocumentId}
                onChange={(e) => setNewDocumentId(e.target.value)}
                placeholder="Введите ID или оставьте пустым"
                className="mt-1"
              />
            </div>
          )}
          
          <div className="flex-1 min-h-[300px] overflow-hidden">
            <label className="text-sm font-medium">JSON содержимое</label>
            <ScrollArea className="h-[300px] border rounded-md mt-1 font-mono">
              <textarea
                className="w-full h-full p-2 text-sm font-mono focus:outline-none resize-none"
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                style={{ minHeight: '300px' }}
              />
            </ScrollArea>
          </div>
          
          <DialogFooter className="gap-2 mt-4">
            {!isCreateMode && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDocumentDialogOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={isCreateMode ? createDocument : saveDocument}
            >
              {isCreateMode ? 'Создать' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит документ &quot;{selectedDocument?.id}&quot; из коллекции &quot;{selectedCollection}&quot;. 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 