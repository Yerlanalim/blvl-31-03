'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, ListFilter } from 'lucide-react';
import { LevelsList, LevelFormDialog, LevelOrderManager, LevelDetailView } from '@/components/admin/levels';
import { useAdminLevels } from '@/hooks/useAdminLevels';
import { Level } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function AdminLevelsPage() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'reorder'>('list');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  
  // Get levels data
  const { 
    data: levels = [], 
    isLoading, 
    error,
    refetch,
    isRefetching
  } = useAdminLevels();
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    setSelectedLevel(null);
  };
  
  // Handle selecting a level for detailed view
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
  };
  
  // Handle back from detailed view
  const handleBackToList = () => {
    setSelectedLevel(null);
  };
  
  // Handle after edit or delete to update the view
  const handleAfterChange = () => {
    refetch();
    setSelectedLevel(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Управление уровнями</h2>
          <p className="text-muted-foreground">
            Создание, редактирование и управление порядком уровней обучения
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Обновить</span>
          </Button>
          <Button 
            className="gap-1"
            onClick={() => setIsFormDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Добавить уровень</span>
          </Button>
        </div>
      </div>
      
      {/* If a level is selected, show detailed view */}
      {selectedLevel ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={handleBackToList}>
            ← Вернуться к списку
          </Button>
          <LevelDetailView 
            level={selectedLevel}
            onEdit={handleAfterChange}
            onDelete={handleAfterChange}
          />
        </div>
      ) : (
        /* Otherwise show main interface */
        <Tabs defaultValue="list" value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'reorder')}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="list" className="gap-1">
                <ListFilter className="h-4 w-4" />
                Список уровней
              </TabsTrigger>
              <TabsTrigger value="reorder" className="gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m3 16 4 4 4-4"/>
                  <path d="M7 20V4"/>
                  <path d="m21 8-4-4-4 4"/>
                  <path d="M17 4v16"/>
                </svg>
                Управление порядком
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Список уровней</CardTitle>
                <CardDescription>
                  Управление уровнями обучения на платформе
                  {levels.length > 0 && ` • Всего уровней: ${levels.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LevelsList
                  levels={levels}
                  isLoading={isLoading}
                  error={error as Error}
                  onSelectLevel={handleSelectLevel}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reorder">
            <LevelOrderManager
              levels={levels}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {/* Dialog for creating new level */}
      <LevelFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
      />
    </div>
  );
} 