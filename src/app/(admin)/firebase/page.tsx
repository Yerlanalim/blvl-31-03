'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import FirestoreExplorer from '@/components/admin/firebase/FirestoreExplorer';
import StorageExplorer from '@/components/admin/firebase/StorageExplorer';
import DatabaseBrowser from '@/components/admin/firebase/DatabaseBrowser';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Database, HardDrive } from 'lucide-react';

export default function FirebasePage() {
  const [selectedTab, setSelectedTab] = useState<string>('firestore');
  
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Firebase Explorer</h1>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Важно</AlertTitle>
        <AlertDescription>
          Этот инструмент предоставляет прямой доступ к данным Firebase. Пожалуйста, будьте осторожны при внесении изменений.
          Любые изменения вступают в силу немедленно и могут повлиять на работу приложения.
        </AlertDescription>
      </Alert>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="firestore" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Firestore Database
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center">
            <HardDrive className="mr-2 h-4 w-4" />
            Storage
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="firestore" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-250px)]">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Навигация</CardTitle>
                  <CardDescription>
                    Коллекции и документы
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100vh-350px)]">
                  <DatabaseBrowser 
                    onSelectNode={(nodeType, path, id) => {
                      console.log(`Selected ${nodeType}: ${id} at ${path}`);
                      // This is just for logging, the main action happens in components
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <FirestoreExplorer />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="storage" className="flex-1">
          <StorageExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
} 